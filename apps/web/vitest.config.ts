import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Configuration des tests front (Vitest + Testing Library, environnement jsdom).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    // Exécute les fichiers de test séquentiellement (un worker à la fois).
    // Évite les crashs intermittents du pool de forks Vitest sous Node 24 /
    // Windows ("Worker exited unexpectedly"). Suite courte → coût négligeable.
    fileParallelism: false,
  },
})
