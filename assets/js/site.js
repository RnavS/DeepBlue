import { brand, stockCatalog, summaryStats } from "./data.js";

const sitePages = [
  { key: "home", label: "Home", href: "index.html" },
  { key: "about", label: "Philosophy", href: "about.html" },
  { key: "framework", label: "Framework", href: "methodology.html" },
  { key: "analysis", label: "Analysis", href: "literature.html" },
  { key: "themes", label: "Trend Map", href: "themes.html" },
  { key: "cases", label: "Selected Calls", href: "insights.html" },
  { key: "contact", label: "Contact", href: "portfolio.html" },
];

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getStock(ticker) {
  return stockCatalog[ticker];
}

export function buildTagMarkup(tags = [], limit = tags.length) {
  return tags
    .slice(0, limit)
    .map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`)
    .join("");
}

export function buildLogoMarkup(ticker, className = "logo-badge") {
  const stock = getStock(ticker);
  if (!stock) {
    return `<span class="${className}" data-fallback="true"><span class="logo-fallback">${escapeHtml(
      ticker.slice(0, 1),
    )}</span></span>`;
  }

  const logoUrl = stock.customLogo ? stock.customLogo : `https://logo.clearbit.com/${escapeHtml(stock.domain)}`;

  return `
    <span class="${className}" data-logo="${escapeHtml(ticker)}">
      <img src="${logoUrl}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.opacity='1';" />
      <span class="logo-fallback" style="display:flex;align-items:center;justify-content:center;opacity:0;">${escapeHtml(stock.ticker.slice(0, 1))}</span>
    </span>
  `;
}

function getMockLiveData(ticker) {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  hash = Math.abs(hash);
  const basePrice = 50 + (hash % 400) + (hash % 100) / 100;
  const isPositive = hash % 2 !== 0;
  const changePercent = ((hash % 400) / 100) || 0.5;
  const sparkline = [];
  let val = basePrice - (isPositive ? 1 : -1) * (basePrice * changePercent / 100) * 3;
  for (let i = 0; i < 7; i++) {
    val += (Math.sin(hash + i) * basePrice * 0.015);
    sparkline.push(val);
  }
  sparkline.push(basePrice);
  return { price: basePrice.toFixed(2), changePercent: changePercent.toFixed(2), isPositive, sparkline };
}

export function buildTickerMarkup(tickers = []) {
  return tickers
    .map((ticker) => {
      const stock = getStock(ticker);
      if (!stock) return "";
      const data = getMockLiveData(ticker);
      const width = 50;
      const height = 20;
      const min = Math.min(...data.sparkline);
      const max = Math.max(...data.sparkline);
      const range = Math.max(max - min, 0.1);
      const pts = data.sparkline.map((v, i) => `${i * (width / 7)},${height - ((v - min) / range) * height}`).join(" L ");
      const sparkCol = data.isPositive ? "#10b981" : "#ef4444";
      return `
        <span class="stock-card-mini">
          <div class="sm-top">
            ${buildLogoMarkup(ticker, "logo-badge logo-badge--small")}
            <span class="sm-ticker">${escapeHtml(stock.ticker)}</span>
            <span class="sm-price">$${data.price}</span>
          </div>
          <div class="sm-bottom">
            <span class="sm-change" style="color: ${sparkCol}">${data.isPositive ? "+" : "-"}${data.changePercent}%</span>
            <svg viewBox="-2 -2 54 24" class="sm-spark" role="img" aria-label="sparkline">
              <path d="M 0,${height - ((data.sparkline[0] - min) / range) * height} L ${pts}" fill="none" stroke="${sparkCol}" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </span>
      `;
    })
    .join("");
}

