import { frameworkPillars } from "./data.js";
import { escapeHtml, refreshReveal, setupSite } from "./site.js";

setupSite("framework");
renderFrameworkPillars();
renderScorecard();
refreshReveal();

function renderFrameworkPillars() {
  const host = document.querySelector("[data-framework-pillars]");
  if (!host) return;

  host.innerHTML = frameworkPillars
    .map(
      (pillar, index) => `
        <article class="framework-card" data-reveal>
          <div class="framework-card__header">
            <div>
              <p class="eyebrow">Step ${index + 1}</p>
              <h2>${escapeHtml(pillar.title)}</h2>
            </div>
          </div>
          <div class="framework-grid">
            <div>
              <h3>Question</h3>
              <p>${escapeHtml(pillar.question)}</p>
            </div>
            <div>
              <h3>What I look for</h3>
              <p>${escapeHtml(pillar.focus)}</p>
            </div>
            <div>
              <h3>What confirms it</h3>
              <p>${escapeHtml(pillar.confirmation)}</p>
            </div>
            <div>
              <h3>What breaks it</h3>
              <p>${escapeHtml(pillar.risk)}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderScorecard() {
  const host = document.querySelector("[data-scorecard]");
  if (!host) return;

  const scoreRows = [
    ["Price quality", "Is the stock respecting support and outperforming its group?"],
    ["Narrative force", "Is the story becoming more urgent, or just more repeated?"],
    ["Participation", "Are adjacent names confirming the same move?"],
    ["Positioning", "Is the market still skeptical enough for asymmetry?"],
    ["Tailwind", "Is there a durable real-world force underneath the setup?"],
    ["Timing", "What would validate the idea over the next few weeks?"],
    ["Risk", "Where does the thesis stop being early and start being wrong?"],
  ];

  host.innerHTML = scoreRows
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
