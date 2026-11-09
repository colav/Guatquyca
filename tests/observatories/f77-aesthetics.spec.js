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
      expect(t).toMatch(/^[\d.,]+( %)?$/);
    }
  });
});

test.describe("filter panel: height by width (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  for (const board of [1, 2, 3]) {
    test(`T${board}: height of the panel at 1920, 1440 and 1280 px`, async ({ page }) => {
      test.setTimeout(240000);
      const out = [];
      for (const width of [1920, 1440, 1280]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("filters").waitFor({ timeout: 120000 });
        await page.waitForTimeout(2500);
        const box = await page.getByTestId("filters").boundingBox();
        // the fields in rows: distinct tops of the controls
        const tops = await page.getByTestId("filters").locator("label").evaluateAll((els) => [...new Set(els.map((e) => Math.round(e.getBoundingClientRect().top)))]);
        const rows = await page.getByTestId("filter-row").count();
        expect(rows, "rows").toBe(board === 1 ? 3 : 2);
        // nothing cut: each label on one line and the text of the switches inside its box
        const labels = await page.getByTestId("filters").locator("label").evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().height > 20).map((e) => e.textContent));
        const clipped = await page.getByTestId("filters").locator(".ant-segmented-item-label").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent));
        expect(labels, "labels in two lines").toEqual([]);
        expect(clipped, "switch text cut").toEqual([]);
        const cols = await page.getByTestId("filter-row").first().evaluate((el) => [...el.children].map((c) => Math.round(c.getBoundingClientRect().width)));
        out.push(`${width}px: ${Math.round(box.height)} px, ${rows} rows, columns ${cols.join("/")}`);
      }
      console.log(`[live] T${board} panel ${out.join(" | ")}`);
    });
  }
});

test.describe("lists wider than the selector (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("T1: the ODS, the tree and the axes open wider than their selector", async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const out = [];
    for (const [name, sel] of [["ods", page.getByTestId("ods-filter")], ["tree", page.getByTestId("topic-filter")], ["document", page.getByTestId("filter-policyDoc")]]) {
      const w = (await sel.boundingBox()).width;
      await sel.locator(".ant-select-selector").click();
      await page.waitForTimeout(700);
      const pop = await page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden), .ant-tree-select-dropdown:not(.ant-select-dropdown-hidden)").last().boundingBox();
      out.push(`${name}: selector ${Math.round(w)} px, list ${Math.round(pop.width)} px`);
      expect(pop.width, name).toBeGreaterThanOrEqual(w - 1);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }
    console.log(`[live] ${out.join(" | ")}`);
  });
});

test.describe("treemaps use the whole palette (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("T1 and T3: the blocks are drawn with several colours of PALETTE, not with one", async ({ page }) => {
    test.setTimeout(240000);
    const colours = async (testId, url) => {
      await page.goto(url);
      const box = page.getByTestId(testId);
      await box.waitFor({ timeout: 120000 });
      await box.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(2500);
      const b = await box.locator("canvas").first().boundingBox();
      // sample the canvas on a grid: the colours that appear (the white of the borders and the text are ignored)
      return box.locator("canvas").first().evaluate((c) => {
        const ctx = c.getContext("2d");
        const seen = new Map();
        for (let i = 1; i < 24; i++) for (let j = 1; j < 12; j++) {
          const d = ctx.getImageData(Math.floor((c.width * i) / 24), Math.floor((c.height * j) / 12), 1, 1).data;
          const hex = "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
          seen.set(hex, (seen.get(hex) || 0) + 1);
        }
        return [...seen.entries()].filter(([h]) => h !== "#ffffff" && h !== "#000000");
      });
    };
    for (const [name, id, url] of [["T1 ODS", "ods-treemap", "/observatories/vri-udea/board-1"], ["T3 areas", "areas-treemap", "/observatories/vri-udea/board-3"]]) {
      const seen = await colours(id, url);
      const palette = new Set(PALETTE.map((c) => c.toLowerCase()));
      const fromPalette = seen.filter(([h]) => palette.has(h));
      console.log(`[live] ${name}: ${seen.length} colours drawn, ${fromPalette.length} of them in PALETTE`);
      expect(fromPalette.length, name).toBeGreaterThanOrEqual(3);
    }
  });
});

test.describe("F77b: phrases of the panel as help and nothing under the last row (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  for (const board of [1, 2, 3]) {
    test(`T${board}: the phrase of the lists is in the «?» of the panel, no text under the filters, tooltips over controls gone`, async ({ page }) => {
      test.setTimeout(240000);
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.getByTestId("filters").waitFor({ timeout: 120000 });
      await page.waitForTimeout(2500);
      const body = page.getByTestId("filters-body");
      // nothing under the last row: the panel body is the rows and nothing else
      const texts = await body.locator("> *").evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
      expect(texts).toHaveLength(1);
      expect(await body.locator("[data-testid=filter-rows]").count()).toBe(1);
      expect((await body.innerText()).includes("Las listas muestran")).toBe(false);
      await page.getByRole("button", { name: "Ayuda del filtro del panel" }).hover();
      await expect(page.getByTestId("options-note")).toContainText("Las listas muestran solo las opciones con productos");
      await page.mouse.move(0, 0);
      // no Tooltip wraps a control: hovering the centre selector opens none
      await page.getByTestId("filter-centerIndex").hover();
      await page.waitForTimeout(900);
      await expect(page.locator(".ant-tooltip:not(.ant-tooltip-hidden)")).toHaveCount(0);
    });
  }
});
