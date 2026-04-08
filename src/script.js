const sidebar = document.getElementById("sidebar");
const content = document.getElementById("sidebar-content");
const btn = document.getElementById("collapse-btn");
const body = document.body;

// Base de datos simulada de chats
const chatsDatabase = {
  1: {
    id: 1,
    title: "Capital de Francia",
    messages: [
      { type: "user", text: "¿Cuál es la capital de Francia?" },
      {
        type: "bot",
        text: "La capital de Francia es París, una de las ciudades más hermosas del mundo.",
      },
      { type: "user", text: "¿Cuántos habitantes tiene?" },
      {
        type: "bot",
        text: "París tiene aproximadamente 2.1 millones de habitantes, y el área metropolitana tiene alrededor de 12 millones.",
      },
    ],
  },
  2: {
    id: 2,
    title: "Programación",

    messages: [
      { type: "user", text: "Explícame qué es la programación" },
      {
        type: "bot",
        text: "La programación es el proceso de crear instrucciones que le indican a una computadora qué hacer.",
      },
      { type: "user", text: "¿Qué lenguajes son los más populares?" },
      {
        type: "bot",
        text: "Los lenguajes más populares actualmente son: Python, JavaScript, Java, C++ y TypeScript.",
      },
    ],
  },
  3: {
    id: 3,
    title: "Inteligencia Artificial",
    messages: [
      { type: "user", text: "¿Cómo funciona la inteligencia artificial?" },
      {
        type: "bot",
        text: "La IA funciona mediante algoritmos de aprendizaje que procesan datos y reconocen patrones.",
      },
      { type: "user", text: "¿Qué aplicaciones tiene?" },
      {
        type: "bot",
        text: "La IA se usa en: reconocimiento de voz, visión por computadora, asistentes virtuales, conducción autónoma, medicina y muchas más.",
      },
    ],
  },
};

const GROQ_API_KEY = "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";

async function askGemini(chatId) {
  const messages = chatsDatabase[chatId].messages.map((msg) => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
    }),
  });

  if (!response.ok) throw new Error(`Error API: ${response.status}`);

  const data = await response.json();
  return data.choices[0].message.content;
}

function setActiveChat(chatId) {
  document.querySelectorAll("#sidebar li").forEach((li) => {
    li.classList.remove("active");
  });

  const activeLink = document.querySelector(
    `.chat-link[data-chat-id="${chatId}"]`,
  );
  if (activeLink) {
    activeLink.closest("li").classList.add("active");
  }
}

let currentChatId = null;

function renderChat(chatId) {
  const chat = chatsDatabase[chatId];
  if (!chat) return;

  currentChatId = chatId;
  setActiveChat(chatId);

  // Actualizar título del header
  document.querySelector(".header-center h2").textContent = chat.title;

  // Limpiar el área de chat
  const chatArea = document.getElementById("chat-area");
  chatArea.innerHTML = "";

  // Chat vacío → mostrar mensaje de bienvenida
  if (chat.messages.length === 0) {
    const welcome = document.createElement("div");
    welcome.className = "welcome-message";
    welcome.textContent = "Escribe un mensaje para comenzar...";
    chatArea.appendChild(welcome);
    return;
  }

  // Renderizar mensajes del chat
  chat.messages.forEach((msg) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = msg.type === "user" ? "user-msg" : "bot-msg";
    msgDiv.textContent = msg.text;
    chatArea.appendChild(msgDiv);
  });

  // Scroll hacia el final
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Contador para IDs únicos de nuevos chats
let nextChatId = Object.keys(chatsDatabase).length + 1;

function createNewChat() {
  const id = nextChatId++;
  const title = `Nueva conversación ${id}`;

  // Añadir a la base de datos simulada
  chatsDatabase[id] = {
    id,
    title,
    messages: [],
  };

  // Crear el <li> y el <a> en el sidebar
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
  ul.prepend(li); // el nuevo chat aparece el primero de la lista

  // Mostrar el chat vacío en la zona principal
  renderChat(id);
}

// Event listeners para los links de chat en la barra lateral
document.querySelectorAll(".chat-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const chatId = parseInt(link.dataset.chatId);
    renderChat(chatId);
  });
});

// Asignar imagen de perfil
const profileImg = document.getElementById("profile-img");
if (profileImg && typeof profilePic !== "undefined") {
  profileImg.src = profilePic;
}

