import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const repositoryName =
  process.env.GITHUB_ACTIONS === 'true'
    ? process.env.GITHUB_REPOSITORY?.split('/')[1]
    : undefined

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: repositoryName ? `/${repositoryName}/` : '/',
})
