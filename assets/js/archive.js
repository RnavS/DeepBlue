import { analysisEntries, projectionWatchlist } from "./data.js";
import {
  bindLogoFallbacks,
  buildLogoMarkup,
  buildProjectionSvg,
  buildScenarioButtons,
  buildTagMarkup,
  buildTickerMarkup,
  calculateScenarioDelta,
  escapeHtml,
  getStock,
  refreshReveal,
  setupSite,
} from "./site.js";

setupSite("analysis");

const state = {
  query: "",
  category: "all",
  status: "all",
  activeId: analysisEntries[0]?.id ?? null,
  activeProjectionTicker: projectionWatchlist[0]?.ticker ?? null,
  activeScenario: "base",
};

renderFilterControls();
renderAnalysis();
renderProjectionLab();
document.addEventListener("input", handleFilters);
document.addEventListener("change", handleFilters);
document.addEventListener("click", handleClicks);

function renderFilterControls() {
  const host = document.querySelector("[data-analysis-filters]");
  if (!host) return;

  const categories = [...new Set(analysisEntries.map((entry) => entry.category))];
  const statuses = [...new Set(analysisEntries.map((entry) => entry.status))];

  host.innerHTML = `
    <label class="field">
      <span>Search</span>
      <input type="search" name="query" placeholder="Titles, tags, thesis language" />
    </label>
    ${renderSelect("category", "Category", categories)}
    ${renderSelect("status", "Status", statuses)}
  `;
}

function renderSelect(name, label, values) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <select name="${name}">
        <option value="all">All</option>
        ${values
          .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function getFilteredEntries() {
  return analysisEntries.filter((entry) => {
    const haystack = [entry.title, entry.summary, entry.thesis, ...entry.tags].join(" ").toLowerCase();
    const matchesQuery = !state.query || haystack.includes(state.query.toLowerCase());
    const matchesCategory = state.category === "all" || entry.category === state.category;
    const matchesStatus = state.status === "all" || entry.status === state.status;
    return matchesQuery && matchesCategory && matchesStatus;
  });
}

function renderAnalysis() {
  const filtered = getFilteredEntries();
  if (!filtered.some((entry) => entry.id === state.activeId)) {
    state.activeId = filtered[0]?.id ?? null;
  }

  renderCount(filtered.length);
  renderDetail(filtered);
  renderGrid(filtered);
  bindLogoFallbacks();
  refreshReveal();
}

function renderCount(count) {
  const host = document.querySelector("[data-analysis-count]");
  if (!host) return;
  host.textContent = `${count} note${count === 1 ? "" : "s"} visible`;
}

function renderDetail(filtered) {
  const host = document.querySelector("[data-analysis-detail]");
  if (!host) return;
  const entry = filtered.find((item) => item.id === state.activeId) ?? filtered[0];
  if (!entry) {
    host.innerHTML = `<p class="detail-empty">No analysis matches the current filter set.</p>`;
    return;
  }

  host.innerHTML = `
    <article class="detail-card" data-reveal>
      <div class="detail-card__topline">
        <span>${escapeHtml(entry.category)}</span>
        <span>${escapeHtml(entry.status)}</span>
        <span>${escapeHtml(entry.readingTime)}</span>
      </div>
      <h2>${escapeHtml(entry.title)}</h2>
      <p>${escapeHtml(entry.summary)}</p>
      <div class="detail-grid">
        <div>
          <h3>Core view</h3>
          <p>${escapeHtml(entry.thesis)}</p>
        </div>
        <div>
          <h3>Related tickers</h3>
          <div class="ticker-row">${buildTickerMarkup(entry.tickers)}</div>
        </div>
      </div>
      <div class="tag-row">${buildTagMarkup(entry.tags)}</div>
    </article>
  `;
}

function renderGrid(filtered) {
  const host = document.querySelector("[data-analysis-grid]");
  if (!host) return;

  host.innerHTML = filtered
    .map(
      (entry) => `
        <article class="archive-card${entry.id === state.activeId ? " is-active" : ""}" data-entry-id="${entry.id}" data-reveal>
          <div class="archive-card__meta">
            <span>${escapeHtml(entry.category)}</span>
            <span>${escapeHtml(entry.date)}</span>
          </div>
          <h3>${escapeHtml(entry.title)}</h3>
          <p>${escapeHtml(entry.summary)}</p>
          <div class="tag-row">${buildTagMarkup(entry.tags, 3)}</div>
          <div class="ticker-row">${buildTickerMarkup(entry.tickers)}</div>
        </article>
      `,
    )
    .join("");
}

function renderProjectionLab() {
  const host = document.querySelector("[data-projection-lab]");
  if (!host) return;
  const item =
    projectionWatchlist.find((entry) => entry.ticker === state.activeProjectionTicker) ??
    projectionWatchlist[0];
  if (!item) return;

  const stock = getStock(item.ticker);

  host.innerHTML = `
    <div class="projection-lab">
      <aside class="projection-list">
        ${projectionWatchlist
          .map(
            (entry) => `
              <button class="projection-list__item${
                entry.ticker === item.ticker ? " is-active" : ""
              }" type="button" data-projection-ticker="${entry.ticker}">
                ${buildLogoMarkup(entry.ticker, "logo-badge logo-badge--small")}
                <div>
                  <strong>${escapeHtml(entry.ticker)}</strong>
                  <span>${escapeHtml(entry.theme)}</span>
                </div>
              </button>
            `,
          )
          .join("")}
      </aside>
      <article class="projection-spotlight" data-reveal>
        <div class="projection-card__header">
          <div class="projection-brand">
            ${buildLogoMarkup(item.ticker)}
            <div>
              <strong>${escapeHtml(stock?.name ?? item.ticker)}</strong>
              <span>${escapeHtml(item.stance)}</span>
            </div>
          </div>
          <span class="projection-delta">${calculateScenarioDelta(item.projection, state.activeScenario)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.setup)}</p>
        <div class="scenario-tabs">
          ${buildScenarioButtons(state.activeScenario)}
        </div>
        ${buildProjectionSvg(item.projection, state.activeScenario)}
        <div class="detail-grid">
          <div>
            <h3>Validation path</h3>
            <p>${escapeHtml(item.validation)}</p>
          </div>
          <div>
            <h3>Risk to thesis</h3>
            <p>${escapeHtml(item.risk)}</p>
          </div>
        </div>
        <div class="tag-row">${buildTagMarkup(item.signals)}</div>
      </article>
    </div>
  `;

  bindLogoFallbacks();
  refreshReveal();
}

function handleFilters(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
  if (!target.name) return;
  state[target.name] = target.value.trim();
  renderAnalysis();
}

function handleClicks(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const entryId = target.closest("[data-entry-id]")?.getAttribute("data-entry-id");
  if (entryId) {
    state.activeId = entryId;
    renderAnalysis();
    return;
  }

  const projectionTicker = target.closest("[data-projection-ticker]")?.getAttribute("data-projection-ticker");
  if (projectionTicker) {
    state.activeProjectionTicker = projectionTicker;
    renderProjectionLab();
    return;
  }

  const scenarioButton = target.closest("[data-scenario]");
  if (scenarioButton instanceof HTMLElement) {
    state.activeScenario = scenarioButton.getAttribute("data-scenario") ?? "base";
    renderProjectionLab();
  }
}
