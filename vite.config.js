import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const djangoOutDir = path.resolve(
  __dirname,
  '..',
  '..',
  'rettkie-zhizni_back',
  'frontend_dist',
  'spa'
);

// https://vite.dev/config/
// Modes:
// - dev server: base "/" (proxy /api -> Django)
// - build --mode django: assets under /static/spa/, output into backend/frontend_dist/spa
// - other builds: base "/" (can be overridden via VITE_BASE)
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const isDjango = mode === 'django';
  const base = process.env.VITE_BASE ?? (isDjango ? '/static/spa/' : '/');

  return {
    base,
    plugins: [vue()],
    build: {
      outDir: isDjango ? djangoOutDir : 'dist',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
