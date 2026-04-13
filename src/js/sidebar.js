import { chatsDatabase, incrementNextChatId } from "./db.js";
import { renderChat } from "./messages.js";

const sidebar = document.getElementById("sidebar");
const btn     = document.getElementById("collapse-btn");
const body    = document.body;

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
});

// Toggle móvil
document.getElementById("toggle")?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});