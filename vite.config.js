import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project sites use /<repository-name>/. Update this value
// to match the repository name before deploying. Use '/' for a user site.
export default defineConfig({
  plugins: [react()],
  base: '/me/',
})
