import React, {useMemo, useState} from 'react';

const DOMAIN_PRESETS = [
  {
    keys: ['food-delivery', 'restaurant-pos', 'grocery-quick-commerce', 'meal-subscription'],
    domain: 'Order fulfillment systems',
    writeFlow: 'Customer places order → payment check → store accepts → delivery updates',
    readFlow: 'Recent customer orders and active store orders',
    biggestRisk: 'Order status confusion (accepted/preparing/dispatched/cancelled).',
  },
  {
    keys: ['ride-sharing', 'car-rental', 'travel-itinerary-booking', 'airline-reservation', 'hotel-management'],
    domain: 'Booking and mobility systems',
    writeFlow: 'Hold seat/slot → confirm booking → cancel or complete',
    readFlow: 'Availability and user itinerary timeline',
    biggestRisk: 'Overbooking from race conditions.',
  },
  {
    keys: ['banking-core-ledger', 'wallet-ledger', 'loan-origination', 'insurance-policy-claims', 'saas-subscription-billing'],
    domain: 'Financial and ledger systems',
    writeFlow: 'Create posting intent → append immutable entry → reconcile',
    readFlow: 'Balance and statement timeline',
    biggestRisk: 'Incorrect financial state due to non-idempotent writes.',
  },
  {
    keys: ['messaging-chat', 'notification-platform', 'video-conferencing', 'microblogging-social-feed', 'short-video-platform'],
    domain: 'Realtime communication systems',
    writeFlow: 'Receive event → fanout → delivery updates',
    readFlow: 'Inbox/feed recent page',
    biggestRisk: 'Delivery lag and duplicate fanout.',
  },
  {
    keys: ['ad-tech-bidding', 'api-rate-limiting', 'fraud-risk-engine', 'feature-flag-platform', 'observability-metrics-logs', 'search-indexing'],
    domain: 'High-throughput control systems',
    writeFlow: 'High-volume event ingest with retries',
    readFlow: 'Fast policy/evaluation lookup',
    biggestRisk: 'Duplicate writes under burst traffic.',
  },
];

const DEFAULT_CONTEXT = {
  domain: 'General transactional system',
  writeFlow: 'Validate request → write data safely → append history',
  readFlow: 'Recent list + detail views',
  biggestRisk: 'State changes are not traceable.',
};

const LEVELS = {
  basic: 35,
  decent: 65,
  strong: 90,
};

const PRESETS = {
  okaish: {
    label: 'Okaish',
    summary: 'Fast MVP. Good for learning and small traffic, weak under retries/scale.',
    indexFit: 'basic',
    retrySafety: 'basic',
    history: 'basic',
    scalePlan: 'basic',
    modelClarity: 'basic',
  },
  good: {
    label: 'Good',
    summary: 'Balanced production baseline for many teams.',
    indexFit: 'decent',
    retrySafety: 'decent',
    history: 'decent',
    scalePlan: 'decent',
    modelClarity: 'decent',
  },
  best: {
    label: 'Best',
    summary: 'High confidence setup for high scale and strict correctness.',
    indexFit: 'strong',
    retrySafety: 'strong',
    history: 'strong',
    scalePlan: 'strong',
    modelClarity: 'strong',
  },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(v, max));
}

function getContext(caseSlug) {
  if (!caseSlug) return DEFAULT_CONTEXT;
  return DOMAIN_PRESETS.find(d => d.keys.some(k => caseSlug.includes(k))) || DEFAULT_CONTEXT;
}

