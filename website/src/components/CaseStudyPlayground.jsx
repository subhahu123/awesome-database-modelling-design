import React, {useEffect, useMemo, useState} from 'react';

const DOMAIN_PRESETS = [
  {
    keys: ['food-delivery', 'restaurant-pos', 'grocery-quick-commerce', 'meal-subscription'],
    domain: 'Order fulfillment systems',
    entities: ['orders', 'order_items', 'payments', 'delivery_assignments', 'status_history'],
    primaryRead: 'customer recent orders + store active orders',
    primaryWrite: 'order create -> payment authorize -> dispatch status transitions',
    risk: 'inconsistent order state causing wrong refund/dispatch behavior',
  },
  {
    keys: ['ride-sharing', 'car-rental', 'travel-itinerary-booking', 'airline-reservation', 'hotel-management'],
    domain: 'Booking and mobility systems',
    entities: ['bookings', 'inventory_slots', 'pricing_quotes', 'status_events'],
    primaryRead: 'availability and user itinerary timeline',
    primaryWrite: 'hold -> confirm -> cancel flows under retries',
    risk: 'overbooking from race conditions between hold and confirm',
  },
  {
    keys: ['banking-core-ledger', 'wallet-ledger', 'loan-origination', 'insurance-policy-claims', 'saas-subscription-billing'],
    domain: 'Financial and ledger systems',
    entities: ['accounts', 'ledger_entries', 'payment_intents', 'reconciliation_batches'],
    primaryRead: 'account statement and balance trail',
    primaryWrite: 'double-entry posting + idempotent settlement',
    risk: 'data mutation without immutable audit trail',
  },
  {
    keys: ['messaging-chat', 'notification-platform', 'video-conferencing', 'microblogging-social-feed', 'short-video-platform'],
    domain: 'Realtime communication systems',
    entities: ['messages', 'receipts', 'participants', 'fanout_jobs'],
    primaryRead: 'timeline/inbox recent page',
    primaryWrite: 'message ingest + delivery fanout',
    risk: 'fanout saturation and delayed delivery visibility',
  },
  {
    keys: ['ad-tech-bidding', 'api-rate-limiting', 'fraud-risk-engine', 'feature-flag-platform', 'observability-metrics-logs', 'search-indexing'],
    domain: 'High-throughput control planes',
    entities: ['events', 'rules', 'evaluations', 'aggregates'],
    primaryRead: 'policy/evaluation lookup by subject + recency',
    primaryWrite: 'burst ingest with retry-safe writes',
    risk: 'cardinality explosion and duplicate evaluation writes',
  },
];

const DEFAULT_CONTEXT = {
  domain: 'General transactional system',
  entities: ['primary_records', 'record_items', 'status_history', 'idempotency_keys', 'audit_logs'],
  primaryRead: 'recent list + detail fetch',
  primaryWrite: 'request validate -> transactional write -> history append',
  risk: 'missing state transition observability',
};

