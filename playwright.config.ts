import path from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
/** Pasta `frontend/` (onde vive este ficheiro). */
const frontendRoot = __dirname
const repoRoot = path.resolve(frontendRoot, '..')

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  timeout: 30000,
  webServer: [
    {
      command: `cd ${path.join(repoRoot, 'backend')} && uv run python manage.py runserver 8001`,
      url: 'http://localhost:8001/api/health/',
      reuseExistingServer: true,
      timeout: 20000,
    },
    {
      command: `cd ${frontendRoot} && npm run dev`,
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 20000,
    },
  ],
})
