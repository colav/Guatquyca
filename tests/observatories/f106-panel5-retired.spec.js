/*
 * F106 (D-234) point 1: the panel 5 of the Board 1 (ranking of ODS) is retired; the panel 7 (treemap) keeps the choice of an ODS, its note and
 * the coverage note; the panels 3 and 4 fill the row. Needs E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

test.describe("F106 panel 5 retired (live)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real servers.");

  for (const width of [1440, 1280, 768]) {
    test(`at ${width} px the panels are numbered 1 to 9 without «Ránking ODS», and the panels 3 and 4 fill their row`, async ({ page }) => {
      test.setTimeout(150000);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-1");
      await page.getByTestId("category-legend").waitFor({ timeout: 120000 });
      await page.waitForTimeout(3000);
      const titles = await page.locator('[data-testid="chart-card"] .ant-card-head-title').evaluateAll((els) => els.map((e) => e.innerText.split("\n")[0].trim()));
      const numbers = titles.map((t) => Number((/^(\d+) ·/.exec(t) || [])[1])).filter(Boolean);
      expect(numbers, titles.join(" | ")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(await page.locator("body").innerText()).not.toContain("Ránking ODS");
      expect(await page.getByTestId("ranking-selectable").count()).toBe(0);
      const box = async (n) => page.getByTestId("chart-card").filter({ hasText: new RegExp(`^${n} ·`) }).first().evaluate((el) => { const r = el.closest(".ant-col").getBoundingClientRect(); const row = el.closest(".ant-row").getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, rowLeft: row.left, rowRight: row.right }; });
      const p3 = await box(3);
      const p4 = await box(4);
      console.log(`[live] ${width}: p3 ${Math.round(p3.left)}-${Math.round(p3.right)} top ${Math.round(p3.top)}; p4 ${Math.round(p4.left)}-${Math.round(p4.right)} top ${Math.round(p4.top)}`);
      expect(Math.abs(p3.left - p3.rowLeft)).toBeLessThanOrEqual(8);
      expect(Math.abs(p4.right - p4.rowRight)).toBeLessThanOrEqual(8);
      expect(Math.abs(p3.top - p4.top)).toBeLessThanOrEqual(1);
      expect(Math.abs(p3.right - p4.left)).toBeLessThanOrEqual(16);
    });
  }

  test("the panel 7 keeps the choice of an ODS: the note of the choice and the coverage note", async ({ page }) => {
    test.setTimeout(150000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-1?ods=3");
    await page.getByTestId("category-legend").waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const card = page.getByTestId("chart-card").filter({ hasText: /^7 · Producción por ODS/ }).first();
    await expect(card.getByTestId("ods-selected-note")).toBeVisible();
    await expect(card).toContainText("Cobertura parcial");
    await expect(card.getByTestId("ods-treemap")).toBeVisible();
  });
});
