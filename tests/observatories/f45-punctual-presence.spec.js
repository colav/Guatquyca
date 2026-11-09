/*
 * F45 (D-138): the eighth category «presencia puntual»: 1 to 4 products in 2010–2025 (with the other
 * filters), not classified by ratio or trend. The first block needs no server; the second reads the real
 * quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { CATEGORY, CATEGORY_LABELS, CATEGORY_ORDER, CATEGORY_SLUGS, MIN_PRODUCTS_CLASSIFY, computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { CATEGORY_MARKS } from "../../lib/observatories/palette";
import { CATEGORY_PALETTE } from "../../lib/constants";
import { PUNCTUAL_DEFINITION, RULES_TABLE, RULE_LINE, categoryLine, lowCapacityDefinition } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

test.describe("punctual presence (no server)", () => {
  test("the label, the shape and the colour of the eighth category are its own", () => {
    expect(CATEGORY_LABELS[CATEGORY.PUNCTUAL]).toBe("presencia puntual");
    expect(CATEGORY_ORDER).toHaveLength(8);
    expect(CATEGORY_ORDER.indexOf(CATEGORY.PUNCTUAL)).toBe(CATEGORY_ORDER.indexOf(CATEGORY.LOW_CAPACITY) + 1);
    expect(CATEGORY_ORDER[CATEGORY_ORDER.length - 1]).toBe(CATEGORY.NONE);
    expect(CATEGORY_MARKS.punctual.shape).toBe("x"); // an X since F46 (D-139)
    expect(CATEGORY_MARKS.punctual.color).toBe(CATEGORY_PALETTE.punctual);
    expect(CATEGORY_SLUGS[CATEGORY.PUNCTUAL]).toBe("presencia-puntual");
  });

  test("the texts take the threshold from the constant: row of the table, tooltip of the point and definition of capacidad relativa baja", () => {
    expect(MIN_PRODUCTS_CLASSIFY).toBe(5);
    expect(RULES_TABLE.find((r) => r.key === "punctual").trend).toBe(`menos de ${MIN_PRODUCTS_CLASSIFY} productos`);
    expect(RULE_LINE.punctual).toContain("Presencia puntual");
    expect(PUNCTUAL_DEFINITION).toBe("Menos de 5 productos en 2010–2025: no se clasifica por razón ni por tendencia.");
    expect(categoryLine("punctual", "presencia puntual")).toBe("presencia puntual (menos de 5 productos: no se clasifica)");
    expect(categoryLine("leader", "líder")).toBe("líder");
    expect(lowCapacityDefinition()).toMatch(/y producción sin crecimiento, con 5 o más productos\.$/);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const PAGE = (query = "") => `/observatories/vri-udea/board-1${query ? `?${query}` : ""}`;
const fmt = (n) => n.toLocaleString("es-CO");

const legend = (page) =>
  page.getByTestId("category-legend").locator("[data-category]").evaluateAll((nodes) => Object.fromEntries(nodes.map((n) => [n.dataset.category, +n.dataset.count])));
/* F100 (D-223): the note of the header of the panel 1 moved into its information window. */
const noteText = async (page) => {
  await page.getByTestId("chart-card").first().getByTestId("panel-info").click();
  const text = (await page.getByTestId("panel-info-note").last().innerText()).replace(/^Nota del panel\s*/, "");
  await page.keyboard.press("Escape");
  return text;
};
const shownPoints = async (page) => +(((await noteText(page)).match(/^([\d.]+) puntos/) || [])[1] || "0").replace(/\./g, "");

async function open(page, width, query) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(PAGE(query));
  await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
}

