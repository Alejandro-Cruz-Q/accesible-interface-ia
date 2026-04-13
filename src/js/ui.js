import { chatsDatabase, getCurrentChatId } from "./db.js";
import { askGemini } from "./api.js";
import { createMessageEl } from "./messages.js";
import { createNewChat } from "./sidebar.js";

const MENU_CONFIG = [
  { btnId: "tools-btn",          menuId: "tools-menu"          },
  { btnId: "options-btn",        menuId: "options-menu"        },
  { btnId: "header-options-btn", menuId: "header-options-menu" },
  { btnId: "profile-menu-btn",   menuId: "profile-menu"        },
];

function closeAllMenus(exceptMenuId = null) {
  MENU_CONFIG.forEach(({ btnId, menuId }) => {
    if (menuId === exceptMenuId) return;
    const menu = document.getElementById(menuId);
    const btn  = document.getElementById(btnId);
    if (menu) menu.setAttribute("hidden", "");
    if (btn)  btn.setAttribute("aria-expanded", "false");
  });
}

function setupDropdownMenu(btnId, menuId) {
  const btn  = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !menu.hasAttribute("hidden");
    closeAllMenus();
    if (!isOpen) {
      menu.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll(".tools-menu-item, .profile-menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = Array.from(
      menu.querySelectorAll(".tools-menu-item, .profile-menu-item"),
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}

MENU_CONFIG.forEach(({ btnId, menuId }) => setupDropdownMenu(btnId, menuId));
document.addEventListener("click", () => closeAllMenus());



document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("send-btn").click();
});

document.getElementById("send-btn").addEventListener("click", async () => {
  const input = document.getElementById("chat-input");
  if (!input.value.trim()) { input.focus(); return; }
  input.focus();

  if (!getCurrentChatId()) createNewChat();

  document.querySelector(".welcome-message")?.remove();

  const userText = input.value.trim();
  chatsDatabase[getCurrentChatId()].messages.push({ type: "user", text: userText });

  const chatArea = document.getElementById("chat-area");
  const userEl   = createMessageEl("user", userText);
  chatArea.appendChild(userEl);
  lucide.createIcons({ nodes: Array.from(userEl.querySelectorAll("[data-lucide]")) });

  input.value = "";
  chatArea.scrollTop = chatArea.scrollHeight;

  const typing       = document.createElement("div");
  typing.className   = "bot-msg typing-indicator";
  typing.textContent = "...";
  chatArea.appendChild(typing);
  chatArea.scrollTop = chatArea.scrollHeight;

  try {
    const botText = await askGemini(getCurrentChatId());
    typing.remove();

    chatsDatabase[getCurrentChatId()].messages.push({ type: "bot", text: botText });

    const botEl = createMessageEl("bot", botText);
    chatArea.appendChild(botEl);
    lucide.createIcons({ nodes: Array.from(botEl.querySelectorAll("[data-lucide]")) });
  } catch (error) {
    typing.remove();
    const errMsg     = document.createElement("div");
    errMsg.className = "bot-msg";

    if (error.message.includes("429")) {
      errMsg.textContent = "Demasiadas peticiones. Espera unos segundos e inténtalo de nuevo.";
    } else if (error.message.includes("401") || error.message.includes("403")) {
      errMsg.textContent = "API key inválida o sin permisos.";
    } else {
      errMsg.textContent = `Error al conectar con la IA: ${error.message}`;
    }

    chatArea.appendChild(errMsg);
    console.error(error);
  }

  chatArea.scrollTop = chatArea.scrollHeight;
});

document.querySelectorAll("#new-chat-btn, #new-conversation-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => { e.preventDefault(); createNewChat(); });
});



const chatInput = document.getElementById("chat-input");
const voiceBtn  = document.getElementById("voice-btn");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition     = null;
let isListening     = false;
let finalTranscript = "";

if (SpeechRecognition) {
  recognition                = new SpeechRecognition();
  recognition.lang           = "es-ES";
  recognition.continuous     = true;
  recognition.interimResults = true;

  voiceBtn.addEventListener("click", () => {
    isListening ? stopVoiceRecognition() : startVoiceRecognition();
  });

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add("is-listening");
    voiceBtn.setAttribute("aria-pressed", "true");
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    finalTranscript = "";
    for (let i = 0; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += text + " ";
      else interimTranscript += text;
    }
    voiceBtn.dataset.interim = interimTranscript;
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove("is-listening");
    voiceBtn.setAttribute("aria-pressed", "false");
    if (finalTranscript.trim()) {
      chatInput.value = [chatInput.value.trim(), finalTranscript.trim()].filter(Boolean).join(" ");
      chatInput.dispatchEvent(new Event("input", { bubbles: true }));
      chatInput.focus();
    }
    voiceBtn.dataset.interim = "";
  };

  recognition.onerror = (event) => {
    isListening = false;
    voiceBtn.classList.remove("is-listening");
    voiceBtn.setAttribute("aria-pressed", "false");
    voiceBtn.dataset.interim = "";
    console.error("Error de reconocimiento:", event.error);
  };
}

function startVoiceRecognition() { finalTranscript = ""; recognition.start(); }
function stopVoiceRecognition()  { recognition.stop(); }