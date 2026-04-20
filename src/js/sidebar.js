import { chatsDatabase, incrementNextChatId } from "./db.js";
import { renderChat } from "./messages.js";

const sidebar = document.getElementById("sidebar");
const btn     = document.getElementById("collapse-btn");
const body    = document.body;

// ── DETECCIÓN DE ZOOM ──────────────────────────────────────────

const BASE_DPR = window.devicePixelRatio;

function isHighZoom() {
  return window.devicePixelRatio >= BASE_DPR * 2;
}

function isNarrowOrZoomed() {
  return isHighZoom() || window.innerWidth < 768;
}

function applyZoomMode() {
  body.classList.toggle('zoom-overlay-mode', isNarrowOrZoomed());
}

applyZoomMode();
window.addEventListener('resize', applyZoomMode);
// También responde a cambios de zoom (visualViewport)
window.visualViewport?.addEventListener('resize', applyZoomMode);

document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
  sidebar.classList.add('collapsed');
  btn.setAttribute('aria-expanded', 'false');
  btn.querySelector('span').textContent = '→';
  body.classList.add('sidebar-collapsed');
  document.getElementById('sidebar-overlay').style.display = 'none'; // ← añadir
}); 

export function createNewChat() {
  const id    = incrementNextChatId();
  const title = `Nueva conversación ${id}`;

  chatsDatabase[id] = { id, title, messages: [] };

  const ul = document.querySelector("#recent-chats");
  const li = document.createElement("li");
  const a  = document.createElement("a");

  a.href           = "#";
  a.className      = "chat-link";
  a.dataset.chatId = id;
  a.textContent    = title;

  a.addEventListener("click", (e) => {
    e.preventDefault();
    renderChat(id);
  });

  li.appendChild(a);
  ul.prepend(li);
  renderChat(id);
}

// Links de chat ya existentes en el HTML
document.querySelectorAll(".chat-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const chatId = parseInt(link.dataset.chatId);
    renderChat(chatId);
  });
});

// Imagen de perfil
const profileImg = document.getElementById("profile-img");
if (profileImg && typeof profilePic !== "undefined") {
  profileImg.src = profilePic;
}

// Botón colapsar sidebar (escritorio)
btn.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");
  btn.setAttribute("aria-expanded", !isCollapsed);
  btn.querySelector("span").textContent = isCollapsed ? "→" : "←";
  body.classList.toggle("sidebar-collapsed", isCollapsed);

  // ── NUEVO: gestionar overlay ──
  const overlay = document.getElementById("sidebar-overlay");
  if (isCollapsed) {
    overlay.style.display = "none";      // ocultar al colapsar
  } else if (isNarrowOrZoomed()) {
    overlay.style.display = "block";     // mostrar solo si hay zoom alto
  }
});

// Toggle móvil
document.getElementById("toggle")?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});