test.describe("punctual presence against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let raw;
  test.beforeAll(async () => {
    raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
  });

  test("the rule: no point classified has fewer than 5 products and every punctual one has 1 to 4; 0 products is «sin producción»", async () => {
    for (const filters of [{}, { facultyIndex: 1 }, { dimension: "subfield" }, { dimension: "field" }, { ratioBasis: "global" }]) {
      const result = computeCapacity(createDataset(raw), filters);
      for (const u of result.units) {
        const p = u.windowTotal;
        if (p === 0) expect(u.category, JSON.stringify(filters)).toBe(CATEGORY.NONE);
        else if (p < MIN_PRODUCTS_CLASSIFY) expect(u.category, `${u.label} ${p}`).toBe(CATEGORY.PUNCTUAL);
        else if (u.noRatio) expect(u.category, `${u.label} (F57: no topic of 5 or more products)`).toBe(CATEGORY.PUNCTUAL); // rule (b), D-153
        else expect([CATEGORY.NONE, CATEGORY.PUNCTUAL]).not.toContain(u.category);
      }
      // the eight categories add up to the units of the dimension
      expect(Object.values(result.categoryCounts).reduce((a, b) => a + b, 0)).toBe(result.units.length);
      expect(Object.keys(result.categoryCounts)).toHaveLength(8);
    }
    const base = computeCapacity(createDataset(raw));
    expect(base.units).toHaveLength(4516);
    expect(base.categoryCounts.none).toBe(1298); /* B153: 1.298 with 2010–2025 (2.095 with 2021–2025) */
    console.log(`[live] counts without filters: ${JSON.stringify(base.categoryCounts)}`);
    console.log(`[live] counts with faculty 1: ${JSON.stringify(computeCapacity(createDataset(raw), { facultyIndex: 1 }).categoryCounts)}`);
    console.log(`[live] counts subfield: ${JSON.stringify(computeCapacity(createDataset(raw), { dimension: "subfield" }).categoryCounts)}`);
    console.log(`[live] counts field: ${JSON.stringify(computeCapacity(createDataset(raw), { dimension: "field" }).categoryCounts)}`);
  });

  test("the legend has the eight entries with the real counts, with and without a unit filter and in the three dimensions", async ({ page }) => {
    test.setTimeout(150000);
    for (const [query, filters] of [["", {}], ["faculty=1", { facultyIndex: 1 }], ["dimension=subfield", { dimension: "subfield" }], ["dimension=field", { dimension: "field" }]]) {
      const result = computeCapacity(createDataset(raw), filters);
      await open(page, 1280, query);
      const counts = await legend(page);
      expect(Object.keys(counts)).toHaveLength(8);
      for (const c of CATEGORY_ORDER) {
        const expected = c === CATEGORY.NONE ? result.categoryCounts[c] : result.units.filter((u) => u.products > 0 && u.category === c).length;
        expect(counts[c], `${query || "default"} ${c}`).toBe(expected);
      }
      const { none, ...drawn } = counts;
      expect(Object.values(drawn).reduce((a, n) => a + n, 0)).toBe(await shownPoints(page));
      expect(none).toBe(result.categoryCounts.none);
      expect(Object.values(counts).reduce((a, n) => a + n, 0)).toBe(result.units.length); // the eight add up to the units
    }
  });

  for (const width of [1280, 768]) {
    test(`at ${width}px the legend with eight entries keeps its two lines and nothing is cut`, async ({ page }) => {
      await open(page, width);
      const report = await page.getByTestId("category-legend").evaluate((box) => ({
        height: Math.round(box.getBoundingClientRect().height),
        clipped: box.scrollHeight > box.clientHeight + 1,
        cut: [...box.querySelectorAll("button, [data-informative]")].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.innerText),
        entries: box.querySelectorAll("button, [data-informative]").length,
        hidden: [...box.querySelectorAll("button, [data-informative]")].filter((b) => b.getBoundingClientRect().bottom > box.getBoundingClientRect().bottom + 1).map((b) => b.innerText),
      }));
      expect(report.height).toBe(61);
      expect(report.clipped, JSON.stringify(report)).toBe(false);
      expect(report.cut).toEqual([]);
      expect(report.hidden).toEqual([]);
      expect(report.entries).toBe(8);
      await expect(page.getByRole("button", { name: "Ver todas" })).toBeVisible();
    });
  }

  test("«presencia puntual» is drawn and clickable: a click isolates it, ?cat= is written and the legend sum holds", async ({ page }) => {
    await open(page, 1280);
    const counts = await legend(page);
    const button = page.locator('button[data-category="punctual"]');
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/cat=presencia-puntual/);
    expect(await shownPoints(page)).toBe(counts.punctual);
    await expect.poll(() => noteText(page)).toContain("solo presencia puntual");
    await button.click();
    expect(await shownPoints(page)).toBe(Object.entries(counts).filter(([c]) => c !== "none").reduce((a, [, n]) => a + n, 0));
  });

  test("the tooltip of a punctual point keeps Productos, Citas, FWCI, Tendencia and Razón and says that it is not classified", async ({ page }) => {
    test.setTimeout(120000);
    await open(page, 1280, "cat=presencia-puntual");
    const card = page.getByTestId("chart-card").first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    let text = "";
    for (let y = box.y + 220; y < box.y + box.height - 140 && !text; y += 10) {
      for (let x = box.x + 100; x < box.x + box.width * 0.7 && !text; x += 8) {
        await page.mouse.move(x, y);
        const tip = page.locator(".g2-tooltip:visible").first();
        if ((await tip.count()) && /Categoría/.test((await tip.innerText().catch(() => "")) || "")) {
          await page.waitForTimeout(400);
          text = (await tip.innerText().catch(() => "")) || "";
        }
      }
    }
    expect(text, "a tooltip appeared").not.toBe("");
    for (const label of ["Productos", "Citas", "FWCI", "Tendencia", "Razón de capacidad"]) expect(text, label).toContain(label);
    expect(text).toContain("presencia puntual (menos de 5 productos: no se clasifica)");
    const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
    const products = +lines[lines.indexOf("Productos") + 1].replace(/\./g, "");
    expect(products).toBeGreaterThanOrEqual(1);
    expect(products).toBeLessThan(MIN_PRODUCTS_CLASSIFY);
  });

  test("the row «Presencia puntual» is in the table of rules with its sentence in the tooltip, and the table is not cut", async ({ page }) => {
    await open(page, 1280);
    const table = page.getByLabel("Reglas de clasificación");
    await expect(table.getByText("Presencia puntual")).toBeVisible();
    await expect(table.getByText("menos de 5 productos")).toBeVisible();
    await table.getByText("Presencia puntual").hover();
    await expect(page.getByText(PUNCTUAL_DEFINITION)).toBeVisible({ timeout: 5000 });
    const cut = await table.evaluate((t) => [...t.querySelectorAll("th, td")].filter((c) => c.scrollWidth > c.clientWidth + 1).map((c) => c.innerText));
    expect(cut).toEqual([]);
    expect(await table.locator("svg").count()).toBe(8);
  });

  test("the help text and the lead say eight categories and name the new one; the calculator has eight bars with complete labels", async ({ page }) => {
    await open(page, 1280);
    const main = await page.locator("main").innerText();
    expect(main).toContain("medida en ocho categorías");
    expect(main).not.toContain("siete categorías");
    await page.getByText("¿Cómo usar este tablero?").click();
    await expect(page.getByText("Los tópicos con menos de 5 productos en 2010–2025 se muestran como «presencia puntual»", { exact: false })).toBeVisible();
    const label = await page.getByTestId("calculator-bars").getAttribute("aria-label");
    expect(label).toContain(`presencia puntual: ${fmt((await legend(page)).punctual)}`);
    expect(label.split(". ")[1].split("; ")).toHaveLength(8);
  });
});
