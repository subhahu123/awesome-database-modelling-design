import React, {useEffect, useMemo, useState} from 'react';

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

const SOLUTION_TEMPLATES = {
  okaish: {
    label: 'Okaish',
    explanation: 'Fast to build. Works for MVP, but can break under retries and scale.',
    knobs: {indexQuality: 40, retrySafety: 30, historyClarity: 35, scaleReadiness: 25, modelClarity: 35},
  },
  good: {
    label: 'Good',
    explanation: 'Balanced approach. Reliable for most medium-scale products.',
    knobs: {indexQuality: 68, retrySafety: 75, historyClarity: 72, scaleReadiness: 55, modelClarity: 70},
  },
  best: {
    label: 'Best',
    explanation: 'Strong reliability and observability for high scale and strict correctness.',
    knobs: {indexQuality: 90, retrySafety: 93, historyClarity: 92, scaleReadiness: 85, modelClarity: 86},
  },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(v, max));
}

function getContext(caseSlug) {
  if (!caseSlug) return DEFAULT_CONTEXT;
  return DOMAIN_PRESETS.find(d => d.keys.some(k => caseSlug.includes(k))) || DEFAULT_CONTEXT;
}

function impactText(value, low, high, lowText, highText, midText) {
  if (value <= low) return lowText;
  if (value >= high) return highText;
  return midText;
}

