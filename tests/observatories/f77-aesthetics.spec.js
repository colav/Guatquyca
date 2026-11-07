/*
 * F77 (D-182): shared pieces, treemaps with PALETTE, rings with the total at the centre, filter panel in three rows.
 * The first blocks need no server; the last one drives the three boards once (E2E_LIVE=1).
 */
import { test, expect } from "@playwright/test";

import { PALETTE } from "../../lib/constants";
import { BRAND, contrastRatio, paletteColor, textOn } from "../../lib/observatories/palette";

test.describe("treemap colours (no server)", () => {
  test("the colour comes from PALETTE by the stable position, never from the data", () => {
    for (let slot = 0; slot < 17; slot++) expect(paletteColor(slot)).toBe(PALETTE[slot]);
    // the ODS 7 is slot 6 whatever the filters hide
    expect(paletteColor(6)).toBe(PALETTE[6]);
  });

  test("the text reads on every fill the treemaps can have (4,5:1 at least)", () => {
    for (let slot = 0; slot < 17; slot++) {
      const bg = paletteColor(slot);
      const fg = textOn(bg);
      expect([BRAND.white, BRAND.text]).toContain(fg);
      expect(contrastRatio(fg, bg), `slot ${slot} ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

import { ringParts, ringPercent } from "../../lib/observatories/ringText";

test.describe("rings: total at the centre and percentages in the legend (no server)", () => {
  test("percentage without decimals and «< 1 %» for a part that would give 0", () => {
    expect(ringPercent(95, 100)).toBe("95 %");
    expect(ringPercent(1, 1000)).toBe("< 1 %");
    expect(ringPercent(4, 1000)).toBe("< 1 %");
    expect(ringPercent(5, 1000)).toBe("1 %"); // 0,5 rounds to 1
    expect(ringPercent(0, 1000)).toBe("0 %");
  });

  test("the total is the sum of the parts drawn, with thousands of es-CO; parts with value zero are not listed", () => {
    const r = ringParts(["Artículo", "Libro", "Capítulo"], [39569, 0, 2084], ["#a", "#b", "#c"]);
    expect(r.total).toBe(41653);
    expect(r.totalText).toBe((41653).toLocaleString("es-CO"));
    expect(r.parts.map((p) => p.name)).toEqual(["Artículo", "Capítulo"]);
    expect(r.parts.map((p) => p.percent)).toEqual(["95 %", "5 %"]);
    // another total after a filter
    expect(ringParts(["A", "B"], [10, 30], ["#a", "#b"]).total).toBe(40);
    // only tiny parts: «< 1 %»
    expect(ringParts(["A", "B"], [1, 9999], ["#a", "#b"]).parts.map((p) => p.percent)).toEqual(["< 1 %", "100 %"]);
  });
});

const LIVE = !!process.env.E2E_LIVE;
test.describe("rings in the three boards (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("T1 panel 7: total at the centre equal to the products, legend with percentages; the total changes with a filter", async ({ page }) => {
    test.setTimeout(240000);
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(3000);
    const totals = page.getByTestId("ring-total");
    await totals.first().scrollIntoViewIfNeeded();
    await expect(totals).toHaveCount(3);
    const first = (await totals.first().innerText()).trim();
    const legend = page.getByTestId("ring-legend").first();
    const lines = (await legend.locator("li").allInnerTexts()).map((t) => t.replace(/\s+/g, " ").trim());
    console.log(`[live] T1 ring 1: total ${first}; legend ${lines.join(" | ")}`);
    expect(first).toMatch(/^[\d.]+$/);
    for (const l of lines) expect(l).toMatch(/(\d+|< 1) %$/);
    // the products of the board: same number as the first KPI
    await expect(page.locator(".obs-kpi").first()).toContainText(first);
    // a filter changes the total
    await page.goto("/observatories/vri-udea/board-1?from=2020&to=2022");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(3000);
    const second = (await page.getByTestId("ring-total").first().innerText()).trim();
    console.log(`[live] T1 ring 1 with 2020-2022: total ${second}`);
    expect(second).not.toBe(first);
    await expect(page.locator(".obs-kpi").first()).toContainText(second);
  });

  test("T2 and T3 rings show a total and a legend", async ({ page }) => {
    test.setTimeout(240000);
    for (const board of [2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.getByTestId("ring-legend").first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(2500);
      const n = await page.getByTestId("ring-total").count();
      const t = (await page.getByTestId("ring-total").first().innerText()).trim();
      console.log(`[live] T${board}: ${n} rings, first total ${t}`);
      expect(n).toBeGreaterThan(0);
      expect(t).toMatch(/^[\d.]+$/);
    }
  });
});
