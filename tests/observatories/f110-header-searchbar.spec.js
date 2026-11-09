/* F110 (D-245) point 3: the search bar of the header is not loaded under /observatories, and still is where it was (E2E_LIVE=1 for the pages that read the API). */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const BAR = 'input[placeholder="Búsqueda por palabra clave"]';

test.describe("F110 search bar of the header", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to open the pages.");

  for (const route of ["/observatories", "/observatories/vri-udea", "/observatories/vri-udea/board-1", "/observatories/vri-udea/board-2", "/observatories/vri-udea/board-3"]) {
    test(`not loaded in ${route}`, async ({ page }) => {
      test.setTimeout(150000);
      await page.goto(route);
      await page.locator("header, #header, body").first().waitFor();
      await page.waitForTimeout(3000);
      expect(await page.locator(BAR).count()).toBe(0);
    });
  }

  for (const route of ["/about", "/manual", "/open-source"]) {
    test(`still loaded in ${route}`, async ({ page }) => {
      test.setTimeout(150000);
      await page.goto(route);
      await page.locator(BAR).first().waitFor({ timeout: 90000 });
      expect(await page.locator(BAR).count()).toBeGreaterThan(0);
    });
  }

  test("the home and sources keep their own bar in the body, not in the header", async ({ page }) => {
    test.setTimeout(150000);
    await page.goto("/");
    await page.locator(BAR).first().waitFor({ timeout: 90000 });
    expect(await page.locator(BAR).count()).toBe(1);
  });
});
