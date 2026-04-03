import { caseStudies, projectionWatchlist } from "./data.js";
import {
  bindLogoFallbacks,
  buildLogoMarkup,
  buildProjectionSvg,
  buildTagMarkup,
  calculateScenarioDelta,
  escapeHtml,
  refreshReveal,
  setupSite,
} from "./site.js";

setupSite("cases");
renderCaseStudies();
bindLogoFallbacks();
refreshReveal();

function renderCaseStudies() {
  const host = document.querySelector("[data-case-studies]");
  if (!host) return;

  host.innerHTML = caseStudies
    .map((study) => {
      const projection = projectionWatchlist.find((item) => item.ticker === study.primaryTicker);
      return `
        <article class="case-study" data-reveal>
          <div class="case-study__header">
            <div class="projection-brand">
              ${buildLogoMarkup(study.primaryTicker)}
              <div>
                <span class="eyebrow">${escapeHtml(study.kicker)}</span>
                <h2>${escapeHtml(study.title)}</h2>
              </div>
            </div>
            ${
              projection
                ? `<span class="projection-delta">${calculateScenarioDelta(projection.projection, "base")}</span>`
                : ""
            }
          </div>
          <div class="case-study__grid">
            <div>
              <h3>What I noticed</h3>
              <p>${escapeHtml(study.whatINoticed)}</p>
            </div>
            <div>
              <h3>Why it mattered</h3>
              <p>${escapeHtml(study.whyItMattered)}</p>
            </div>
            <div>
              <h3>What the market missed</h3>
              <p>${escapeHtml(study.whatMarketMissed)}</p>
            </div>
            <div>
              <h3>Risk to the call</h3>
              <p>${escapeHtml(study.risks)}</p>
            </div>
          </div>
          <div class="detail-grid">
            <div>
              <h3>Signals that confirmed it</h3>
              <div class="tag-row">${buildTagMarkup(study.confirmations)}</div>
            </div>
            <div>
              <h3>What validates it from here</h3>
              <p>${escapeHtml(study.validation)}</p>
            </div>
          </div>
          ${projection ? buildProjectionSvg(projection.projection, "base") : ""}
        </article>
      `;
    })
    .join("");
}
