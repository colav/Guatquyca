/*
 * F106 (D-234) point 3: «ScienTI» is the form of the name in every visible text of the three boards (identifiers, keys and ids of the bundles
 * keep their form). Needs E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

test.describe("F106 ScienTI (live)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real servers.");
  for (const board of [1, 2, 3]) {
    test(`T${board}: no visible text says SCIENTI or Scienti, and the windows (i) neither`, async ({ page }) => {
      test.setTimeout(150000);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.locator('[data-testid="chart-card"]').first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(3000);
      const bad = /\bSCIENTI\b|\bScienti\b/;
      expect(await page.locator("body").innerText()).not.toMatch(bad);
      const buttons = page.getByTestId("panel-info");
      const n = await buttons.count();
      for (let i = 0; i < n; i++) {
        await buttons.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
        await buttons.nth(i).click();
        expect(await page.getByTestId("panel-info-content").last().innerText(), `window ${i}`).not.toMatch(bad);
        await page.keyboard.press("Escape");
      }
    });
  }
});
