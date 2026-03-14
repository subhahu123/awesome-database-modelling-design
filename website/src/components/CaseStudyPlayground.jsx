import React, {useMemo, useState} from 'react';

const DOMAIN_PRESETS = [
  {
    keys: ['food-delivery', 'restaurant-pos', 'grocery-quick-commerce', 'meal-subscription'],
    domain: 'Order fulfillment systems',
    writeFlow: 'Customer places order -> payment check -> store accepts -> delivery updates',
    readFlow: 'Recent customer orders and active store orders',
    biggestRisk: 'Order status confusion (accepted/preparing/dispatched/cancelled).',
    tables: ['orders', 'order_items', 'payments', 'delivery_assignments', 'status_history'],
  },
  {
    keys: ['ride-sharing', 'car-rental', 'travel-itinerary-booking', 'airline-reservation', 'hotel-management'],
    domain: 'Booking and mobility systems',
    writeFlow: 'Hold seat/slot -> confirm booking -> cancel or complete',
    readFlow: 'Availability and user itinerary timeline',
    biggestRisk: 'Overbooking from race conditions.',
    tables: ['bookings', 'inventory_slots', 'pricing_quotes', 'trip_events', 'payments'],
  },
  {
    keys: ['banking-core-ledger', 'wallet-ledger', 'loan-origination', 'insurance-policy-claims', 'saas-subscription-billing'],
    domain: 'Financial and ledger systems',
    writeFlow: 'Create posting intent -> append immutable entry -> reconcile',
    readFlow: 'Balance and statement timeline',
    biggestRisk: 'Incorrect financial state due to non-idempotent writes.',
    tables: ['accounts', 'ledger_entries', 'payment_intents', 'settlements', 'reconciliation_runs'],
  },
  {
    keys: ['messaging-chat', 'notification-platform', 'video-conferencing', 'microblogging-social-feed', 'short-video-platform'],
    domain: 'Realtime communication systems',
    writeFlow: 'Receive event -> fanout -> delivery updates',
    readFlow: 'Inbox/feed recent page',
    biggestRisk: 'Delivery lag and duplicate fanout.',
    tables: ['messages', 'receipts', 'fanout_jobs', 'participants', 'notifications'],
  },
  {
    keys: ['ad-tech-bidding', 'api-rate-limiting', 'fraud-risk-engine', 'feature-flag-platform', 'observability-metrics-logs', 'search-indexing'],
    domain: 'High-throughput control systems',
    writeFlow: 'High-volume event ingest with retries',
    readFlow: 'Fast policy/evaluation lookup',
    biggestRisk: 'Duplicate writes under burst traffic.',
    tables: ['events', 'rules', 'evaluations', 'aggregates', 'decision_logs'],
  },
];

const DEFAULT_CONTEXT = {
  domain: 'General transactional system',
  writeFlow: 'Validate request -> write data safely -> append history',
  readFlow: 'Recent list + detail views',
  biggestRisk: 'State changes are not traceable.',
  tables: ['primary_records', 'record_items', 'status_history', 'idempotency_keys', 'audit_logs'],
};

const PRESETS = {
  okaish: {
    label: 'Okaish',
    summary: 'Fast MVP. Good for learning/small traffic, weak under retries and scale.',
    metrics: {trafficLoad: 35, retryPressure: 70, indexFit: 40, retrySafety: 35, historyClarity: 35, scalePlan: 30, modelClarity: 40},
  },
  good: {
    label: 'Good',
    summary: 'Balanced production baseline for many teams.',
    metrics: {trafficLoad: 55, retryPressure: 45, indexFit: 68, retrySafety: 75, historyClarity: 72, scalePlan: 60, modelClarity: 70},
  },
  best: {
    label: 'Best',
    summary: 'High confidence setup for high scale and strict correctness.',
    metrics: {trafficLoad: 70, retryPressure: 35, indexFit: 90, retrySafety: 92, historyClarity: 92, scalePlan: 86, modelClarity: 86},
  },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(v, max));
}

