export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const chatsDatabase = {
  1: {
    id: 1,
    title: "Capital de Francia",
    messages: [
      { type: "user", text: "¿Cuál es la capital de Francia?" },
      { type: "bot", text: "La capital de Francia es París, una de las ciudades más hermosas del mundo." },
      { type: "user", text: "¿Cuántos habitantes tiene?" },
      { type: "bot", text: "París tiene aproximadamente 2.1 millones de habitantes, y el área metropolitana tiene alrededor de 12 millones." },
    ],
  },
  2: {
    id: 2,
    title: "Programación",
    messages: [
      { type: "user", text: "Explícame qué es la programación" },
      { type: "bot", text: "La programación es el proceso de crear instrucciones que le indican a una computadora qué hacer." },
      { type: "user", text: "¿Qué lenguajes son los más populares?" },
      { type: "bot", text: "Los lenguajes más populares actualmente son: Python, JavaScript, Java, C++ y TypeScript." },
    ],
  },
  3: {
    id: 3,
    title: "Inteligencia Artificial",
    messages: [
      { type: "user", text: "¿Cómo funciona la inteligencia artificial?" },
      { type: "bot", text: "La IA funciona mediante algoritmos de aprendizaje que procesan datos y reconocen patrones." },
      { type: "user", text: "¿Qué aplicaciones tiene?" },
      { type: "bot", text: "La IA se usa en: reconocimiento de voz, visión por computadora, asistentes virtuales, conducción autónoma, medicina y muchas más." },
    ],
  },
};

export let currentChatId = null;
export let activeReadBtn = null;
export let nextChatId = Object.keys(chatsDatabase).length + 1;

export function setCurrentChatId(id) { currentChatId = id; }
export function setActiveReadBtn(btn) { activeReadBtn = btn; }
export function incrementNextChatId() { return nextChatId++; }
export function getCurrentChatId() { return currentChatId; }
export function getActiveReadBtn()  { return activeReadBtn;  }