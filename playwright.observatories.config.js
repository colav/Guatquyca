// @ts-check
const { defineConfig } = require("@playwright/test");

/**
 * Configuration of the observatories tests. It does not touch playwright.config.js and never
 * starts a server: the unit tests need none and the page tests use the dev server that is
 * already running on localhost:3000 (D-100).
 */
module.exports = defineConfig({
  testDir: "./tests/observatories",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  timeout: 120 * 1000,
  expect: { timeout: 10 * 1000 },
  use: { baseURL: "http://localhost:3000", trace: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: undefined,
});
