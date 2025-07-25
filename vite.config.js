import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const repoName = 'rettkie-zhizni';

// https://vite.dev/config/
export default defineConfig({
  base: `/${repoName}`,
  plugins: [vue()],
});
