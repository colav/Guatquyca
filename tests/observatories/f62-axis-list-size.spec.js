/*
 * F62 (D-165): the open list of the filter «Eje Temático» of Board 2 has the width and the height of the one of Board 1 (at
 * 1.440 and 1.280 px), inside the window, with the long names in two lines (not cut). The list of «Documento de política» is
 * measured in both boards and reported. Only runs with E2E_LIVE=1 (one run). No screenshots.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

const measure = async (page, selector) => {
  await selector.click();
  await page.waitForTimeout(500);
  const d = page.locator(".ant-select-dropdown:visible").first();
  const b = await d.boundingBox();
  const holder = await d.locator(".rc-virtual-list-holder").first().boundingBox();
  const cut = await d.locator(".ant-select-item-option-content").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  return { x: Math.round(b.x), w: Math.round(b.width), h: Math.round(b.height), holder: Math.round(holder.height), cut };
};

test.describe("size of the open lists (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  for (const width of [1440, 1280]) {
    test(`T1 and T2 at ${width} px`, async ({ page }) => {
      test.setTimeout(200000);
      await page.setViewportSize({ width, height: 900 });
      const field = (label) => page.getByTestId("filters").locator("label", { hasText: label }).locator("xpath=../..").locator(".ant-select-selector").first();
      await page.goto("/observatories/vri-udea/board-1");
      await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(800);
      const t1 = await measure(page, page.getByTestId("filters").locator(".ant-select").filter({ has: page.locator("input[aria-label='Eje Temático']") }).locator(".ant-select-selector"));
      const t1doc = await measure(page, field("Documento de política"));
      await page.goto("/observatories/vri-udea/board-2");
      await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
      const t2 = await measure(page, page.getByTestId("axis-filter").locator(".ant-select-selector"));
      const t2doc = await measure(page, field("Documento de política"));
      console.log(`[live] ${width}: T1 eje ${JSON.stringify(t1)} | T2 eje ${JSON.stringify(t2)} | T1 doc ${JSON.stringify(t1doc)} | T2 doc ${JSON.stringify(t2doc)}`);
      expect(t2.w).toBe(t1.w);
      expect(t2.holder).toBe(t1.holder);
      expect(t2.x).toBeGreaterThanOrEqual(0);
      expect(t2.x + t2.w).toBeLessThanOrEqual(width);
      expect(t2.cut).toBe(0); // long names in two lines, none cut
      expect(t2doc.w).toBe(t1doc.w);
      expect(t2doc.holder).toBe(t1doc.holder);
    });
  }
});
