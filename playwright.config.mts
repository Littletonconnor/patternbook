import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.ts",
  forbidOnly: true,
  retries: 0,
  fullyParallel: true,
  reporter: process.env.CI === undefined ? "list" : "github",
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start --port ${port}`,
    port,
    reuseExistingServer: process.env.CI === undefined,
    timeout: 300_000,
  },
});