const SOLUTION_TEMPLATES = {
  okaish: {
    label: 'Okaish solution',
    indexCoverage: 45,
    idempotency: 20,
    auditCoverage: 35,
    historyDepth: 40,
    readModelQuality: 35,
    partitionReadiness: 20,
    outboxReliability: 25,
    tableCount: 4,
    avgRelationships: 1,
    fkIntegrity: 45,
    normalization: 45,
  },
  good: {
    label: 'Good solution',
    indexCoverage: 70,
    idempotency: 78,
    auditCoverage: 72,
    historyDepth: 75,
    readModelQuality: 68,
    partitionReadiness: 45,
    outboxReliability: 65,
    tableCount: 7,
    avgRelationships: 2,
    fkIntegrity: 72,
    normalization: 70,
  },
  best: {
    label: 'Best solution',
    indexCoverage: 90,
    idempotency: 95,
    auditCoverage: 92,
    historyDepth: 94,
    readModelQuality: 88,
    partitionReadiness: 86,
    outboxReliability: 90,
    tableCount: 10,
    avgRelationships: 3,
    fkIntegrity: 92,
    normalization: 85,
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function contextForCase(caseSlug) {
  if (!caseSlug) return DEFAULT_CONTEXT;
  const match = DOMAIN_PRESETS.find(x => x.keys.some(k => caseSlug.includes(k)));
  return match || DEFAULT_CONTEXT;
}

export default function CaseStudyPlayground({caseSlug}) {
  const context = useMemo(() => contextForCase(caseSlug || ''), [caseSlug]);
  const [solution, setSolution] = useState('good');

  const [qps, setQps] = useState(120);
  const [retryRate, setRetryRate] = useState(2);
  const [concurrency, setConcurrency] = useState(12);

  const [indexCoverage, setIndexCoverage] = useState(70);
  const [idempotency, setIdempotency] = useState(78);
  const [auditCoverage, setAuditCoverage] = useState(72);
  const [historyDepth, setHistoryDepth] = useState(75);
  const [readModelQuality, setReadModelQuality] = useState(68);
  const [partitionReadiness, setPartitionReadiness] = useState(45);
  const [outboxReliability, setOutboxReliability] = useState(65);

  const [tableCount, setTableCount] = useState(7);
  const [avgRelationships, setAvgRelationships] = useState(2);
  const [fkIntegrity, setFkIntegrity] = useState(72);
  const [normalization, setNormalization] = useState(70);

  useEffect(() => {
    const tpl = SOLUTION_TEMPLATES[solution];
    setIndexCoverage(tpl.indexCoverage);
    setIdempotency(tpl.idempotency);
    setAuditCoverage(tpl.auditCoverage);
    setHistoryDepth(tpl.historyDepth);
    setReadModelQuality(tpl.readModelQuality);
    setPartitionReadiness(tpl.partitionReadiness);
    setOutboxReliability(tpl.outboxReliability);
    setTableCount(tpl.tableCount);
    setAvgRelationships(tpl.avgRelationships);
    setFkIntegrity(tpl.fkIntegrity);
    setNormalization(tpl.normalization);
  }, [solution]);

  const metrics = useMemo(() => {
    const loadFactor = qps / 100 + concurrency / 20;

    const schemaComplexity = clamp(tableCount * 5 + avgRelationships * 11, 10, 100);
    const relationshipHealth = (fkIntegrity * 0.6 + normalization * 0.4) / 100;

    const readCapacity =
      (indexCoverage * 0.3 + readModelQuality * 0.35 + partitionReadiness * 0.2 + normalization * 0.15) / 100;
    const writeSafety =
      (idempotency * 0.3 + historyDepth * 0.25 + auditCoverage * 0.15 + outboxReliability * 0.15 + fkIntegrity * 0.15) /
      100;

    const readP95 = Math.round(25 + loadFactor * 42 * (1.3 - readCapacity) + schemaComplexity * 0.08);
    const writeP95 = Math.round(35 + loadFactor * 48 * (1.3 - writeSafety) + schemaComplexity * 0.1);

    const duplicateRisk = clamp(
      Math.round((100 - idempotency) * 0.55 + retryRate * 4 + (100 - outboxReliability) * 0.15),
      1,
      100,
    );
    const auditGap = clamp(Math.round((100 - auditCoverage) * 0.6 + (100 - historyDepth) * 0.25 + (100 - fkIntegrity) * 0.15), 0, 100);
    const scaleRisk = clamp(
      Math.round((100 - partitionReadiness) * 0.35 + (100 - indexCoverage) * 0.3 + concurrency * 0.75 + schemaComplexity * 0.2),
      0,
      100,
    );
    const dataIntegrityRisk = clamp(Math.round((100 - fkIntegrity) * 0.6 + (100 - normalization) * 0.25 + avgRelationships * 2), 0, 100);

    const score = clamp(
      Math.round(
        readCapacity * 100 * 0.28 +
          writeSafety * 100 * 0.32 +
          relationshipHealth * 100 * 0.2 +
          (100 - duplicateRisk) * 0.08 +
          (100 - auditGap) * 0.07 +
          (100 - scaleRisk) * 0.05,
      ),
      0,
      100,
    );

    let verdict = 'Good';
    if (score < 55 || duplicateRisk > 50 || scaleRisk > 65 || dataIntegrityRisk > 55) verdict = 'Risky';
    if (score >= 82 && duplicateRisk < 18 && auditGap < 15 && scaleRisk < 30 && dataIntegrityRisk < 25) {
      verdict = 'Best-ready';
    }

    const dataChanges = [
      idempotency < 40 ? 'Duplicate business rows likely under retries.' : 'Retry safety mostly preserved.',
      fkIntegrity < 50 ? 'Orphan/invalid references likely because FK integrity is weak.' : 'FK constraints keep relationship graph consistent.',
      normalization < 45
        ? 'Heavy denormalization may cause update anomalies across related tables.'
        : 'Normalization level reduces update anomalies and keeps source of truth clearer.',
      readModelQuality < 50 ? 'Dashboard/list queries will scan broader ranges.' : 'Read path remains predictable under pagination.',
    ];

    return {
      readP95,
      writeP95,
      duplicateRisk,
      auditGap,
      scaleRisk,
      dataIntegrityRisk,
      schemaComplexity,
      score,
      verdict,
      dataChanges,
    };
  }, [
    qps,
    retryRate,
    concurrency,
    indexCoverage,
    idempotency,
    auditCoverage,
    historyDepth,
    readModelQuality,
    partitionReadiness,
    outboxReliability,
    tableCount,
    avgRelationships,
    fkIntegrity,
    normalization,
  ]);

  return (
    <div className="case-playground">
      <h3>Case-solution playground (in-context)</h3>
      <p>
        <strong>{context.domain}</strong> · {caseSlug || 'current case study'}
      </p>
      <p>
        <strong>Primary write flow:</strong> {context.primaryWrite}
        <br />
        <strong>Primary read flow:</strong> {context.primaryRead}
        <br />
        <strong>Failure mode to watch:</strong> {context.risk}
      </p>

      <div className="solution-switcher">
        {Object.entries(SOLUTION_TEMPLATES).map(([key, config]) => (
          <button
            key={key}
            type="button"
            className={`button button--sm ${solution === key ? 'button--primary' : 'button--secondary'}`}
            onClick={() => setSolution(key)}>
            Apply {config.label}
          </button>
        ))}
      </div>

      <div className="case-playground-grid">
        <section className="case-card">
          <h4>Workload variables</h4>
          <label>
            QPS: <strong>{qps}</strong>
            <input type="range" min="20" max="800" step="10" value={qps} onChange={e => setQps(Number(e.target.value))} />
          </label>
          <label>
            Retry pressure: <strong>{retryRate}%</strong>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={retryRate}
              onChange={e => setRetryRate(Number(e.target.value))}
            />
          </label>
          <label>
            Concurrent workers: <strong>{concurrency}</strong>
            <input
              type="range"
              min="1"
              max="80"
              step="1"
              value={concurrency}
              onChange={e => setConcurrency(Number(e.target.value))}
            />
          </label>

          <h4>Schema design variables</h4>
          <label>
            Number of tables: <strong>{tableCount}</strong>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={tableCount}
              onChange={e => setTableCount(Number(e.target.value))}
            />
          </label>
          <label>
            Avg relationships / table: <strong>{avgRelationships}</strong>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={avgRelationships}
              onChange={e => setAvgRelationships(Number(e.target.value))}
            />
          </label>
          <label>
            FK integrity coverage: <strong>{fkIntegrity}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={fkIntegrity}
              onChange={e => setFkIntegrity(Number(e.target.value))}
            />
          </label>
          <label>
            Normalization balance: <strong>{normalization}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={normalization}
              onChange={e => setNormalization(Number(e.target.value))}
            />
          </label>

          <h4>Solution variables</h4>
          <label>
            Index coverage: <strong>{indexCoverage}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={indexCoverage}
              onChange={e => setIndexCoverage(Number(e.target.value))}
            />
          </label>
          <label>
            Idempotency strength: <strong>{idempotency}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={idempotency}
              onChange={e => setIdempotency(Number(e.target.value))}
            />
          </label>
          <label>
            Audit coverage: <strong>{auditCoverage}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={auditCoverage}
              onChange={e => setAuditCoverage(Number(e.target.value))}
            />
          </label>
          <label>
            History depth: <strong>{historyDepth}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={historyDepth}
              onChange={e => setHistoryDepth(Number(e.target.value))}
            />
          </label>
          <label>
            Read-model quality: <strong>{readModelQuality}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={readModelQuality}
              onChange={e => setReadModelQuality(Number(e.target.value))}
            />
          </label>
          <label>
            Partition readiness: <strong>{partitionReadiness}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={partitionReadiness}
              onChange={e => setPartitionReadiness(Number(e.target.value))}
            />
          </label>
          <label>
            Outbox reliability: <strong>{outboxReliability}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={outboxReliability}
              onChange={e => setOutboxReliability(Number(e.target.value))}
            />
          </label>
        </section>

        <section className="case-card">
          <h4>Resulting behavior</h4>
          <div className="metrics">
            <div>
              <span>Read p95</span>
              <strong>{metrics.readP95} ms</strong>
            </div>
            <div>
              <span>Write p95</span>
              <strong>{metrics.writeP95} ms</strong>
            </div>
            <div>
              <span>Duplicate risk</span>
              <strong>{metrics.duplicateRisk}%</strong>
            </div>
            <div>
              <span>Audit gap</span>
              <strong>{metrics.auditGap}%</strong>
            </div>
            <div>
              <span>Scale risk</span>
              <strong>{metrics.scaleRisk}%</strong>
            </div>
            <div>
              <span>Integrity risk</span>
              <strong>{metrics.dataIntegrityRisk}%</strong>
            </div>
            <div>
              <span>Schema complexity</span>
              <strong>{metrics.schemaComplexity}</strong>
            </div>
            <div>
              <span>Design score</span>
              <strong>{metrics.score}/100</strong>
            </div>
          </div>

          <p>
            <strong>Verdict:</strong> {metrics.verdict}
          </p>
          <h4>What changes in your data?</h4>
          <ul>
            {metrics.dataChanges.map(change => (
              <li key={change}>{change}</li>
            ))}
          </ul>

          <h4>Entities in this case context</h4>
          <ul>
            {context.entities.map(entity => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
