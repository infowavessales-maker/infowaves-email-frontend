import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://infowaves.co.in/karthi/info-Email/
export default defineConfig({
  base: '/karthi/info-Email/',
  plugins: [react(), tailwindcss()],
})
