import React, {useMemo, useState} from 'react';

const SCENARIOS = {
  ecommerce: {
    label: 'E-commerce checkout',
    baseWrite: 55,
    baseRead: 38,
    entities: ['orders', 'order_items', 'payments', 'shipments'],
    recommendedIndex: 'idx_orders_customer_created (customer_id, created_at DESC)',
  },
  ride: {
    label: 'Ride sharing trip flow',
    baseWrite: 48,
    baseRead: 28,
    entities: ['trips', 'trip_status_history', 'drivers', 'pricing_quotes'],
    recommendedIndex: 'idx_trips_rider_created (rider_id, created_at DESC)',
  },
  support: {
    label: 'Support ticket lifecycle',
    baseWrite: 35,
    baseRead: 24,
    entities: ['tickets', 'ticket_events', 'agents', 'sla_policies'],
    recommendedIndex: 'idx_tickets_status_updated (status, updated_at DESC)',
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

export default function CaseStudyPlayground() {
  const [scenario, setScenario] = useState('ecommerce');
  const [qps, setQps] = useState(120);
  const [hasCompositeIndex, setHasCompositeIndex] = useState(true);
  const [hasIdempotency, setHasIdempotency] = useState(true);
  const [hasAuditTrail, setHasAuditTrail] = useState(true);
  const [retries, setRetries] = useState(2);

  const config = SCENARIOS[scenario];

  const metrics = useMemo(() => {
    const writePenalty = hasIdempotency ? 4 : 0;
    const auditPenalty = hasAuditTrail ? 6 : 0;
    const retryPenalty = retries * (hasIdempotency ? 1 : 12);

    const readMultiplier = hasCompositeIndex ? 1 : 2.6;
    const qpsPressure = qps / 100;

    const writeP95 = Math.round((config.baseWrite + writePenalty + auditPenalty + retryPenalty) * qpsPressure);
    const readP95 = Math.round(config.baseRead * readMultiplier * qpsPressure);

    const duplicateRisk = hasIdempotency ? clamp(retries * 2, 0, 12) : clamp(20 + retries * 18, 0, 100);
    const auditReadiness = hasAuditTrail ? 92 : 34;
    const indexFitScore = hasCompositeIndex ? 95 : 45;

    let verdict = 'Good';
    if (duplicateRisk > 40 || readP95 > 140) verdict = 'Risky';
    if (duplicateRisk < 12 && readP95 < 80 && writeP95 < 110 && hasAuditTrail) verdict = 'Best';

    return {writeP95, readP95, duplicateRisk, auditReadiness, indexFitScore, verdict};
  }, [config, qps, hasCompositeIndex, hasIdempotency, hasAuditTrail, retries]);

  return (
    <div className="case-playground">
      <h2>Interactive case-study playground</h2>
      <p>
        Tweak production-like settings and see how schema decisions (indexing, idempotency, audit trail)
        affect latency and reliability.
      </p>

      <div className="case-playground-grid">
        <section className="case-card">
          <h3>Scenario setup</h3>

          <label>
            Use case
            <select value={scenario} onChange={e => setScenario(e.target.value)}>
              {Object.entries(SCENARIOS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>

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
            {config.entities.map(entity => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>

          <p>
            <strong>Recommended index:</strong> {config.recommendedIndex}
          </p>
        </section>
      </div>
    </div>
  );
}
