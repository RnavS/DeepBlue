import { contactLinks } from "./data.js";
import { escapeHtml, refreshReveal, setupSite } from "./site.js";

setupSite("contact");
renderContactLinks();
refreshReveal();

function renderContactLinks() {
  const host = document.querySelector("[data-contact-links]");
  if (!host) return;

  host.innerHTML = contactLinks
    .map(
      (item) => `
        <a class="contact-link" href="${escapeHtml(item.href)}" data-reveal>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </a>
      `,
    )
    .join("");
}
