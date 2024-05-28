import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    chunkSizeWarningLimit: 5000, // Unit is in KB
  },
  server: {
    port: 12345,
    strictPort: true,
    host: true,
    fs: {
      deny: [
        '.env', '.env.*', '*.{crt,pem}', 'custom.secret'
      ]
    }
  },
  optimizeDeps: {
    exclude: ['fs']
  }
})
