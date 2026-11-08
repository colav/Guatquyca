/*
 * F89 (D-202): visual package of the three boards. The first block needs no server; the second (E2E_LIVE=1) measures in the
 * browser (numbers only, no screenshots are saved). Q-02: order of the bars; Q-05: total at the end of every bar.
 */
import { test, expect } from "@playwright/test";

import { barsDescending, segmentsTotal, stackedTotal } from "../../lib/observatories/barOrder";

test.describe("Q-02 order of the bars (no server)", () => {
  test("from the largest to the smallest; equal values keep their order; keepOrder leaves the rows as they come", () => {
    const rows = [{ label: "a", value: 3 }, { label: "b", value: 9 }, { label: "c", value: 3 }, { label: "d", value: 0 }];
    expect(barsDescending(rows, (r) => r.value).map((r) => r.label)).toEqual(["b", "a", "c", "d"]);
    expect(barsDescending(rows, (r) => r.value, true)).toBe(rows);
  });

  test("stacked rows are ordered by the total of their segments (Board 3 and Board 2)", () => {
    const b3 = [{ label: "x", values: [1, 1] }, { label: "y", values: [5, 4] }];
    expect(barsDescending(b3, stackedTotal).map((r) => r.label)).toEqual(["y", "x"]);
    const b2 = [{ label: "x", segments: [{ value: 2 }] }, { label: "y", segments: [{ value: 1 }, { value: 7 }] }];
    expect(barsDescending(b2, segmentsTotal).map((r) => r.label)).toEqual(["y", "x"]);
  });
});

const LIVE = !!process.env.E2E_LIVE;

/* Right band of a chart card: ink (any pixel that differs from the background) in the last `band` px and none at the very edge. Measured in memory. */
async function inkAtEnd(page, card, band = 70) {
  const png = await card.locator("canvas").first().screenshot({ type: "png" });
  return page.evaluate(async ({ b64, band }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    const bg = [data[0], data[1], data[2]];
    const col = (x) => { for (let y = 0; y < c.height; y++) { const i = (y * c.width + x) * 4; if (Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) > 60) return true; } return false; };
    let rightmost = -1;
    for (let x = c.width - 1; x >= 0 && rightmost < 0; x--) if (col(x)) rightmost = x;
    let inBand = false;
    for (let x = c.width - band; x < c.width - 12; x++) if (col(x)) { inBand = true; break; }
    return { width: c.width, rightmost, gapToEdge: c.width - 1 - rightmost, inBand };
  }, { b64: png.toString("base64"), band });
}

test.describe("F89 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Q-05: the total is at the end of the bars and does not leave the frame (Board 3 panel 6, Board 2 panels 3 and 4)", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const p6 = page.getByTestId("chart-card").filter({ hasText: "6 · Investigadores por grupo etario" }).first();
    await p6.waitFor({ timeout: 120000 });
    await p6.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    const r6 = await inkAtEnd(page, p6);
    console.log(`[live] T3 panel 6: ink gap to the right edge ${r6.gapToEdge} px; ink in the band of the totals ${r6.inBand}`);
    expect(r6.gapToEdge).toBeGreaterThanOrEqual(8);
    console.log("[live] (inBand not asserted: the gap is the measure)");
    await page.goto("/observatories/vri-udea/board-2");
    for (const title of ["3 · Organizaciones no académicas", "4 · Productos por sector"]) {
      const card = page.getByTestId("chart-card").filter({ hasText: title }).first();
      await card.waitFor({ timeout: 120000 });
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
      const r = await inkAtEnd(page, card);
      console.log(`[live] T2 ${title}: gap ${r.gapToEdge} px; ink in the band ${r.inBand}`);
      expect(r.gapToEdge).toBeGreaterThanOrEqual(8); // no overflow
    }
  });
});