btn.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");
  btn.setAttribute("aria-expanded", !isCollapsed);
  btn.querySelector("span").textContent = isCollapsed ? "→" : "←";
  body.classList.toggle("sidebar-collapsed", isCollapsed);
});

// Toggle móvil (mantiene funcionalidad previa)
document.getElementById("toggle")?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("send-btn").click();
});

// IDs de todos los menús y sus botones
const MENU_CONFIG = [
  { btnId: "tools-btn", menuId: "tools-menu" },
  { btnId: "options-btn", menuId: "options-menu" },
  { btnId: "header-options-btn", menuId: "header-options-menu" },
  { btnId: "profile-menu-btn", menuId: "profile-menu" },
];

// Cierra todos los menús excepto el que se indica (null = cierra todos)
function closeAllMenus(exceptMenuId = null) {
  MENU_CONFIG.forEach(({ btnId, menuId }) => {
    if (menuId === exceptMenuId) return;
    const menu = document.getElementById(menuId);
    const btn = document.getElementById(btnId);
    if (menu) menu.setAttribute("hidden", "");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

// Configura apertura/cierre de un menú y el cierre al seleccionar un ítem
function setupDropdownMenu(btnId, menuId) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);

  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // evita que el click llegue al document
    const isOpen = !menu.hasAttribute("hidden");
    closeAllMenus(); // cierra cualquier otro menú abierto
    if (!isOpen) {
      menu.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  // Cerrar al seleccionar un ítem (funciona para .tools-menu-item y .profile-menu-item)
  menu
    .querySelectorAll(".tools-menu-item, .profile-menu-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        menu.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      });
    });

  menu.addEventListener("keydown", (e) => {
    // Cerrar con Escape y devolver foco al botón
    if (e.key === "Escape") {
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
      return;
    }

    // Focus trap con Tab
    if (e.key !== "Tab") return;

    const focusable = Array.from(
      menu.querySelectorAll(".tools-menu-item, .profile-menu-item"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab en el primero → salta al último
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab en el último → salta al primero
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// Registrar todos los menús con la misma lógica
MENU_CONFIG.forEach(({ btnId, menuId }) => setupDropdownMenu(btnId, menuId));

// Cerrar todos al hacer click fuera de cualquier menú
document.addEventListener("click", () => closeAllMenus());

document.getElementById("send-btn").addEventListener("click", async () => {
  const input = document.getElementById("chat-input");
  if (!input.value.trim()) return;

  // Si no hay chat abierto, crear uno nuevo
  if (!currentChatId) createNewChat();

  // Eliminar mensaje de bienvenida si existe
  const welcomeMessage = document.querySelector(".welcome-message");
  if (welcomeMessage) welcomeMessage.remove();

  const userText = input.value.trim();

  // Guardar y mostrar mensaje del usuario
  chatsDatabase[currentChatId].messages.push({ type: "user", text: userText });

  const chatArea = document.getElementById("chat-area");
  const userMsg = document.createElement("div");
  userMsg.className = "user-msg";
  userMsg.textContent = userText;
  chatArea.appendChild(userMsg);

  input.value = "";
  chatArea.scrollTop = chatArea.scrollHeight;

  // Indicador de escritura
  const typing = document.createElement("div");
  typing.className = "bot-msg typing-indicator";
  typing.textContent = "...";
  chatArea.appendChild(typing);
  chatArea.scrollTop = chatArea.scrollHeight;

  try {
    const botText = await askGemini(currentChatId);

    // Eliminar indicador y mostrar respuesta real
    typing.remove();

    chatsDatabase[currentChatId].messages.push({ type: "bot", text: botText });

    const botMsg = document.createElement("div");
    botMsg.className = "bot-msg";
    botMsg.textContent = botText;
    chatArea.appendChild(botMsg);
  } catch (error) {
    typing.remove();

    const errMsg = document.createElement("div");
    errMsg.className = "bot-msg";

    if (error.message.includes("429")) {
      errMsg.textContent =
        "Demasiadas peticiones. Espera unos segundos e inténtalo de nuevo.";
    } else if (error.message.includes("401") || error.message.includes("403")) {
      errMsg.textContent = "API key inválida o sin permisos.";
    } else {
      errMsg.textContent = `Error al conectar con la IA: ${error.message}`;
    }

    chatArea.appendChild(errMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
    console.error(error);
  }

  chatArea.scrollTop = chatArea.scrollHeight;
});

document
  .querySelectorAll("#new-chat-btn, #new-conversation-btn")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      createNewChat();
    });
  });
