import { philosophyPoints, positioningPoints, summaryStats } from "./data.js";
import { escapeHtml, refreshReveal, setupSite } from "./site.js";

setupSite("about");
renderAboutStats();
renderPhilosophy();
renderMaxims();
refreshReveal();

function renderAboutStats() {
  const host = document.querySelector("[data-about-stats]");
  if (!host) return;

  const items = [
    `${summaryStats.analysisCount} active analysis pieces`,
    `${summaryStats.themeCount} trend clusters`,
    `${summaryStats.watchlistCount} scenario charts`,
    `${summaryStats.caseStudyCount} selected calls`,
  ];

  host.innerHTML = items.map((item) => `<span class="inline-stat">${escapeHtml(item)}</span>`).join("");
}

function renderPhilosophy() {
  const host = document.querySelector("[data-philosophy-grid]");
  if (!host) return;

  host.innerHTML = philosophyPoints
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

function renderMaxims() {
  const host = document.querySelector("[data-maxims]");
  if (!host) return;

  host.innerHTML = positioningPoints
    .map(
      (item) => `
        <article class="maxim-card" data-reveal>
          <p>${escapeHtml(item)}</p>
        </article>
      `,
    )
    .join("");
}
