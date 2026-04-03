import {
  brand,
  featuredCategories,
  featuredEntryIds,
  frameworkPillars,
  heroMetrics,
  nowTracking,
  positioningPoints,
  projectionWatchlist,
  analysisEntries,
  trendThemes,
} from "./data.js";
import {
  bindLogoFallbacks,
  buildLogoMarkup,
  buildProjectionSvg,
  buildTagMarkup,
  buildTickerMarkup,
  calculateScenarioDelta,
  escapeHtml,
  refreshReveal,
  setupSite,
} from "./site.js";

setupSite("home");
renderHeroMetrics();
renderPositioning();
renderCategories();
renderThemes();
renderFrameworkPreview();
renderProjectionPreview();
renderRecentAnalysis();
renderNowTracking();
bindLogoFallbacks();
refreshReveal();

function renderHeroMetrics() {
  const host = document.querySelector("[data-home-metrics]");
  if (!host) return;

  host.innerHTML = heroMetrics
    .map(
      (item) => `
        <article class="metric-card" data-reveal>
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </article>
      `,
    )
    .join("");
}

function renderPositioning() {
  const host = document.querySelector("[data-positioning]");
  if (!host) return;

  host.innerHTML = positioningPoints
    .map(
      (point) => `
        <article class="signal-card" data-reveal>
          <p>${escapeHtml(point)}</p>
        </article>
      `,
    )
    .join("");
}

function renderCategories() {
  const host = document.querySelector("[data-category-grid]");
  if (!host) return;

  host.innerHTML = featuredCategories
    .map(
      (item) => `
        <article class="theme-card" data-reveal>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `,
    )
    .join("");
}

function renderThemes() {
  const host = document.querySelector("[data-theme-grid]");
  if (!host) return;

  host.innerHTML = trendThemes
    .slice(0, 6)
    .map(
      (theme) => `
        <article class="trend-card" data-reveal>
          <div class="trend-card__topline">
            <span class="trend-phase trend-phase--${theme.phase.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(
              theme.phase,
            )}</span>
          </div>
          <h3>${escapeHtml(theme.title)}</h3>
          <p>${escapeHtml(theme.summary)}</p>
          <div class="tag-row">${buildTagMarkup(theme.signals)}</div>
          <div class="ticker-row">${buildTickerMarkup(theme.tickers)}</div>
        </article>
      `,
    )
    .join("");
}

function renderFrameworkPreview() {
  const host = document.querySelector("[data-framework-preview]");
  if (!host) return;

  host.innerHTML = frameworkPillars
    .slice(0, 4)
    .map(
      (pillar) => `
        <article class="dimension-card" data-reveal>
          <p class="eyebrow">${escapeHtml(pillar.question)}</p>
          <h3>${escapeHtml(pillar.title)}</h3>
          <p>${escapeHtml(pillar.focus)}</p>
        </article>
      `,
    )
    .join("");
}

function renderProjectionPreview() {
  const host = document.querySelector("[data-projection-preview]");
  if (!host) return;

  host.innerHTML = projectionWatchlist
    .slice(0, 4)
    .map(
      (item) => `
        <article class="projection-card" data-reveal>
          <div class="projection-card__header">
            <div class="projection-brand">
              ${buildLogoMarkup(item.ticker)}
              <div>
                <strong>${escapeHtml(item.ticker)}</strong>
                <span>${escapeHtml(item.theme)}</span>
              </div>
            </div>
            <span class="projection-delta">${calculateScenarioDelta(item.projection, "base")}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.setup)}</p>
          ${buildProjectionSvg(item.projection, "base")}
        </article>
      `,
    )
    .join("");
}

function renderRecentAnalysis() {
  const host = document.querySelector("[data-recent-analysis]");
  if (!host) return;

  const selected = featuredEntryIds
    .map((id) => analysisEntries.find((entry) => entry.id === id))
    .filter(Boolean);

  host.innerHTML = selected
    .map(
      (entry) => `
        <article class="paper-card" data-reveal>
          <div class="paper-card__meta">
            <span>${escapeHtml(entry.category)}</span>
            <span>${escapeHtml(entry.date)}</span>
            <span>${escapeHtml(entry.readingTime)}</span>
          </div>
          <h3>${escapeHtml(entry.title)}</h3>
          <p>${escapeHtml(entry.summary)}</p>
          <div class="tag-row">${buildTagMarkup(entry.tags)}</div>
          <div class="ticker-row">${buildTickerMarkup(entry.tickers)}</div>
        </article>
      `,
    )
    .join("");
}

function renderNowTracking() {
  const host = document.querySelector("[data-now-tracking]");
  if (!host) return;

  host.innerHTML = `
    <div class="chip-cloud">
      ${nowTracking.map((item) => `<span class="tracking-chip">${escapeHtml(item)}</span>`).join("")}
    </div>
    <div class="tracking-copy" data-reveal>
      <p class="section-kicker">Current posture</p>
      <h3>${escapeHtml(brand.name)} looks for where the market is still one turn behind the tape.</h3>
      <p>
        My best work usually starts where the surface narrative is still too simple. I want to know
        whether the move is widening, whether the sponsorship is durable, and whether the market is
        pricing the first-order story while underpricing the second-order consequence.
      </p>
    </div>
  `;
}
