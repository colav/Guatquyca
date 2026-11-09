/*
 * F39b (adjusted by F43b, D-134): the legend of the panel 1 shows «sin producción» as an informative
 * entry with the complete figure of 2010–2025, a note at the foot says that those units are not drawn,
 * and the tooltip of the scatter is wide enough for its longest lines. The first block needs no server;
 * the second reads the real quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { noProductionTooltip, undrawnNote } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { WIDE_TOOLTIP, tooltipInteraction } from "../../lib/observatories/tooltipStyle";

test.describe("texts and style (no server)", () => {
  test("the tooltip of «sin producción» and the note at the foot are built from the figures", () => {
    expect(noProductionTooltip({ otherYears: 811, never: 1284, noun: "tópicos" })).toBe(
      "Tópicos sin productos con ese tópico principal en 2010–2025 (811 con producción anterior y 1.284 sin ninguna): no se dibujan en la gráfica",
    );
    expect(undrawnNote({ count: 2095, noun: "tópicos" })).toBe("Los tópicos sin productos con ese tópico principal en 2010–2025 no se dibujan (2.095)");
    expect(undrawnNote({ count: 12, noun: "subcampos" })).toContain("subcampos");
    expect(noProductionTooltip({ otherYears: 1, never: 2, noun: "campos" })).toMatch(/^Campos sin productos con ese tópico principal/);
  });

  test("the tooltip is at least 460 px wide and at most the width of its longest line (1.000 px) or of the window, a long value goes on a second line and nothing is cut", () => {
    const css = tooltipInteraction(WIDE_TOOLTIP).tooltip.css;
    expect(css[".g2-tooltip"]).toEqual({ "min-width": "460px", "max-width": "min(1000px, calc(100vw - 56px))", width: "max-content" });
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
  return page.getByTestId("category-legend").locator("[data-category]").evaluateAll((nodes) =>
    Object.fromEntries(nodes.map((n) => [n.dataset.category, { count: +n.dataset.count, text: n.innerText.replace(/\s+/g, " ").trim() }])),
  );
}

test.describe("legend with «sin producción» informative and wide tooltip (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let raw;
  test.beforeAll(async () => {
    raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
  });

  for (const [name, query, filters] of [
    ["without filters", "", {}],
    ["with years 2015 to 2022 (ignored by the panels)", "from=2015&to=2022", { yearFrom: 2015, yearTo: 2022 }],
    ["with a unit filter", "faculty=1", { facultyIndex: 1 }],
  ]) {
    test(`the legend and the foot agree with the panel 2 ${name}`, async ({ page }) => {
      const result = computeCapacity(createDataset(raw), filters);
      const noneTotal = result.categoryCounts.none;
      const drawn = result.units.filter((u) => u.products > 0);
      await page.goto(PAGE(query));
      await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1500);
      const legend = await figures(page);
      // The complete figure of the window, no «N de M».
      expect(legend.none.count).toBe(noneTotal);
      expect(legend.none.text).toBe(`sin producción ${fmt(noneTotal)}`);
      const { none, ...rest } = legend;
      expect(Object.values(rest).reduce((a, e) => a + e.count, 0)).toBe(drawn.length);
      for (const entry of Object.values(legend)) expect(entry.text).not.toMatch(/\d de \d/);
      /* F100 (D-223): the count moved from the header of the panel 1 into its information window */
      await page.getByTestId("chart-card").first().getByTestId("panel-info").click();
      await expect(page.getByTestId("panel-info-note").last()).toContainText(`${fmt(drawn.length)} puntos con producción`);
      await page.keyboard.press("Escape");
      if (noneTotal > 0) await expect(page.getByTestId("undrawn-note")).toHaveText(`Los tópicos sin productos con ese tópico principal en 2010–2025 no se dibujan (${fmt(noneTotal)})`);
    });
  }

  test("hovering «sin producción» explains the two figures with the same filters", async ({ page }) => {
    const result = computeCapacity(createDataset(raw));
    await page.goto(PAGE());
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.locator('[data-category="none"]').hover();
    const { otherYears, never } = result.noProduction;
    await expect(page.getByText(`Tópicos sin productos con ese tópico principal en 2010–2025 (${fmt(otherYears)} con producción anterior y ${fmt(never)} sin ninguna): no se dibujan en la gráfica`)).toBeVisible({ timeout: 5000 });
    expect(otherYears + never).toBe(result.categoryCounts.none);
  });

  for (const width of [1280, 768]) {
    for (const side of ["middle", "right"]) {
      test(`at ${width}px the tooltip (${side}) is wide enough, is not cut and stays inside the window`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(PAGE());
        await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(3000);
        const card = page.getByTestId("chart-card").first();
        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();
        const from = side === "right" ? box.x + box.width * 0.62 : box.x + 120;
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
        expect(report.width).toBeLessThanOrEqual(Math.min(1000 + 24, report.vw - 32) + 1);
        expect(report.cut, JSON.stringify(report)).toEqual([]);
        expect(report.ellipsis).toBe(false);
        expect(report.left).toBeGreaterThanOrEqual(0);
        expect(report.right).toBeLessThanOrEqual(report.vw);
      });
    }
  }
});