export function buildProjectionSvg(projection, activeScenario = "base") {
  const seriesNames = ["bear", "base", "bull"];
  const width = 320;
  const height = 148;
  const padding = 14;
  const allValues = seriesNames.flatMap((name) => projection[name]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = Math.max(max - min, 1);

  const pathFor = (values) =>
    values
      .map((value, index) => {
        const x =
          padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

  const fillFor = (values) => {
    const path = pathFor(values);
    const lastX = width - padding;
    const firstX = padding;
    return `${path} L${lastX} ${height - padding} L${firstX} ${height - padding} Z`;
  };

  const uid = `proj-${activeScenario}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return `
    <svg class="projection-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Scenario projection chart">
      <defs>
        <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(90, 138, 158, 0.18)" />
          <stop offset="100%" stop-color="rgba(90, 138, 158, 0)" />
        </linearGradient>
      </defs>
      <path class="projection-line projection-line--bear${activeScenario === "bear" ? " is-active" : ""}" d="${pathFor(
        projection.bear,
      )}" />
      <path class="projection-line projection-line--bull${activeScenario === "bull" ? " is-active" : ""}" d="${pathFor(
        projection.bull,
      )}" />
      <path class="projection-fill" d="${fillFor(projection[activeScenario])}" fill="url(#${uid})" />
      <path class="projection-line projection-line--base${activeScenario === "base" ? " is-active" : ""}" d="${pathFor(
        projection[activeScenario],
      )}" />
    </svg>
  `;
}

export function buildScenarioButtons(activeScenario = "base") {
  return ["bear", "base", "bull"]
    .map(
      (scenario) => `
        <button class="scenario-tab${scenario === activeScenario ? " is-active" : ""}" type="button" data-scenario="${scenario}">
          ${scenario}
        </button>
      `,
    )
    .join("");
}

export function calculateScenarioDelta(projection, scenario) {
  const values = projection[scenario];
  const start = values[0];
  const end = values[values.length - 1];
  const delta = ((end - start) / start) * 100;
  return `${delta > 0 ? "+" : ""}${delta.toFixed(0)}%`;
}

export function setupSite(pageKey) {
  initThemeScope();
  renderHeader(pageKey);
  renderFooter();
  initNavToggle();
  initThemeToggle();
  bindLogoFallbacks();
  refreshReveal();
}

function initThemeScope() {
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
}

function initThemeToggle() {
  const toggleBtn = document.querySelector(".theme-toggle");
  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

export function refreshReveal() {
  const nodes = [...document.querySelectorAll("[data-reveal]")];
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  nodes.forEach((node) => observer.observe(node));
}

export function bindLogoFallbacks(scope = document) {
  const images = scope.querySelectorAll(".logo-badge img");
  images.forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.closest(".logo-badge")?.setAttribute("data-fallback", "true");
      },
      { once: true },
    );
  });
}

function renderHeader(pageKey) {
  const host = document.querySelector("[data-site-header]");
  if (!host) return;

  host.innerHTML = `
    <header class="site-header">
      <div class="container nav-shell">
        <a class="brand-lockup" href="index.html" aria-label="${escapeHtml(brand.name)} home">
          <span class="brand-mark" aria-hidden="true">
            <img src="assets/images/deepblue-shield.png" alt="" />
          </span>
          <span class="brand-copy">
            <span class="brand-kicker">${escapeHtml(brand.descriptor)}</span>
            <span class="brand-name-row">
              <span class="brand-name">${escapeHtml(brand.name)}</span>
              <span class="brand-pill">Industry pattern analysis</span>
            </span>
          </span>
        </a>
        <button class="theme-toggle" type="button" aria-label="Toggle light/dark theme">
          <span class="theme-icon"></span>
        </button>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav class="main-nav" id="main-nav" data-open="false">
          ${sitePages
            .map(
              (page) => `
                <a class="nav-link${page.key === pageKey ? " is-active" : ""}" href="${page.href}">
                  ${escapeHtml(page.label)}
                </a>
              `,
            )
            .join("")}
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const host = document.querySelector("[data-site-footer]");
  if (!host) return;

  host.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-shell">
        <div class="footer-brand">
          <a class="brand-lockup brand-lockup--footer" href="index.html" aria-label="${escapeHtml(brand.name)} home">
            <span class="brand-mark" aria-hidden="true">
              <img src="assets/images/deepblue-shield.png" alt="" />
            </span>
            <span class="brand-copy">
              <span class="brand-kicker">${escapeHtml(brand.descriptor)}</span>
              <span class="brand-name-row">
                <span class="brand-name">${escapeHtml(brand.name)}</span>
                <span class="brand-pill">Industry pattern analysis</span>
              </span>
            </span>
          </a>
          <p class="footer-copy">
            Personal market analysis focused on stocks, sectors, narratives, sentiment shifts, and the
            structure underneath price.
          </p>
          <p class="footer-copy">
            ${summaryStats.analysisCount} analysis notes, ${summaryStats.themeCount} tracked themes,
            ${summaryStats.caseStudyCount} selected calls, and ${summaryStats.watchlistCount} active watchlist projections.
          </p>
        </div>
        <div class="footer-links">
          ${sitePages
            .map(
              (page) => `
                <a href="${page.href}">${escapeHtml(page.label)}</a>
              `,
            )
            .join("")}
        </div>
      </div>
    </footer>
  `;
}

function initNavToggle() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    nav.dataset.open = String(!isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));
  });
}
