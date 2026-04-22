import { chatsDatabase } from "./db.js";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function askAI(chatId) {
  const messages = chatsDatabase[chatId].messages.map((msg) => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
      }),
    },
  );

  if (!response.ok) throw new Error(`Error API: ${response.status}`);

  const data = await response.json();
  return data.choices[0].message.content;
}
