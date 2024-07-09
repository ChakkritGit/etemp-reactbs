import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true
      },
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        swDest: 'dist/sw.js',
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024 // 100MB
      },
      workbox: {
        cleanupOutdatedCaches: false,
        sourcemap: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'eTEMP',
        short_name: 'eTEMP',
        icons: [
          {
            "src": "pwa-64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "maskable-icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        theme_color: '#fdfdfd',
        background_color: '#fdfdfd',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait'
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 100000, // Unit is in KB => 100MB
  },
  server: {
    port: 12345,
    strictPort: true,
    host: true,
    cors: true,
    fs: {
      strict: true,
      cachedChecks: true,
      deny: [
        '.env', '.env.*', '*.{crt,pem}', 'custom.secret'
      ]
    }
  },
  optimizeDeps: {
    exclude: ['fs']
  }
})
