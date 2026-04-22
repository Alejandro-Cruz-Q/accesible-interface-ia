import { chatsDatabase, incrementNextChatId } from "./db.js";
import { renderChat } from "./messages.js";

const sidebar = document.getElementById("sidebar");
const btn = document.getElementById("collapse-btn");
const body = document.body;

const BASE_DPR = window.devicePixelRatio;

function isHighZoom() {
  return window.devicePixelRatio >= BASE_DPR * 2;
}

function isNarrowOrZoomed() {
  return isHighZoom() || window.innerWidth < 768;
}

function applyZoomMode() {
  body.classList.toggle("zoom-overlay-mode", isNarrowOrZoomed());
}

applyZoomMode();
window.addEventListener("resize", applyZoomMode);
window.visualViewport?.addEventListener("resize", applyZoomMode);

document.getElementById("sidebar-overlay")?.addEventListener("click", () => {
  sidebar.classList.add("collapsed");
  btn.setAttribute("aria-expanded", "false");
  btn.querySelector("span").textContent = "→";
  body.classList.add("sidebar-collapsed");
  document.getElementById("sidebar-overlay").style.display = "none";
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

btn.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");
  btn.setAttribute("aria-expanded", !isCollapsed);
  btn.querySelector("span").textContent = isCollapsed ? "→" : "←";
  body.classList.toggle("sidebar-collapsed", isCollapsed);

  const overlay = document.getElementById("sidebar-overlay");
  if (isCollapsed) {
    overlay.style.display = "none";
  } else if (isNarrowOrZoomed()) {
    overlay.style.display = "block";
  }
});
