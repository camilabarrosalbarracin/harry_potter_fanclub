import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite doesn't expose process.env to client code by default (that's what
  // import.meta.env is for). This statically replaces the reference below
  // with the .env value at build time, so analytics.ts can read it via
  // process.env like a Node-style env var.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'process.env.VITE_AMPLITUDE_TRACKING_ENABLED': JSON.stringify(
        env.VITE_AMPLITUDE_TRACKING_ENABLED ?? 'true'
      ),
    },
  }
})
