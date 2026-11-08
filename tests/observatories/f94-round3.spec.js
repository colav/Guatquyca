/*
 * F94 (D-211, Round 3): Q-30 (tile of the panel 7), Q-32 (15 px of the donut legend), Q-34 (typeface of the KPI row), note of
 * amounts (Q-28 iv) and Q-33 (graph D). The first blocks need no server; the ones with E2E_LIVE=1 measure the pages in one run.
 * Screenshots are only saved by f92-graph-capture.spec.js (graph D, exception of D-206).
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

test.describe("F94 Q-30 panel 7 of Board 2 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("no tile of social appropriation, five tiles with the same height per row, and the note of the panel does not name it", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    const card = page.getByTestId("chart-card").filter({ hasText: "7 · Colaboraciones de cuádruple hélice" }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2000);
    const text = await card.innerText();
    const tiles = await card.locator(".obs-tile").evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) }; }));
    const free = await card.evaluate((c) => { const b = c.querySelector(".ant-card-body"); return Math.round(b.clientHeight - 20 - [...b.children].reduce((a, el) => a + el.getBoundingClientRect().height, 0)); });
    console.log(`[live] panel 7: ${tiles.length} tiles ${JSON.stringify(tiles)}; free space ${free} px`);
    expect(text).not.toMatch(/Apropiación social con empresa|apropiación social con empresa|sin dato en la fuente|Apropiación social: productos/);
    expect(tiles).toHaveLength(5);
    const rows = [...new Set(tiles.map((t) => t.top))];
    expect(rows).toHaveLength(2);
    for (const top of rows) expect(new Set(tiles.filter((t) => t.top === top).map((t) => t.h)).size).toBe(1);
    expect(tiles.filter((t) => t.top === rows[0])).toHaveLength(2);
    expect(tiles.filter((t) => t.top === rows[1])).toHaveLength(3);
  });
});

test.describe("F94 Q-32 legend of the donut 15 px from the edge (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 2 panel 4 at 1440 and 1280 px: 15 px between the legend and the right border of the panel, and the ring does not shrink", async ({ page }) => {
    test.setTimeout(200000);
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-2");
      const card = page.getByTestId("chart-card").filter({ hasText: "4 ·" }).filter({ has: page.getByTestId("ring-legend") }).first();
      await card.waitFor({ timeout: 120000 });
      await page.waitForTimeout(2500);
      const m = await card.evaluate((c) => {
        const l = c.querySelector('[data-testid="ring-legend"]').getBoundingClientRect();
        const cv = c.querySelector("canvas").getBoundingClientRect();
        const border = c.getBoundingClientRect();
        return { gap: Math.round((border.right - l.right) * 10) / 10, diameter: Math.round(Math.min(cv.width, cv.height)), legendRight: c.querySelector('[data-testid="ring-root"]').dataset.legend };
      });
      console.log(`[live] ${width} px: legend ${m.legendRight}; ${m.gap} px from the right border of the panel; ring ${m.diameter} px (before: ${width === 1440 ? 320 : 320})`);
      expect(m.legendRight).toBe("right");
      expect(Math.abs(m.gap - 15)).toBeLessThanOrEqual(0.6);
      expect(m.diameter).toBeGreaterThanOrEqual(320);
    }
  });
});
