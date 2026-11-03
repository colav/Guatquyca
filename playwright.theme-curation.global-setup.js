// Global setup of playwright.theme-curation.config.js: warms up the dev server.
//
// Next compiles each route the first time it is requested in development,
// which can take several seconds and made the first tests of a run time out.
// This visits each route of the feature once, before the tests, with up to
// 120 s each, against the server Luis keeps running on localhost:3000
// (01 D-100). It only sends GET requests (the pages and, from the browser, the
// reads they make: the theme list, and the detail of an id that does not
// exist) and it neither starts nor stops anything. The time of each first
// visit is printed.
const { chromium } = require("@playwright/test");

const BASE_URL = "http://localhost:3000";
const WARMUP_TIMEOUT_MS = 120000;

// The detail page takes any id; this one does not exist, so the page shows its
// "not found" state, which is enough for Next to compile the route.
const ROUTES = [
  "/theme-curation",
  "/theme-curation/new",
  "/theme-curation/warmup-any-id",
];

module.exports = async function globalSetup() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const route of ROUTES) {
      const startedAt = Date.now();
      let outcome;
      try {
        const response = await page.goto(`${BASE_URL}${route}`, {
          timeout: WARMUP_TIMEOUT_MS,
          waitUntil: "load",
        });
        outcome = response ? String(response.status()) : "no response";
      } catch (error) {
        const reason = error.message.split("\n")[0];
        if (/ERR_CONNECTION_REFUSED/.test(reason)) {
          throw new Error(
            `Nothing listens on ${BASE_URL}: ask Luis to start \`npm run dev\` (01 D-100). ${reason}`,
          );
        }
        outcome = `failed (${reason})`;
      }
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      console.log(`[warm-up] ${route} -> ${outcome} in ${seconds} s`);
    }
  } finally {
    await browser.close();
  }
};
