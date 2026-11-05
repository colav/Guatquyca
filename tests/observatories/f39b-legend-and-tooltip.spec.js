/*
 * F39b: the legend of the panel 1 says «811 de 2.095» for «sin producción» (points drawn over units of
 * the panel 2), a note at the foot says how many are not drawn, and the tooltip of the scatter is wide
 * enough for its longest lines. The first block needs no server; the second reads the real quyca and
 * the dev server of Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { undrawnNote, undrawnTooltip } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { WIDE_TOOLTIP, tooltipInteraction } from "../../lib/observatories/tooltipStyle";

test.describe("texts and style (no server)", () => {
  test("the tooltip of the legend and the note at the foot are built from the figures", () => {
    expect(undrawnTooltip({ drawn: 811, total: 2095, noun: "tópicos" })).toBe(
      "811 tópicos con producción antes de 2021 aparecen en la gráfica; otros 1.284 no tienen ninguna producción en el rango y no se dibujan",
    );
    expect(undrawnNote({ count: 1284, noun: "tópicos" })).toBe("Los tópicos sin ninguna producción en el rango no se dibujan (1.284)");
    expect(undrawnNote({ count: 12, noun: "subcampos" })).toContain("subcampos");
  });

  test("the tooltip is 460 to 560 px wide, a long value goes on a second line and nothing is cut with an ellipsis", () => {
    const css = tooltipInteraction(WIDE_TOOLTIP).tooltip.css;
    expect(css[".g2-tooltip"]).toEqual({ "min-width": "460px", "max-width": "560px" });
    expect(css[".g2-tooltip-list-item"]["flex-wrap"]).toBe("wrap");
    expect(css[".g2-tooltip-list-item-value"]["text-align"]).toBe("right");
    expect(css[".g2-tooltip-list-item-value"]["text-overflow"]).toBe("clip");
    expect(css[".g2-tooltip-list-item-name-label"]["text-overflow"]).toBe("clip");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const PAGE = (query = "") => `/observatories/vri-udea/board-1${query ? `?${query}` : ""}`;
const fmt = (n) => n.toLocaleString("es-CO");

async function figures(page) {
  return page.getByTestId("category-legend").locator("button[data-category]").evaluateAll((nodes) =>
    Object.fromEntries(nodes.map((n) => [n.dataset.category, { drawn: +n.dataset.count, text: n.innerText.replace(/\s+/g, " ").trim() }])),
  );
}

test.describe("legend «811 de 2.095» and wide tooltip (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let raw;
  test.beforeAll(async () => {
    raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
  });

  for (const [name, query, filters] of [
    ["without filters", "", {}],
    ["with years 2015 to 2022", "from=2015&to=2022", { yearFrom: 2015, yearTo: 2022 }],
  ]) {
    test(`the legend and the note agree with the panel 2 ${name}`, async ({ page }) => {
      const result = computeCapacity(createDataset(raw), filters);
      const drawn = result.units.filter((u) => u.products > 0);
      const none = drawn.filter((u) => u.category === "none").length;
      const noneTotal = result.categoryCounts.none;
      // With a range of years other categories can also have units without production in it.
      const undrawn = result.units.length - drawn.length;
      await page.goto(PAGE(query));
      await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1500);
      const legend = await figures(page);
      expect(Object.values(legend).reduce((a, e) => a + e.drawn, 0)).toBe(drawn.length);
      expect(legend.none.drawn).toBe(none);
      if (noneTotal > none) expect(legend.none.text).toContain(`${fmt(none)} de ${fmt(noneTotal)}`);
      if (undrawn > 0) await expect(page.getByTestId("undrawn-note")).toHaveText(`Los tópicos sin ninguna producción en el rango no se dibujan (${fmt(undrawn)})`);
      // Without a range of years the other six categories coincide with the panel 2: no «N de M».
      if (!query) {
        for (const [category, entry] of Object.entries(legend)) {
          if (category !== "none") expect(entry.text, category).not.toMatch(/d de d/);
        }
      }
      await expect(page.getByText(`${fmt(drawn.length)} puntos con producción`).first()).toBeVisible();
    });
  }

  test("the legend and the note follow the unit filter", async ({ page }) => {
    const dataset = createDataset(raw);
    const fact = raw.facts.find((f) => f[6].length);
    const unit = fact[6][0];
    const result = computeCapacity(dataset, { facultyIndex: unit });
    const drawn = result.units.filter((u) => u.products > 0);
    const none = drawn.filter((u) => u.category === "none").length;
    await page.goto(PAGE(`faculty=${unit}`));
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1500);
    const legend = await figures(page);
    expect(legend.none.drawn).toBe(none);
    expect(Object.values(legend).reduce((a, e) => a + e.drawn, 0)).toBe(drawn.length);
    if (result.categoryCounts.none > none) expect(legend.none.text).toContain(`${fmt(none)} de ${fmt(result.categoryCounts.none)}`);
  });

  test("hovering «sin producción» explains the two figures", async ({ page }) => {
    await page.goto(PAGE());
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.locator('button[data-category="none"]').hover();
    await expect(page.getByText(/tópicos con producción antes de 2021 aparecen en la gráfica; otros [\d.]+ no tienen ninguna producción en el rango y no se dibujan/)).toBeVisible({ timeout: 5000 });
  });

  for (const width of [1280, 768]) {
    for (const side of ["middle", "right"]) {
      test(`at ${width}px the tooltip (${side}) is 460 to 560 px wide, is not cut and stays inside the window`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(PAGE());
        await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(3000);
        const card = page.getByTestId("chart-card").first();
        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();
        const from = side === "right" ? box.x + box.width - 140 : box.x + 120;
        const to = side === "right" ? box.x + box.width - 20 : box.x + box.width * 0.6;
        let report = null;
        for (let y = box.y + 220; y < box.y + box.height - 140 && !report; y += 10) {
          for (let x = from; x < to && !report; x += 8) {
            await page.mouse.move(x, y);
            const tip = page.locator(".g2-tooltip:visible").first();
            if ((await tip.count()) && /Categoría/.test((await tip.innerText().catch(() => "")) || "")) {
              await page.waitForTimeout(500);
              report = await tip
                .evaluate((el) => {
                  const r = el.getBoundingClientRect();
                  const cut = [...el.querySelectorAll(".g2-tooltip-list-item-value, .g2-tooltip-list-item-name-label")]
                    .filter((n) => n.scrollWidth > n.clientWidth + 1)
                    .map((n) => n.innerText);
                  return { width: Math.round(r.width), left: Math.round(r.left), right: Math.round(r.right), cut, ellipsis: /…/.test(el.innerText), vw: innerWidth };
                }, null, { timeout: 3000 })
                .catch(() => null);
            }
          }
        }
        expect(report, "a tooltip appeared").not.toBeNull();
        expect(report.width, JSON.stringify(report)).toBeGreaterThanOrEqual(WIDE_TOOLTIP.min);
        expect(report.width).toBeLessThanOrEqual(WIDE_TOOLTIP.max);
        expect(report.cut, JSON.stringify(report)).toEqual([]);
        expect(report.ellipsis).toBe(false);
        expect(report.left).toBeGreaterThanOrEqual(0);
        expect(report.right).toBeLessThanOrEqual(report.vw);
      });
    }
  }
});
