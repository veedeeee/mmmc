import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mekanism_multiblock_calculator.github.io/',
  plugins: [react()],
})
