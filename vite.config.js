import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repoName = 'rettkie-zhizni'

// https://vite.dev/config/
// Use root base in dev, repo base in production builds (e.g., GitHub Pages)
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : `/${repoName}/`,
  plugins: [vue()],
}))
