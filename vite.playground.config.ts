import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import wasm from 'vite-plugin-wasm'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    target: 'esnext',
  },
  plugins: [
    mkcert(),
    wasm(),
  ],
  worker: {
    format: "es",
    plugins: [
      wasm(),
    ]
  },
  publicDir: 'assets',
  server: {
    fs: {
      allow: ['.'],
      strict: true,
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    port: 5173,
    strictPort: true,
  },
  define,
})
