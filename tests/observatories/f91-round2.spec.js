/*
 * F91 (D-208, Round 2): Q-26 donuts with the legend at the right. The first block needs no server; the second (E2E_LIVE=1)
 * measures the pages in one run. No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

/* Per donut: the box of the ring (the canvas), the legend, and whether the legend is at its right. */
const DONUTS_IN_PAGE = () =>
  [...document.querySelectorAll('[data-testid="ring-legend"]')].map((legend) => {
    const root = legend.closest('[data-testid="ring-root"]') || legend.parentElement;
    const canvas = root.querySelector("canvas");
    const c = canvas.getBoundingClientRect();
    const l = legend.getBoundingClientRect();
    return {
      diameter: Math.round(Math.min(c.width, c.height)),
      right: l.left >= c.right - 4 && l.top < c.bottom,
      below: l.top >= c.bottom - 4,
      cut: [...legend.querySelectorAll("li > span:nth-child(2)")].filter((s) => s.scrollWidth > s.clientWidth + 1 || s.scrollHeight > s.clientHeight + 1).length,
      items: legend.querySelectorAll("li").length,
    };
  });

test.describe("F91 Q-26 donuts, legend at the right (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("diameter of every ring and where its legend sits, at 1440 and 1280 px", async ({ page }) => {
    test.setTimeout(280000);
    const out = {};
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const board of [1, 2, 3]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("ring-legend").first().waitFor({ timeout: 120000 });
        await page.waitForTimeout(2500);
        out[`${width}-T${board}`] = await page.evaluate(DONUTS_IN_PAGE);
      }
    }
    console.log(`[live] ${JSON.stringify(out)}`);
    {
      for (const [k, list] of Object.entries(out)) {
        for (const d of list) expect(d.cut, `${k} legend cut`).toBe(0);
      }
      expect(out["1440-T2"].every((d) => d.right) && out["1280-T2"].every((d) => d.right), "T2 donut: legend at the right").toBe(true);
      expect(out["1440-T1"].every((d) => d.below && d.diameter >= 200), "T1: the columns are narrow, the legend stays below and the ring keeps 200 px").toBe(true);
    }
  });
});
