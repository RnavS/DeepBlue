import { buildTagMarkup, escapeHtml, refreshReveal, setupSite } from "./site.js";

const quantTheses = [
  {
    title: "AI is no longer one trade",
    question: "Where does the next dollar have to go after the GPU order is obvious?",
    focus:
      "The cleaner edge is increasingly in advanced packaging, inspection, optical interconnects, power-delivery hardware, and cooling infrastructure rather than in repeating the same megacap AI thesis.",
    confirmation:
      "Secondary suppliers keep acting well even when the headline leaders pause, and capital rotates deeper into the buildout chain instead of abandoning the theme.",
    risk:
      "If hyperscaler capex slows before those bottlenecks fully monetize, the second-order winners can de-rate with the first-order trade.",
  },
  {
    title: "Crowding now matters as much as fundamentals",
    question: "Is the position still an insight, or has it become everyone else's balance sheet?",
    focus:
      "A good company can still be a fragile trade when the same funds own the same leaders and liquidity is thinner than the consensus assumes.",
    confirmation:
      "Watch for narrowing leadership, failed dip-buying, and lower-quality names squeezing harder than the best businesses.",
    risk:
      "The thesis may stay right while the position loses money because de-grossing hits before fundamentals matter again.",
  },
  {
    title: "The best ideas usually sit one layer below the story",
    question: "Which company gets paid because the market must keep spending, not because investors want thematic exposure?",
    focus:
      "I care most about bottleneck suppliers, maintenance layers, identity controls, and transaction rails that get pulled forward when a larger narrative becomes operational.",
    confirmation:
      "Backlog conversion, utilization, contract duration, and attachment rates improve before the market has fully rerated the name.",
    risk:
      "If the chain becomes overbuilt or too obvious, the derivative beneficiary loses the asymmetry that made it interesting.",
  },
  {
    title: "Quant edge now lives closer to execution",
    question: "Can the signal survive crowding, slippage, and regime shifts in the live tape?",
    focus:
      "Market structure, clustered flow, cross-impact, and liquidity fracture are part of alpha now; they are no longer implementation details you bolt on later.",
    confirmation:
      "The useful models are the ones that change sizing, entry, and execution when the regime changes instead of pretending the backtest environment still exists.",
    risk:
      "Static factors can look elegant in research and still fail because the execution regime deteriorated first.",
  },
];

const quantSignals = [
  [
    "Crowded quality unwind",
    "Leadership stays narrow, high-quality longs stop bouncing on routine weakness, and second-tier beta starts outperforming. That usually signals de-grossing pressure rather than a fresh fundamental regime.",
  ],
  [
    "Junk squeeze",
    "Lower-quality shorts rally harder than the strong businesses you expected to lead. The message is usually positioning stress, short covering, and factor pain rather than genuine improvement in the weakest names.",
  ],
  [
    "Hidden accumulation",
    "Suppliers and infrastructure names start making calmer higher lows before the headline beneficiary breaks out again. Capital is often moving into the chain before the popular narrative gets another visible catalyst.",
  ],
  [
    "Distribution through strength",
    "The stock still tags highs, but closes weaken, breadth narrows, and follow-through shifts to thinner names. The story is still alive, but sponsorship is aging beneath the surface.",
  ],
  [
    "Liquidity fracture",
    "Spread widening, gap sensitivity, and weaker intraday reversals show up together. That is usually the moment when execution risk becomes part of the thesis rather than a footnote.",
  ],
  [
    "Regime flip",
    "Momentum and mean reversion both start failing in quick succession. When that happens, the real problem is often the market state, not a slight parameter issue in the model.",
  ],
  [
    "Correlation trap",
    "Positions that looked diversified begin trading like one crowded book. The market is telling you the exposures were siblings all along and only seemed independent in quieter conditions.",
  ],
  [
    "Second-order leadership",
    "The stocks powering the next leg are no longer the obvious leaders but the suppliers, controls, and service layers that the first-wave winners need to keep spending.",
  ],
];