export default function CaseStudyPlayground({caseSlug}) {
  const context = useMemo(() => getContext(caseSlug || ''), [caseSlug]);
  const [solution, setSolution] = useState('good');

  const [trafficLoad, setTrafficLoad] = useState(120);
  const [retryPressure, setRetryPressure] = useState(2);
  const [indexQuality, setIndexQuality] = useState(68);
  const [retrySafety, setRetrySafety] = useState(75);
  const [historyClarity, setHistoryClarity] = useState(72);
  const [scaleReadiness, setScaleReadiness] = useState(55);
  const [modelClarity, setModelClarity] = useState(70);

  useEffect(() => {
    const preset = SOLUTION_TEMPLATES[solution].knobs;
    setIndexQuality(preset.indexQuality);
    setRetrySafety(preset.retrySafety);
    setHistoryClarity(preset.historyClarity);
    setScaleReadiness(preset.scaleReadiness);
    setModelClarity(preset.modelClarity);
  }, [solution]);

  const metrics = useMemo(() => {
    const load = trafficLoad / 100;

    const readHealth = (indexQuality * 0.55 + modelClarity * 0.45) / 100;
    const writeHealth = (retrySafety * 0.45 + historyClarity * 0.35 + modelClarity * 0.2) / 100;

    const readSpeed = Math.round(30 + load * 45 * (1.25 - readHealth));
    const writeSafetyScore = Math.round(100 * writeHealth - retryPressure * 1.8);

    const duplicateChance = clamp(Math.round((100 - retrySafety) * 0.7 + retryPressure * 3.2), 1, 100);
    const debuggingDifficulty = clamp(Math.round((100 - historyClarity) * 0.65 + (100 - modelClarity) * 0.35), 0, 100);
    const scalingPain = clamp(Math.round((100 - scaleReadiness) * 0.65 + (100 - indexQuality) * 0.25 + load * 10), 0, 100);

    const overall = clamp(
      Math.round(
        readHealth * 100 * 0.25 +
          writeHealth * 100 * 0.35 +
          scaleReadiness * 0.2 +
          (100 - duplicateChance) * 0.1 +
          (100 - debuggingDifficulty) * 0.1,
      ),
      0,
      100,
    );

    let verdict = 'Good fit';
    if (overall < 55 || duplicateChance > 50 || scalingPain > 65) verdict = 'Needs redesign';
    if (overall >= 82 && duplicateChance < 18 && debuggingDifficulty < 20 && scalingPain < 30) verdict = 'Best-ready';

    return {
      readSpeed,
      writeSafetyScore,
      duplicateChance,
      debuggingDifficulty,
      scalingPain,
      overall,
      verdict,
      impacts: [
        impactText(
          retrySafety,
          40,
          80,
          'Same request can create duplicate rows when users retry.',
          'Retries are mostly safe due to strong idempotency handling.',
          'Some retries are safe, but edge cases can still duplicate data.',
        ),
        impactText(
          historyClarity,
          40,
          80,
          'When production issues happen, root cause is hard to reconstruct.',
          'Status/history trail is clear, so incidents are easier to debug.',
          'Partial history exists; some incidents are traceable, some are not.',
        ),
        impactText(
          indexQuality,
          40,
          80,
          'List APIs will slow down as data grows.',
          'Core reads stay fast because indexes match real query patterns.',
          'Current indexes work now, but need improvement before scale.',
        ),
      ],
    };
  }, [trafficLoad, retryPressure, indexQuality, retrySafety, historyClarity, scaleReadiness, modelClarity]);

  return (
    <div className="case-playground">
      <h3>Interactive solution walkthrough</h3>
      <p>
        <strong>Case context:</strong> {context.domain}
      </p>
      <p>
        <strong>Write path:</strong> {context.writeFlow}
        <br />
        <strong>Read path:</strong> {context.readFlow}
        <br />
        <strong>Main risk:</strong> {context.biggestRisk}
      </p>

      <p>
        Start by selecting a solution from this case study (**Okaish / Good / Best**), then tweak values to see
        what changes in outcomes.
      </p>

      <div className="solution-switcher">
        {Object.entries(SOLUTION_TEMPLATES).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            className={`button button--sm ${solution === key ? 'button--primary' : 'button--secondary'}`}
            onClick={() => setSolution(key)}>
            {preset.label}
          </button>
        ))}
      </div>

      <p>
        <strong>Selected:</strong> {SOLUTION_TEMPLATES[solution].label} — {SOLUTION_TEMPLATES[solution].explanation}
      </p>

      <div className="case-playground-grid">
        <section className="case-card">
          <h4>1) Workload reality</h4>
          <label>
            Traffic load: <strong>{trafficLoad}</strong>
            <input
              type="range"
              min="20"
              max="800"
              step="10"
              value={trafficLoad}
              onChange={e => setTrafficLoad(Number(e.target.value))}
            />
          </label>
          <label>
            Retry pressure (%): <strong>{retryPressure}</strong>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={retryPressure}
              onChange={e => setRetryPressure(Number(e.target.value))}
            />
          </label>

          <h4>2) Design choices</h4>
          <label>
            Query/index fit quality: <strong>{indexQuality}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={indexQuality}
              onChange={e => setIndexQuality(Number(e.target.value))}
            />
          </label>
          <label>
            Retry-safe write handling: <strong>{retrySafety}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={retrySafety}
              onChange={e => setRetrySafety(Number(e.target.value))}
            />
          </label>
          <label>
            History clarity: <strong>{historyClarity}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={historyClarity}
              onChange={e => setHistoryClarity(Number(e.target.value))}
            />
          </label>
          <label>
            Scale readiness: <strong>{scaleReadiness}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={scaleReadiness}
              onChange={e => setScaleReadiness(Number(e.target.value))}
            />
          </label>
          <label>
            Table/relationship clarity: <strong>{modelClarity}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={modelClarity}
              onChange={e => setModelClarity(Number(e.target.value))}
            />
          </label>
        </section>

        <section className="case-card">
          <h4>3) What happens</h4>
          <div className="metrics">
            <div>
              <span>Read speed (p95)</span>
              <strong>{metrics.readSpeed} ms</strong>
            </div>
            <div>
              <span>Write safety score</span>
              <strong>{metrics.writeSafetyScore}</strong>
            </div>
            <div>
              <span>Duplicate chance</span>
              <strong>{metrics.duplicateChance}%</strong>
            </div>
            <div>
              <span>Debug difficulty</span>
              <strong>{metrics.debuggingDifficulty}%</strong>
            </div>
            <div>
              <span>Scaling pain</span>
              <strong>{metrics.scalingPain}%</strong>
            </div>
            <div>
              <span>Overall fit</span>
              <strong>{metrics.overall}/100</strong>
            </div>
          </div>

          <p>
            <strong>Verdict:</strong> {metrics.verdict}
          </p>

          <h4>Connect-the-dots explanation</h4>
          <ul>
            {metrics.impacts.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
