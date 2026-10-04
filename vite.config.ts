import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubUserSite = repositoryName?.endsWith('.github.io') ?? false
const base =
  process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isGitHubUserSite
    ? `/${repositoryName}/`
    : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
