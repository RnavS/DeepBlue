import { trendThemes } from "./data.js";
import { buildTagMarkup, buildTickerMarkup, escapeHtml, refreshReveal, setupSite } from "./site.js";

setupSite("themes");
renderTrendLanes();
refreshReveal();

function renderTrendLanes() {
  const host = document.querySelector("[data-trend-lanes]");
  if (!host) return;

  const phases = ["Emerging", "Strengthening", "Crowded"];

  host.innerHTML = phases
    .map((phase) => {
      const items = trendThemes.filter((theme) => theme.phase === phase);
      return `
        <section class="trend-lane" data-reveal>
          <div class="trend-lane__header">
            <p class="eyebrow">${escapeHtml(phase)}</p>
            <h2>${escapeHtml(getPhaseTitle(phase))}</h2>
          </div>
          <div class="trend-lane__stack">
            ${items
              .map(
                (theme) => `
                  <article class="trend-card">
                    <h3>${escapeHtml(theme.title)}</h3>
                    <p>${escapeHtml(theme.summary)}</p>
                    <div class="tag-row">${buildTagMarkup(theme.signals)}</div>
                    <div class="ticker-row">${buildTickerMarkup(theme.tickers)}</div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function getPhaseTitle(phase) {
  switch (phase) {
    case "Emerging":
      return "Ideas moving from curiosity to investable setup";
    case "Strengthening":
      return "Themes with widening participation and cleaner confirmation";
    default:
      return "Trends that still matter, but require more selectivity";
  }
}
