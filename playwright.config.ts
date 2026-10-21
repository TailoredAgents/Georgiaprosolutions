import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";
const qa = JSON.parse(readFileSync("qa/runtime.json", "utf8"));
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:43188",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run start -- --port 43188",
      url: "http://localhost:43188",
      reuseExistingServer: false,
      timeout: 60000,
      env: {
        NEXT_DIST_DIR: ".next-qa-preview",
        SITE_MODE: "preview",
        SITE_URL: "http://localhost:43188",
        ADMIN_EMAIL: qa.email,
        ADMIN_PASSWORD_HASH: qa.hash,
        SESSION_SECRET: qa.secret,
        NEXT_PUBLIC_ANALYTICS_ENABLED: "false",
        ANALYTICS_ENABLED: "false",
      },
    },
    {
      command: "npm run start -- --port 43189",
      url: "http://localhost:43189",
      reuseExistingServer: false,
      timeout: 60000,
      env: {
        NEXT_DIST_DIR: ".next-qa-live",
        SITE_MODE: "production",
        SITE_URL: "http://localhost:43189",
        ADMIN_EMAIL: qa.email,
        ADMIN_PASSWORD_HASH: qa.hash,
        SESSION_SECRET: qa.secret,
        DATABASE_URL: qa.databaseUrl,
        DATABASE_SSL: "false",
        NEXT_PUBLIC_ANALYTICS_ENABLED: "true",
        ANALYTICS_ENABLED: "true",
        ALLOW_INDEXING: "false",
      },
    },
  ],
});
