import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './', // Essential for GitHub Pages relative asset paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Built-in high-performance minification
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        narrative: resolve(__dirname, 'narrative.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
