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
