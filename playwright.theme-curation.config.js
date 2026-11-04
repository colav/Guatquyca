// Playwright config for the Theme Curation feature tests (tests/e2e/theme-curation-*).
//
// Always run with it: npx playwright test e2e/theme-curation-<screen>.spec.js \
//   -c playwright.theme-curation.config.js --project=chromium --workers=1
//
// It reuses playwright.config.js and changes three things (01 D-100):
// - No webServer: it never starts a server. The dev server on localhost:3000
//   (`npm run dev`) belongs to Luis; if nothing listens there, the warm-up
//   fails at once with a clear message.
// - A global setup that visits each route of the feature once, so Next
//   compiles them before the tests (see the file for the details).
// - navigationTimeout of 60 s, because the first visit of a route in
//   development can be slow.
const base = require("./playwright.config.js");

module.exports = {
  ...base,
  webServer: undefined,
  globalSetup: require.resolve("./playwright.theme-curation.global-setup.js"),
  use: {
    ...base.use,
    navigationTimeout: 60000,
  },
};
