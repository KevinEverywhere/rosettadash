import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

/** Dedicated ports so E2E never conflicts with `npm start` on 4200/3000. */
const e2eServerPort = process.env['E2E_SERVER_PORT'] ?? '3001';
const e2eClientPort = process.env['E2E_CLIENT_PORT'] ?? '4201';
const baseURL = process.env['BASE_URL'] ?? `http://localhost:${e2eClientPort}`;

export default defineConfig({
  ...nxE2EPreset(__dirname, { testDir: './src' }),
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `PORT=${e2eServerPort} HOST=127.0.0.1 npx nx serve-e2e server`,
      url: `http://localhost:${e2eServerPort}/api/health`,
      reuseExistingServer: false,
      cwd: workspaceRoot,
      timeout: 120_000,
    },
    {
      command: `npx nx serve-e2e client --port=${e2eClientPort}`,
      url: `http://localhost:${e2eClientPort}`,
      reuseExistingServer: false,
      cwd: workspaceRoot,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
