import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Thay đổi port ở đây
  },
  css: {
    postcss: {
      plugins: [tailwind],
    },
  },
})

