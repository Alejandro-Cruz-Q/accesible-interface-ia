import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,  // puerto del servidor local
    open: true,  // abre el navegador automáticamente al hacer npm run dev
  },
  build: {
    outDir: 'dist',  // carpeta donde se genera el build de producción
  },
})