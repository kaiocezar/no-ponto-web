import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  timeout: 30000,
  webServer: [
    {
      command: 'cd /home/mule/kaio/pontual/backend && uv run python manage.py runserver 8001',
      url: 'http://localhost:8001/api/health/',
      reuseExistingServer: true,
      timeout: 20000,
    },
    {
      command: 'cd /home/mule/kaio/pontual/frontend && npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 20000,
    },
  ],
})
