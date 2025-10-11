import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const repoName = 'rettkie-zhizni';

// https://vite.dev/config/
// Use root base in dev, repo base in production builds (e.g., GitHub Pages)
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : `/${repoName}/`,
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
}));