const quantChains = [
  {
    phase: "AI buildout",
    title: "AI alpha is sliding from compute headlines into physical bottlenecks",
    summary:
      "Once the platform winners are obvious, the better read is where the next operational constraint appears.",
    nodes: ["GPU demand", "advanced packaging", "inspection and yield", "optical density", "grid capacity", "cooling"],
    angles: [
      {
        title: "Packaging and process control",
        text:
          "Assembly, test, and yield management are where AI demand becomes manufacturable volume rather than conference-call optimism.",
        tickers: ["AMKR", "ASX", "KLAC"],
      },
      {
        title: "Power-density and network plumbing",
        text:
          "The next limitation is increasingly how much electricity, switching, and optical bandwidth the rack can absorb without stalling deployment.",
        tickers: ["COHR", "HUBB", "PWR"],
      },
    ],
  },
  {
    phase: "Defense cycle",
    title: "Defense is trading more like industrial capacity expansion than old defensive value",
    summary:
      "The important change is the handoff from headlines into plant expansion, backlog conversion, and supplier demand.",
    nodes: ["budget approvals", "backlog growth", "plant expansion", "component suppliers", "autonomy programs", "maintenance"],
    angles: [
      {
        title: "Capacity and fleet exposure",
        text:
          "Shipyards, sustainment, and specialized components tend to matter more when defense demand becomes a multi-year production cycle.",
        tickers: ["HII", "HEI", "CW"],
      },
      {
        title: "Cheaper autonomy and attritable systems",
        text:
          "The more defense shifts toward scalable unmanned systems, the more interesting the lower-cost autonomy layer becomes.",
        tickers: ["KTOS", "AVAV", "TXT"],
      },
    ],
  },
  {
    phase: "Digital trust",
    title: "Fintech and cyber are converging around speed, identity, and fraud control",
    summary:
      "The market is paying more for rails, verification, and machine defense than for consumer-facing financial novelty.",
    nodes: ["real-time settlement", "fraud scoring", "identity controls", "compliance", "embedded finance", "margin discipline"],
    angles: [
      {
        title: "Payment rails and settlement plumbing",
        text:
          "Real-time money movement rewards the networks and orchestration layers that handle routing, compliance, and payment certainty.",
        tickers: ["ACIW", "FI", "PAYO"],
      },
      {
        title: "Identity and privileged-machine defense",
        text:
          "As AI expands the attack surface, the durable spend is increasingly around identity control, privilege, and runtime trust rather than generic software seats.",
        tickers: ["CYBR", "TENB", "OKTA"],
      },
    ],
  },
];

const quantWatchlist = [
  {
    kicker: "AI packaging",
    title: "Advanced packaging is a cleaner way to express AI scale than another GPU debate",
    miss:
      "The market often talks as if wafer starts alone matter, but the packaging layer is where high-performance chips actually become shippable product.",
    mechanism:
      "When advanced packaging stays tight, pricing power and utilization can improve for the companies sitting between chip design and full system deployment.",
    validation:
      "Watch for stronger mix, steadier utilization, and continued evidence that AI volumes are widening beyond a few flagship programs.",
    risk:
      "If capacity expansion catches up quickly or customer concentration becomes the only story, the bottleneck premium fades.",
    tickers: ["AMKR", "ASX"],
  },
  {
    kicker: "Yield control",
    title: "Inspection and process control can outperform when the cycle becomes about precision, not just volume",
    miss:
      "The glamour trade usually focuses on compute demand while underestimating how much value gets captured by the companies protecting yield at advanced nodes.",
    mechanism:
      "As complexity rises, every point of yield and every avoided defect becomes more valuable, which can support the process-control layer even when the narrative focus stays elsewhere.",
    validation:
      "The setup strengthens when advanced-node investment stays firm and customers keep paying for cleaner throughput instead of pure wafer quantity.",
    risk:
      "If fabs slow capital spending or the market decides the cycle is already fully priced, these names can digest hard despite solid underlying positioning.",
    tickers: ["KLAC", "MKSI"],
  },
  {
    kicker: "Optical density",
    title: "The AI network trade is increasingly about moving light cleanly, not just adding more compute",
    miss:
      "Investors often stop at accelerators even though the next scaling problem is how fast clusters can actually communicate and stay synchronized.",
    mechanism:
      "As model sizes and cluster complexity rise, the optical and photonics layer becomes more central to real throughput and latency.",
    validation:
      "A better setup shows up when optical demand stays resilient even during pauses in the most crowded compute names.",
    risk:
      "This layer can stay volatile if spending gets lumpy or if hyperscaler digestion creates short stretches of order uncertainty.",
    tickers: ["COHR", "CIEN"],
  },
  {
    kicker: "Grid bottlenecks",
    title: "Power-delivery specialists can be a better AI trade than another software multiple",
    miss:
      "A lot of investors still think of utilities and grid hardware as sleepy value buckets instead of scarce infrastructure required by data-center growth.",
    mechanism:
      "Load growth, transmission buildout, and interconnection bottlenecks pull capital toward the companies that can actually connect, protect, and route power.",
    validation:
      "The thesis improves when backlog and capex keep pointing toward physical power constraints rather than just headline electricity demand.",
    risk:
      "If project timing slips or the market falls back into treating the space like a bond proxy, the re-rating can stall.",
    tickers: ["HUBB", "PWR", "NRG"],
  },
  {
    kicker: "Defense capacity",
    title: "The cleaner defense edge may sit in capacity, sustainment, and specialized components",
    miss:
      "The market knows the prime contractors, but it still underreacts to the names that benefit when backlog turns into long-cycle industrial activity.",
    mechanism:
      "Once procurement becomes plant expansion and fleet support, specialized component makers and naval capacity names can matter more than the loudest geopolitical headline.",
    validation:
      "A stronger setup usually comes with healthier backlogs, steadier program funding, and evidence that production cadence is improving rather than staying theoretical.",
    risk:
      "Program delays, political resets, and budget timing can interrupt even a structurally favorable cycle.",
    tickers: ["HII", "HEI", "CW"],
  },
  {
    kicker: "Financial rails",
    title: "Payments infrastructure is where fintech gets real once hype stops getting paid",
    miss:
      "The market still gets distracted by front-end brands even though real-time settlement, compliance, and transaction orchestration often have cleaner economics.",
    mechanism:
      "As embedded finance matures, the durable value can migrate toward the systems handling routing, fraud controls, and settlement certainty behind the scenes.",
    validation:
      "This gets more interesting when payment volumes hold up while the market demands profitability and operating leverage from the whole fintech complex.",
    risk:
      "If volumes soften or pricing gets competed away, the rails trade can still look lower quality than it really is for a stretch.",
    tickers: ["ACIW", "FI", "PAYO"],
  },
];

