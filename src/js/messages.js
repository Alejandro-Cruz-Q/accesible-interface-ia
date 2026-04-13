import {
  chatsDatabase,
  getActiveReadBtn,
  setCurrentChatId,
  setActiveReadBtn,
} from "./db.js";

export function setActiveChat(chatId) {
  document.querySelectorAll("#sidebar li").forEach((li) => {
    li.classList.remove("active");
  });
  const activeLink = document.querySelector(`.chat-link[data-chat-id="${chatId}"]`);
  if (activeLink) activeLink.closest("li").classList.add("active");
}

export function createMessageEl(type, text) {
  const wrapper = document.createElement("div");
  wrapper.className =
    type === "user" ? "msg-wrapper msg-wrapper--user" : "msg-wrapper msg-wrapper--bot";

  const bubble = document.createElement("div");
  bubble.className = type === "user" ? "user-msg" : "bot-msg";
  bubble.textContent = text;

  const actions = document.createElement("div");
  actions.className = "msg-actions";

  const userButtons = [
    { icon: "pencil",    label: "Editar",          action: "edit"   },
    { icon: "copy",      label: "Copiar",           action: "copy"   },
    { icon: "mic-vocal", label: "Leer en voz alta", action: "read"   },
    { icon: "trash-2",   label: "Eliminar",         action: "delete" },
  ];

  const botButtons = [
    { icon: "refresh-cw",  label: "Reescribir",      action: "rewrite" },
    { icon: "copy",        label: "Copiar",           action: "copy"    },
    { icon: "mic-vocal",   label: "Leer en voz alta", action: "read"    },
    { icon: "share-2",     label: "Compartir",        action: "share"   },
    { icon: "thumbs-up",   label: "Me gusta",         action: "like"    },
    { icon: "thumbs-down", label: "No me gusta",      action: "dislike" },
    { icon: "trash-2",     label: "Eliminar",         action: "delete"  },
  ];

  const buttons = type === "user" ? userButtons : botButtons;

  buttons.forEach(({ icon, label, action }) => {
    const btn = document.createElement("button");
    btn.className = "msg-action-btn";
    btn.dataset.action = action;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);

    const icono = document.createElement("i");
    icono.setAttribute("data-lucide", icon);
    btn.appendChild(icono);

    if (action === "copy") {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(bubble.textContent);
        icono.setAttribute("data-lucide", "check");
        lucide.createIcons({ nodes: [icono] });
        setTimeout(() => {
          icono.setAttribute("data-lucide", "copy");
          lucide.createIcons({ nodes: [icono] });
        }, 1500);
      });
    }

    if (action === "read") {
      btn.addEventListener("click", () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          icono.setAttribute("data-lucide", "mic-vocal");
          lucide.createIcons({ nodes: [icono] });
          setActiveReadBtn(null);
          return;
        }

        const currentActiveReadBtn = getActiveReadBtn();
        if (currentActiveReadBtn && currentActiveReadBtn !== icono) {
          currentActiveReadBtn.setAttribute("data-lucide", "mic-vocal");
          lucide.createIcons({ nodes: [currentActiveReadBtn] });
        }
        setActiveReadBtn(icono);

        const utterance = new SpeechSynthesisUtterance(bubble.textContent);
        utterance.lang  = "es-ES";
        utterance.rate  = 1;
        utterance.pitch = 1;

        icono.setAttribute("data-lucide", "volume-2");
        lucide.createIcons({ nodes: [icono] });

        utterance.onend = () => {
          icono.setAttribute("data-lucide", "mic-vocal");
          lucide.createIcons({ nodes: [icono] });
          setActiveReadBtn(null);
        };
        utterance.onerror = () => {
          icono.setAttribute("data-lucide", "mic-vocal");
          lucide.createIcons({ nodes: [icono] });
          setActiveReadBtn(null);
        };

        window.speechSynthesis.speak(utterance);
      });
    }

    actions.appendChild(btn);
  });

  wrapper.appendChild(bubble);
  wrapper.appendChild(actions);
  return wrapper;
}

export function renderChat(chatId) {
  const chat = chatsDatabase[chatId];
  if (!chat) return;

  setCurrentChatId(chatId);
  setActiveChat(chatId);

  document.querySelector(".header-center h2").textContent = chat.title;

  const chatArea = document.getElementById("chat-area");
  chatArea.innerHTML = "";

  if (chat.messages.length === 0) {
    const welcome = document.createElement("div");
    welcome.className   = "welcome-message";
    welcome.textContent = "Escribe un mensaje para comenzar...";
    chatArea.appendChild(welcome);
    return;
  }

  chat.messages.forEach((msg) => {
    const msgEl = createMessageEl(msg.type, msg.text);
    chatArea.appendChild(msgEl);
    lucide.createIcons({ nodes: Array.from(msgEl.querySelectorAll("[data-lucide]")) });
  });

  chatArea.scrollTop = chatArea.scrollHeight;
}