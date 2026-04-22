# Chatbot LLM — Interfaz Accesible IA

Interfaz de chat conversacional con IA, construida con **HTML, CSS y JavaScript modular**, impulsada por el modelo `llama-3.1-8b-instant` de **Groq** a través de su API. El proyecto hace especial énfasis en la **accesibilidad** (ARIA, navegación por teclado, anuncios para lectores de pantalla) y en una experiencia de usuario cuidada.

***

## 🚀 Cómo iniciar el proyecto

### 1. Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [npm](https://www.npmjs.com/)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_GROQ_API_KEY=api-key-groq
```

> Reemplaza `api-key-groq` con tu clave real obtenida desde [console.groq.com](https://console.groq.com).

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173` (o el puerto que indique Vite).

***

## 🗂️ Estructura del proyecto

```
├── index.html              # Entrada principal — estructura HTML y accesibilidad
├── .env                    # Variables de entorno (no subir al repositorio)
└── src/
    ├── js/
    │   ├── ui.js           # Lógica principal: envío de mensajes, menús, voz, opciones activas
    │   ├── messages.js     # Creación y renderizado de burbujas de chat y sus botones de acción
    │   ├── sidebar.js      # Gestión de la barra lateral y creación de nuevas conversaciones
    │   ├── api.js          # Comunicación con la API de Groq
    │   ├── db.js           # Base de datos en memoria para el historial de chats
    │   └── icons.js        # Inicialización de iconos Lucide
    └── css/
        ├── base.css        # Reset, tokens de diseño (colores, tipografía) y sistema de tooltips
        ├── sidebar.css     # Estilos de la barra lateral, perfil y modo colapsado
        ├── messages.css    # Estilos de burbujas de mensajes y botones de acción
        ├── input.css       # Área de entrada, botones de herramientas y chips de opciones activas
        └── header.css      # Cabecera principal
```

***

## 🔑 Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_GROQ_API_KEY` | Clave de API de Groq para el modelo de lenguaje |