const quantStack = [
  {
    title: "Hawkes flow mapping",
    question: "What tends to cluster right before liquidity gets toxic?",
    focus:
      "Event clustering is useful because order-flow stress usually arrives as a chain reaction rather than as isolated prints.",
    confirmation:
      "The model matters most when bursts in trades, cancellations, or spread moves start leading the next phase of price behavior.",
    risk:
      "It loses value when latent liquidity overwhelms displayed flow or when the market changes venue behavior faster than the process is recalibrated.",
  },
  {
    title: "HMM regime detection",
    question: "Are you in trend, squeeze, or mean-reversion conditions right now?",
    focus:
      "A regime model is valuable because many alphas fail when the market state changes faster than the signal framework expects.",
    confirmation:
      "The edge improves when sizing, entry logic, and holding period all adapt to the inferred regime instead of staying static.",
    risk:
      "If the state labels are too slow or too coarse, the model tells you what regime you just left rather than the one you are trading.",
  },
  {
    title: "Meta-labeling",
    question: "Should the signal be taken now, not just in theory?",
    focus:
      "Meta-labeling is powerful because the better question is often whether a base signal is tradable under current liquidity and crowding conditions.",
    confirmation:
      "It helps most when the model can filter out environments where the raw directional edge exists but the implementation cost destroys it.",
    risk:
      "If the filter overfits the past or learns stale execution conditions, it can suppress valid trades at exactly the wrong time.",
  },
  {
    title: "Cross-impact and capacity",
    question: "How much alpha disappears when multiple funds trade the same basket?",
    focus:
      "Capacity work matters because many strategies die from impact, not from signal decay, especially once adjacent names move together under crowded positioning.",
    confirmation:
      "The better research treats trading cost, sizing, and correlation compression as part of the forecast rather than as afterthoughts.",
    risk:
      "Ignoring cross-impact creates false confidence by assuming the portfolio is smaller and more independent than it will be in production.",
  },
  {
    title: "Orthogonal alpha and random matrix cleanup",
    question: "Are your different signals actually different?",
    focus:
      "Orthogonalization matters more when crowded factors and unstable correlations make diversification look cleaner in a backtest than it is in the live book.",
    confirmation:
      "It becomes most useful when several apparently independent signals start behaving like the same trade during stress.",
    risk:
      "Over-cleaning can strip out useful structure if you confuse real common drivers with pure noise.",
  },
  {
    title: "Adversarial stress testing",
    question: "How does the stack break when the crisis path is new rather than historical?",
    focus:
      "Stress testing earns its keep when it creates plausible combinations of spread widening, correlation spikes, and de-grossing that the backtest never saw.",
    confirmation:
      "The best use is not finding a single worst case but identifying which part of the stack fails first when liquidity changes shape.",
    risk:
      "If the generated scenarios are unrealistic, the exercise turns theatrical and stops informing position sizing or execution design.",
  },
];