function getContext(caseSlug) {
  if (!caseSlug) return DEFAULT_CONTEXT;
  return DOMAIN_PRESETS.find(d => d.keys.some(k => caseSlug.includes(k))) || DEFAULT_CONTEXT;
}

function pctLabel(value) {
  if (value < 35) return 'Low';
  if (value < 70) return 'Medium';
  return 'High';
}

function formulaLines() {
  return {
    readLatency: 'read_latency_ms = 25 + traffic_load*0.35 + (100-index_fit)*0.30 + (100-model_clarity)*0.20',
    duplicateRisk: 'duplicate_risk_% = retry_pressure*0.45 + (100-retry_safety)*0.55',
    debugRisk: 'debug_risk_% = (100-history_clarity)*0.65 + (100-model_clarity)*0.35',
    scaleRisk: 'scale_risk_% = traffic_load*0.35 + (100-scale_plan)*0.45 + (100-index_fit)*0.20',
    overallFit: 'overall_fit_% = 100 - weighted(risks) + quality_bonus(index_fit,retry_safety,history_clarity)',
    tableLatency: 'table_latency_ms = base_read_ms + table_weight*(100-index_fit)*0.12 + table_weight*(100-model_clarity)*0.08',
  };
}

export default function CaseStudyPlayground({caseSlug}) {
  const context = useMemo(() => getContext(caseSlug || ''), [caseSlug]);
  const [preset, setPreset] = useState('good');

  const [trafficLoad, setTrafficLoad] = useState(PRESETS.good.metrics.trafficLoad);
  const [retryPressure, setRetryPressure] = useState(PRESETS.good.metrics.retryPressure);
  const [indexFit, setIndexFit] = useState(PRESETS.good.metrics.indexFit);
  const [retrySafety, setRetrySafety] = useState(PRESETS.good.metrics.retrySafety);
  const [historyClarity, setHistoryClarity] = useState(PRESETS.good.metrics.historyClarity);
  const [scalePlan, setScalePlan] = useState(PRESETS.good.metrics.scalePlan);
  const [modelClarity, setModelClarity] = useState(PRESETS.good.metrics.modelClarity);

  const applyPreset = key => {
    const p = PRESETS[key];
    setPreset(key);
    setTrafficLoad(p.metrics.trafficLoad);
    setRetryPressure(p.metrics.retryPressure);
    setIndexFit(p.metrics.indexFit);
    setRetrySafety(p.metrics.retrySafety);
    setHistoryClarity(p.metrics.historyClarity);
    setScalePlan(p.metrics.scalePlan);
    setModelClarity(p.metrics.modelClarity);
  };

  const calc = useMemo(() => {
    const baseReadMs = Math.round(25 + trafficLoad * 0.35 + (100 - indexFit) * 0.3 + (100 - modelClarity) * 0.2);
    const duplicateRisk = clamp(Math.round(retryPressure * 0.45 + (100 - retrySafety) * 0.55), 0, 100);
    const debugRisk = clamp(Math.round((100 - historyClarity) * 0.65 + (100 - modelClarity) * 0.35), 0, 100);
    const scaleRisk = clamp(Math.round(trafficLoad * 0.35 + (100 - scalePlan) * 0.45 + (100 - indexFit) * 0.2), 0, 100);
    const qualityBonus = Math.round((indexFit + retrySafety + historyClarity) / 10);
    const overallFit = clamp(Math.round(100 - (duplicateRisk * 0.35 + debugRisk * 0.25 + scaleRisk * 0.3) + qualityBonus), 0, 100);

    const tableWeights = [1.0, 0.85, 0.75, 0.65, 0.55];
    const tableStats = context.tables.map((table, i) => {
      const w = tableWeights[i] || 0.5;
      const latency = Math.round(baseReadMs + w * (100 - indexFit) * 0.12 + w * (100 - modelClarity) * 0.08);
      const risk = clamp(Math.round((100 - historyClarity) * (0.4 + w * 0.2) + duplicateRisk * (0.2 + w * 0.1)), 0, 100);
      return {table, latency, risk, width: clamp(Math.round((latency / 160) * 100), 8, 100)};
    });

    const frCoverage = [
      {
        req: 'Create/update records reliably',
        score: clamp(Math.round((retrySafety * 0.5 + modelClarity * 0.3 + (100 - duplicateRisk) * 0.2)), 0, 100),
        how: 'Idempotent writes + clear ownership/relations reduce duplicate or broken writes.',
      },
      {
        req: 'Fast read APIs',
        score: clamp(Math.round((indexFit * 0.65 + (100 - Math.min(baseReadMs, 140)) * 0.35)), 0, 100),
        how: 'Better query/index fit lowers latency on hot list/detail endpoints.',
      },
      {
        req: 'Lifecycle transition tracking',
        score: clamp(Math.round((historyClarity * 0.8 + modelClarity * 0.2)), 0, 100),
        how: 'Append-only history makes state transitions replayable and debuggable.',
      },
      {
        req: 'Safe retries without duplicate effects',
        score: clamp(Math.round((retrySafety * 0.75 + (100 - duplicateRisk) * 0.25)), 0, 100),
        how: 'Retry-safe writes and constraints block duplicate business actions.',
      },
      {
        req: 'Operational visibility',
        score: clamp(Math.round((historyClarity * 0.55 + (100 - debugRisk) * 0.45)), 0, 100),
        how: 'High history clarity lowers debug risk and speeds incident diagnosis.',
      },
    ];

    let verdict = 'Good fit';
    if (overallFit < 55 || duplicateRisk > 50 || scaleRisk > 60) verdict = 'Needs redesign';
    if (overallFit > 82 && duplicateRisk < 20 && debugRisk < 25 && scaleRisk < 30) verdict = 'Best-ready';

    return {baseReadMs, duplicateRisk, debugRisk, scaleRisk, overallFit, verdict, tableStats, frCoverage};
  }, [trafficLoad, retryPressure, indexFit, retrySafety, historyClarity, scalePlan, modelClarity, context.tables]);

  const formulas = formulaLines();

  return (
    <div className="case-playground">
      <h3>Interactive solution walkthrough</h3>
      <p>
        <strong>Case context:</strong> {context.domain}
        <br />
        <strong>Write path:</strong> {context.writeFlow}
        <br />
        <strong>Read path:</strong> {context.readFlow}
        <br />
        <strong>Main risk:</strong> {context.biggestRisk}
      </p>

      <div className="solution-switcher">
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            type="button"
            className={`button button--sm ${preset === key ? 'button--primary' : 'button--secondary'}`}
            onClick={() => applyPreset(key)}>
            {p.label}
          </button>
        ))}
      </div>
      <p>
        <strong>Selected:</strong> {PRESETS[preset].label} — {PRESETS[preset].summary}
      </p>

      <div className="case-playground-grid">
        <section className="case-card">
          <h4>Set percentages (how you model your strategy)</h4>
          <label>
            Traffic load: <strong>{trafficLoad}%</strong> ({pctLabel(trafficLoad)})
            <input type="range" min="0" max="100" step="1" value={trafficLoad} onChange={e => setTrafficLoad(Number(e.target.value))} />
          </label>
          <label>
            Retry pressure: <strong>{retryPressure}%</strong> ({pctLabel(retryPressure)})
            <input type="range" min="0" max="100" step="1" value={retryPressure} onChange={e => setRetryPressure(Number(e.target.value))} />
          </label>
          <label>
            Query/index fit: <strong>{indexFit}%</strong> ({pctLabel(indexFit)})
            <input type="range" min="0" max="100" step="1" value={indexFit} onChange={e => setIndexFit(Number(e.target.value))} />
          </label>
          <label>
            Retry-safe write handling: <strong>{retrySafety}%</strong> ({pctLabel(retrySafety)})
            <input type="range" min="0" max="100" step="1" value={retrySafety} onChange={e => setRetrySafety(Number(e.target.value))} />
          </label>
          <label>
            History clarity: <strong>{historyClarity}%</strong> ({pctLabel(historyClarity)})
            <input type="range" min="0" max="100" step="1" value={historyClarity} onChange={e => setHistoryClarity(Number(e.target.value))} />
          </label>
          <label>
            Scale plan quality: <strong>{scalePlan}%</strong> ({pctLabel(scalePlan)})
            <input type="range" min="0" max="100" step="1" value={scalePlan} onChange={e => setScalePlan(Number(e.target.value))} />
          </label>
          <label>
            Table/relationship clarity: <strong>{modelClarity}%</strong> ({pctLabel(modelClarity)})
            <input type="range" min="0" max="100" step="1" value={modelClarity} onChange={e => setModelClarity(Number(e.target.value))} />
          </label>

          <h4>How to calculate these percentages</h4>
          <ul>
            <li><strong>Index fit %:</strong> (important read queries using correct index ÷ total important read queries) × 100.</li>
            <li><strong>Retry-safe handling %:</strong> (write APIs protected by idempotency/unique constraints ÷ total write APIs) × 100.</li>
            <li><strong>History clarity %:</strong> (critical state changes stored in append-only history ÷ total critical state changes) × 100.</li>
            <li><strong>Scale plan %:</strong> estimate of readiness for growth (partitioning, async projections, backpressure, hotspot handling).</li>
            <li><strong>Table/relationship clarity %:</strong> percentage of important relations with clear FK/ownership rules and non-ambiguous joins.</li>
          </ul>

          <h4>Formula used in playground</h4>
          <pre className="playground-formula">
{`${formulas.readLatency}
${formulas.duplicateRisk}
${formulas.debugRisk}
${formulas.scaleRisk}
${formulas.overallFit}
${formulas.tableLatency}`}
          </pre>
        </section>

        <section className="case-card">
          <h4>System-level outcome</h4>
          <div className="metrics">
            <div><span>Read latency (base)</span><strong>{calc.baseReadMs} ms</strong></div>
            <div><span>Duplicate risk</span><strong>{calc.duplicateRisk}%</strong></div>
            <div><span>Debug risk</span><strong>{calc.debugRisk}%</strong></div>
            <div><span>Scale risk</span><strong>{calc.scaleRisk}%</strong></div>
            <div><span>Overall fit</span><strong>{calc.overallFit}/100</strong></div>
          </div>
          <p><strong>Verdict:</strong> {calc.verdict}</p>

          <h4>Complete solution diagram (functional requirements)</h4>
          <div className="solution-flow-diagram">
            <span>Request</span>
            <span>Validate</span>
            <span>Write + History</span>
            <span>Read / Respond</span>
          </div>
          {calc.frCoverage.map(item => (
            <div key={item.req} className="fr-row">
              <div className="fr-header">
                <strong>{item.req}</strong>
                <span>{item.score}%</span>
              </div>
              <div className="table-impact-track">
                <div className="table-impact-fill" style={{width: `${item.score}%`}} />
              </div>
              <p>{item.how}</p>
            </div>
          ))}

          <h4>Table-level impact visual</h4>
          <p>These bars show where user requests are likely to observe higher latency/risk first.</p>
          {calc.tableStats.map(s => (
            <div key={s.table} className="table-impact-row">
              <div className="table-impact-header">
                <strong>{s.table}</strong>
                <span>{s.latency} ms · risk {s.risk}%</span>
              </div>
              <div className="table-impact-track">
                <div className="table-impact-fill" style={{width: `${s.width}%`}} />
              </div>
            </div>
          ))}
        </section>
      </div>

    </div>
  );
}
