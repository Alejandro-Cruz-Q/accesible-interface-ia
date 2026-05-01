import { chatsDatabase, incrementNextChatId } from "./db.js";
import { renderChat } from "./messages.js";

const sidebar = document.getElementById("sidebar");
const btn = document.getElementById("collapse-btn");
const body = document.body;

function isHighZoom() {
  return window.devicePixelRatio >= 2;
}

function isNarrowOrZoomed() {
  return isHighZoom() || window.innerWidth < 768;
}

function applyZoomMode() {
  const isZoomed = isNarrowOrZoomed();
  const overlay = document.getElementById("sidebar-overlay");
  const sidebarCollapsed = sidebar.classList.contains("collapsed");

  body.classList.toggle("zoom-overlay-mode", isZoomed);

  // Mostrar overlay SOLO cuando zoom es activado Y sidebar NO está colapsado
  if (isZoomed && !sidebarCollapsed) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}

applyZoomMode();
window.addEventListener("resize", applyZoomMode);
window.visualViewport?.addEventListener("resize", applyZoomMode);

document.getElementById("sidebar-overlay")?.addEventListener("click", () => {
  sidebar.classList.add("collapsed");
  btn.setAttribute("aria-expanded", "false");
  btn.querySelector("span").textContent = "→";
  body.classList.add("sidebar-collapsed");
  updateCollapseBtnTooltip();
  applyZoomMode();
});

document.querySelectorAll(".chat-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const chatId = parseInt(link.dataset.chatId);
    renderChat(chatId);
  });
});

export function createNewChat() {
  const id = incrementNextChatId();
  const title = `Nueva conversación ${id}`;

  chatsDatabase[id] = { id, title, messages: [] };

  const ul = document.querySelector("#recent-chats");
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = "#";
  a.className = "chat-link";
  a.dataset.chatId = id;
  a.textContent = title;

  a.addEventListener("click", (e) => {
    e.preventDefault();
    renderChat(id);
  });

  li.appendChild(a);
  ul.prepend(li);
  renderChat(id);
}

function updateCollapseBtnTooltip() {
  const isCollapsed = sidebar.classList.contains("collapsed");
  btn.setAttribute(
    "aria-label",
    isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral",
  );
}

updateCollapseBtnTooltip();

btn.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");
  btn.setAttribute("aria-expanded", !isCollapsed);
  btn.querySelector("span").textContent = isCollapsed ? "→" : "←";
  body.classList.toggle("sidebar-collapsed", isCollapsed);
  updateCollapseBtnTooltip();

  // Actualizar overlay basado en el nuevo estado
  applyZoomMode();
});

// ===== Tooltips para sidebar colapsado =====
let tooltipElement = null;

function createFixedTooltip(text, x, y) {
  if (tooltipElement) {
    tooltipElement.remove();
  }

  tooltipElement = document.createElement("div");
  tooltipElement.textContent = text;
  tooltipElement.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: #111;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.3rem 0.65rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    z-index: 9999;
    pointer-events: none;
    transform: translateY(-50%);
  `;

  document.body.appendChild(tooltipElement);
}

function removeFixedTooltip() {
  if (tooltipElement) {
    tooltipElement.remove();
    tooltipElement = null;
  }
}

// Agregar listeners a los botones del sidebar cuando está colapsado
const sidebarFuncsLinks = document.querySelectorAll(".sidebar-funcs a");

sidebarFuncsLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    if (sidebar.classList.contains("collapsed")) {
      const rect = link.getBoundingClientRect();
      const ariaLabel = link.getAttribute("aria-label");

      if (ariaLabel) {
        createFixedTooltip(
          ariaLabel,
          rect.right + 12,
          rect.top + rect.height / 2,
        );
      }
    }
  });

  link.addEventListener("mouseleave", () => {
    removeFixedTooltip();
  });

  link.addEventListener("focus", () => {
    if (sidebar.classList.contains("collapsed")) {
      const rect = link.getBoundingClientRect();
      const ariaLabel = link.getAttribute("aria-label");

      if (ariaLabel) {
        createFixedTooltip(
          ariaLabel,
          rect.right + 12,
          rect.top + rect.height / 2,
        );
      }
    }
  });

  link.addEventListener("blur", () => {
    removeFixedTooltip();
  });
});
