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

// Función para renderizar los mensajes de un chat
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

document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  if (input.value.trim()) {
    // Eliminar mensaje de bienvenida si existe
    const welcomeMessage = document.querySelector(".welcome-message");
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    // Si no hay chat abierto, abrir el primero
    if (!currentChatId) {
      renderChat(1);
    }

    // Agregar mensaje del usuario al chat simulado
    const chatArea = document.getElementById("chat-area");
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = input.value;
    chatArea.appendChild(userMsg);

    // Agregar mensaje simulado del bot (con pequeño delay)
    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "bot-msg";
      botMsg.textContent =
        "Este es un mensaje simulado de la IA. En producción, aquí vendría la respuesta real.";
      chatArea.appendChild(botMsg);
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 500);

    input.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;
  }
});
