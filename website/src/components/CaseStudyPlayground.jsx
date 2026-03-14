import React, {useMemo, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const PRESET_BY_KEYWORD = [
  {
    keys: ['food-delivery', 'restaurant-pos', 'grocery-quick-commerce', 'meal-subscription'],
    label: 'Order fulfillment systems',
    baseWrite: 58,
    baseRead: 34,
    entities: ['orders', 'order_items', 'status_history', 'payments', 'delivery_assignments'],
    recommendedIndex: 'idx_orders_customer_created (customer_id, created_at DESC)',
    tip: 'Prioritize status transition integrity so cancellation, refund, and dispatch states never conflict.',
  },
  {
    keys: ['ride-sharing', 'car-rental', 'travel-itinerary-booking', 'airline-reservation'],
    label: 'Mobility & booking systems',
    baseWrite: 50,
    baseRead: 30,
    entities: ['bookings', 'inventory_slots', 'pricing_quotes', 'booking_events'],
    recommendedIndex: 'idx_bookings_user_tripdate (user_id, trip_date DESC)',
    tip: 'Use idempotent booking confirmation and hold-expiry logic to avoid overbooking under retries.',
  },
  {
    keys: ['banking-core-ledger', 'wallet-ledger', 'saas-subscription-billing', 'loan-origination', 'insurance-policy-claims'],
    label: 'Ledger and financial workflows',
    baseWrite: 67,
    baseRead: 29,
    entities: ['accounts', 'ledger_entries', 'payment_intents', 'reconciliation_runs'],
    recommendedIndex: 'idx_ledger_account_time (account_id, created_at DESC)',
    tip: 'Immutable entries + reconciliation reads are more important than aggressive denormalization.',
  },
  {
    keys: ['messaging-chat', 'notification-platform', 'video-conferencing', 'microblogging-social-feed', 'short-video-platform'],
    label: 'Realtime communication',
    baseWrite: 47,
    baseRead: 42,
    entities: ['messages', 'delivery_receipts', 'conversation_participants', 'fanout_jobs'],
    recommendedIndex: 'idx_messages_conversation_time (conversation_id, created_at DESC)',
    tip: 'Optimize hot read paths (recent timeline/inbox) with strict pagination and write fanout controls.',
  },
  {
    keys: ['hr-payroll', 'school-management', 'learning-management-system', 'e-learning-live-classes', 'online-exam-proctoring'],
    label: 'Education & workforce systems',
    baseWrite: 40,
    baseRead: 27,
    entities: ['users', 'enrollments', 'sessions', 'progress_events', 'audit_logs'],
    recommendedIndex: 'idx_progress_user_time (user_id, updated_at DESC)',
    tip: 'Keep auditability and role-based ownership explicit for compliance-heavy data access.',
  },
  {
    keys: ['ad-tech-bidding', 'api-rate-limiting', 'fraud-risk-engine', 'feature-flag-platform', 'observability-metrics-logs', 'search-indexing'],
    label: 'High-throughput control planes',
    baseWrite: 54,
    baseRead: 36,
    entities: ['events', 'policy_rules', 'evaluations', 'aggregates'],
    recommendedIndex: 'idx_eval_subject_time (subject_id, created_at DESC)',
    tip: 'Model burst traffic + retries first; these systems fail from cardinality and write amplification.',
  },
];

const DEFAULT_PRESET = {
  label: 'General case-study workload',
  baseWrite: 45,
  baseRead: 32,
  entities: ['primary_records', 'record_items', 'status_history', 'idempotency_keys', 'audit_logs'],
  recommendedIndex: 'idx_records_status_created (status, created_at DESC)',
  tip: 'Start from top read/write APIs and align constraints + indexes directly with those query shapes.',
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function getPreset(caseSlug) {
  if (!caseSlug) return DEFAULT_PRESET;
  const hit = PRESET_BY_KEYWORD.find(group => group.keys.some(key => caseSlug.includes(key)));
  return hit || DEFAULT_PRESET;
}

export default function CaseStudyPlayground({caseSlug}) {
  const {siteConfig} = useDocusaurusContext();
  const runtimeSlug =
    caseSlug || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('case') : '');

  const preset = getPreset(runtimeSlug || '');

  const [qps, setQps] = useState(120);
  const [hasCompositeIndex, setHasCompositeIndex] = useState(true);
  const [hasIdempotency, setHasIdempotency] = useState(true);
  const [hasAuditTrail, setHasAuditTrail] = useState(true);
  const [retries, setRetries] = useState(2);

  const metrics = useMemo(() => {
    const writePenalty = hasIdempotency ? 4 : 0;
    const auditPenalty = hasAuditTrail ? 6 : 0;
    const retryPenalty = retries * (hasIdempotency ? 1 : 12);

    const readMultiplier = hasCompositeIndex ? 1 : 2.6;
    const qpsPressure = qps / 100;

    const writeP95 = Math.round((preset.baseWrite + writePenalty + auditPenalty + retryPenalty) * qpsPressure);
    const readP95 = Math.round(preset.baseRead * readMultiplier * qpsPressure);

    const duplicateRisk = hasIdempotency ? clamp(retries * 2, 0, 12) : clamp(20 + retries * 18, 0, 100);
    const auditReadiness = hasAuditTrail ? 92 : 34;
    const indexFitScore = hasCompositeIndex ? 95 : 45;

    let verdict = 'Good';
    if (duplicateRisk > 40 || readP95 > 140) verdict = 'Risky';
    if (duplicateRisk < 12 && readP95 < 80 && writeP95 < 110 && hasAuditTrail) verdict = 'Best';

    return {writeP95, readP95, duplicateRisk, auditReadiness, indexFitScore, verdict};
  }, [preset, qps, hasCompositeIndex, hasIdempotency, hasAuditTrail, retries]);

  const baseUrl = siteConfig.baseUrl || '/';

  return (
    <div className="case-playground">
      <h2>Interactive case-study playground</h2>
      <p>
        Preset: <strong>{preset.label}</strong>
        {runtimeSlug ? <span> · case: <code>{runtimeSlug}</code></span> : null}
      </p>
      <p>{preset.tip}</p>

      <div className="case-playground-grid">
        <section className="case-card">
          <h3>Scenario setup</h3>

          <label>
            Request load (QPS): <strong>{qps}</strong>
            <input
              type="range"
              min="20"
              max="600"
              step="10"
              value={qps}
              onChange={e => setQps(Number(e.target.value))}
            />
          </label>

          <label>
            Retry attempts per write: <strong>{retries}</strong>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={retries}
              onChange={e => setRetries(Number(e.target.value))}
            />
          </label>

          <label className="case-toggle">
            <input
              type="checkbox"
              checked={hasCompositeIndex}
              onChange={e => setHasCompositeIndex(e.target.checked)}
            />
            Composite read index enabled
          </label>

          <label className="case-toggle">
            <input
              type="checkbox"
              checked={hasIdempotency}
              onChange={e => setHasIdempotency(e.target.checked)}
            />
            Idempotency key protection enabled
          </label>

          <label className="case-toggle">
            <input
              type="checkbox"
              checked={hasAuditTrail}
              onChange={e => setHasAuditTrail(e.target.checked)}
            />
            History/audit trail enabled
          </label>
        </section>

        <section className="case-card">
          <h3>Live outcome</h3>
          <div className="metrics">
            <div>
              <span>Write p95</span>
              <strong>{metrics.writeP95} ms</strong>
            </div>
            <div>
              <span>Read p95</span>
              <strong>{metrics.readP95} ms</strong>
            </div>
            <div>
              <span>Duplicate risk</span>
              <strong>{metrics.duplicateRisk}%</strong>
            </div>
            <div>
              <span>Audit readiness</span>
              <strong>{metrics.auditReadiness}%</strong>
            </div>
            <div>
              <span>Index-fit score</span>
              <strong>{metrics.indexFitScore}%</strong>
            </div>
            <div>
              <span>Design tier</span>
              <strong>{metrics.verdict}</strong>
            </div>
          </div>

          <h4>Schema entities in play</h4>
          <ul>
            {preset.entities.map(entity => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>

          <p>
            <strong>Recommended index:</strong> {preset.recommendedIndex}
          </p>

          <p>
            Open another case preset:{' '}
            <a href={`${baseUrl}path/interactive-playground`}>global playground</a>
          </p>
        </section>
      </div>
    </div>
  );
}
