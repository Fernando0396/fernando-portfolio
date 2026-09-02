import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repositoryName =
  process.env.GITHUB_ACTIONS === 'true'
    ? process.env.GITHUB_REPOSITORY?.split('/')[1]
    : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: repositoryName ? `/${repositoryName}/` : '/',
})
