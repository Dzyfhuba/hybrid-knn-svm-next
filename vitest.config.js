import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())
export default defineConfig(({mode}) => ({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    env: loadEnv(mode, process.cwd()),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}))