function OptionGroup({title, value, onChange}) {
  return (
    <div className="option-group">
      <p>
        <strong>{title}:</strong>
      </p>
      <div className="solution-switcher">
        {[
          ['basic', 'Basic'],
          ['decent', 'Decent'],
          ['strong', 'Strong'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`button button--sm ${value === key ? 'button--primary' : 'button--secondary'}`}
            onClick={() => onChange(key)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyPlayground({caseSlug}) {
  const context = useMemo(() => getContext(caseSlug || ''), [caseSlug]);

  const [preset, setPreset] = useState('good');
  const [trafficLoad, setTrafficLoad] = useState('decent');
  const [retryPressure, setRetryPressure] = useState('decent');

  const [indexFit, setIndexFit] = useState(PRESETS.good.indexFit);
  const [retrySafety, setRetrySafety] = useState(PRESETS.good.retrySafety);
  const [history, setHistory] = useState(PRESETS.good.history);
  const [scalePlan, setScalePlan] = useState(PRESETS.good.scalePlan);
  const [modelClarity, setModelClarity] = useState(PRESETS.good.modelClarity);
  const [customStrategy, setCustomStrategy] = useState('');

  const applyPreset = key => {
    setPreset(key);
    const p = PRESETS[key];
    setIndexFit(p.indexFit);
    setRetrySafety(p.retrySafety);
    setHistory(p.history);
    setScalePlan(p.scalePlan);
    setModelClarity(p.modelClarity);
  };

  const result = useMemo(() => {
    const readHealth = (LEVELS[indexFit] * 0.6 + LEVELS[modelClarity] * 0.4) / 100;
    const writeHealth = (LEVELS[retrySafety] * 0.5 + LEVELS[history] * 0.35 + LEVELS[modelClarity] * 0.15) / 100;

    const loadPenalty = LEVELS[trafficLoad] / 3;
    const retryPenalty = LEVELS[retryPressure] / 8;

    const readMs = Math.round(35 + loadPenalty * (1.2 - readHealth));
    const duplicateChance = clamp(Math.round((100 - LEVELS[retrySafety]) * 0.7 + retryPenalty), 1, 100);
    const debugDifficulty = clamp(Math.round((100 - LEVELS[history]) * 0.7 + (100 - LEVELS[modelClarity]) * 0.3), 0, 100);
    const scalePain = clamp(Math.round((100 - LEVELS[scalePlan]) * 0.6 + loadPenalty * 0.8), 0, 100);

    const overall = clamp(
      Math.round(
        readHealth * 30 +
          writeHealth * 35 +
          (100 - duplicateChance) * 0.15 +
          (100 - debugDifficulty) * 0.1 +
          (100 - scalePain) * 0.1,
      ),
      0,
      100,
    );

    let verdict = 'Good fit';
    if (overall < 55 || duplicateChance > 50 || scalePain > 60) verdict = 'Needs redesign';
    if (overall > 82 && duplicateChance < 20 && debugDifficulty < 20 && scalePain < 30) verdict = 'Best-ready';

    const guidance = [
      duplicateChance > 45
        ? 'Your current write strategy may create duplicates during retries. Improve retry-safe write handling.'
        : 'Retries are mostly handled safely with this setup.',
      debugDifficulty > 45
        ? 'Issue investigation will be slow. Strengthen history clarity to trace state transitions.'
        : 'History trail is clear enough for faster production debugging.',
      scalePain > 45
        ? 'This design may struggle as traffic grows. Improve scale plan and query/index fit.'
        : 'Scaling strategy looks healthy for current traffic level.',
    ];

    return {readMs, duplicateChance, debugDifficulty, scalePain, overall, verdict, guidance};
  }, [indexFit, modelClarity, retrySafety, history, trafficLoad, retryPressure, scalePlan]);

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

      <p>
        1) Pick a preset from this case study. 2) Adjust choices as per your strategy. 3) See what changes.
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
          <h4>Workload choices</h4>
          <OptionGroup title="Traffic load" value={trafficLoad} onChange={setTrafficLoad} />
          <OptionGroup title="Retry pressure" value={retryPressure} onChange={setRetryPressure} />

          <h4>Design choices</h4>
          <OptionGroup title="Query/index fit" value={indexFit} onChange={setIndexFit} />
          <OptionGroup title="Retry-safe write handling" value={retrySafety} onChange={setRetrySafety} />
          <OptionGroup title="History clarity" value={history} onChange={setHistory} />
          <OptionGroup title="Scale plan" value={scalePlan} onChange={setScalePlan} />
          <OptionGroup title="Table/relationship clarity" value={modelClarity} onChange={setModelClarity} />

          <label>
            Your own strategy notes (optional)
            <textarea
              rows="4"
              placeholder="Example: We'll keep Good preset but use stronger retry-safe handling due to payment retries."
              value={customStrategy}
              onChange={e => setCustomStrategy(e.target.value)}
            />
          </label>
        </section>

        <section className="case-card">
          <h4>Outcome for your selected strategy</h4>
          <div className="metrics">
            <div>
              <span>Read speed (p95)</span>
              <strong>{result.readMs} ms</strong>
            </div>
            <div>
              <span>Duplicate chance</span>
              <strong>{result.duplicateChance}%</strong>
            </div>
            <div>
              <span>Debug difficulty</span>
              <strong>{result.debugDifficulty}%</strong>
            </div>
            <div>
              <span>Scaling pain</span>
              <strong>{result.scalePain}%</strong>
            </div>
            <div>
              <span>Overall fit</span>
              <strong>{result.overall}/100</strong>
            </div>
          </div>

          <p>
            <strong>Verdict:</strong> {result.verdict}
          </p>

          <h4>Connect-the-dots explanation</h4>
          <ul>
            {result.guidance.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {customStrategy.trim() ? (
            <>
              <h4>Your strategy</h4>
              <blockquote>{customStrategy}</blockquote>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
