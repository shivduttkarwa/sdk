import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// The shipped artifact must be behavior-identical to the original static site.
// - base: './'  -> bundle URLs stay relative (works at domain root or a subpath).
// - assetsDir: 'bundle' -> hashed JS/CSS land in dist/bundle/ so they never collide
//   with the verbatim media tree copied from public/assets/ (e.g. assets/images/2.jpg).
// - outDir: 'docs' -> GitHub Pages can serve from /docs, keeping the existing deploy.bat.
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'docs',
    assetsDir: 'bundle',
    emptyOutDir: true,
  },
});