setupSite("quant");
renderQuantTheses();
renderQuantSignals();
renderQuantChains();
renderQuantWatchlist();
renderQuantStack();
refreshReveal();

function renderQuantTheses() {
  const host = document.querySelector("[data-quant-theses]");
  if (!host) return;

  host.innerHTML = quantTheses
    .map(
      (thesis, index) => `
        <article class="framework-card" data-reveal>
          <div class="framework-card__header">
            <div>
              <p class="eyebrow">Read ${index + 1}</p>
              <h2>${escapeHtml(thesis.title)}</h2>
            </div>
          </div>
          <div class="framework-grid">
            <div>
              <h3>Question</h3>
              <p>${escapeHtml(thesis.question)}</p>
            </div>
            <div>
              <h3>What I am actually watching</h3>
              <p>${escapeHtml(thesis.focus)}</p>
            </div>
            <div>
              <h3>What would confirm it</h3>
              <p>${escapeHtml(thesis.confirmation)}</p>
            </div>
            <div>
              <h3>What breaks the read</h3>
              <p>${escapeHtml(thesis.risk)}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderQuantSignals() {
  const host = document.querySelector("[data-quant-signals]");
  if (!host) return;

  host.innerHTML = quantSignals
    .map(
      ([label, text]) => `
        <div class="score-row" data-reveal>
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(text)}</span>
        </div>
      `,
    )
    .join("");
}

function renderQuantChains() {
  const host = document.querySelector("[data-quant-chains]");
  if (!host) return;

  host.innerHTML = quantChains
    .map(
      (chain) => `
        <section class="trend-lane" data-reveal>
          <div class="trend-lane__header">
            <p class="eyebrow">${escapeHtml(chain.phase)}</p>
            <h2>${escapeHtml(chain.title)}</h2>
            <p>${escapeHtml(chain.summary)}</p>
            <div class="tag-row">${buildTagMarkup(chain.nodes)}</div>
          </div>
          <div class="trend-lane__stack">
            ${chain.angles
              .map(
                (angle) => `
                  <article class="trend-card">
                    <h3>${escapeHtml(angle.title)}</h3>
                    <p>${escapeHtml(angle.text)}</p>
                    <div class="tag-row">${buildSymbolMarkup(angle.tickers)}</div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function renderQuantWatchlist() {
  const host = document.querySelector("[data-quant-watchlist]");
  if (!host) return;

  host.innerHTML = quantWatchlist
    .map(
      (item) => `
        <article class="framework-card" data-reveal>
          <div class="framework-card__header">
            <div>
              <p class="eyebrow">${escapeHtml(item.kicker)}</p>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
          </div>
          <div class="tag-row">${buildSymbolMarkup(item.tickers)}</div>
          <div class="framework-grid">
            <div>
              <h3>What the market misses</h3>
              <p>${escapeHtml(item.miss)}</p>
            </div>
            <div>
              <h3>Why it can matter</h3>
              <p>${escapeHtml(item.mechanism)}</p>
            </div>
            <div>
              <h3>What would validate it</h3>
              <p>${escapeHtml(item.validation)}</p>
            </div>
            <div>
              <h3>What could invalidate it</h3>
              <p>${escapeHtml(item.risk)}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderQuantStack() {
  const host = document.querySelector("[data-quant-stack]");
  if (!host) return;

  host.innerHTML = quantStack
    .map(
      (item) => `
        <article class="framework-card" data-reveal>
          <div class="framework-card__header">
            <div>
              <p class="eyebrow">Model edge</p>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
          </div>
          <div class="framework-grid">
            <div>
              <h3>Question</h3>
              <p>${escapeHtml(item.question)}</p>
            </div>
            <div>
              <h3>Why it matters now</h3>
              <p>${escapeHtml(item.focus)}</p>
            </div>
            <div>
              <h3>What it improves</h3>
              <p>${escapeHtml(item.confirmation)}</p>
            </div>
            <div>
              <h3>Where it breaks</h3>
              <p>${escapeHtml(item.risk)}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function buildSymbolMarkup(symbols = []) {
  return symbols
    .map((symbol) => `<span class="reference-chip">${escapeHtml(symbol)}</span>`)
    .join("");
}
