/*
 * F43 (D-133): the panels 1 and 2 of Board 1 are a snapshot of 2010–2025 that ignores the years filter
 * and responds to the other filters; the referent comes from `ref_2125` (B106) and, while the bundle
 * does not have it, from the yearly leaders summed over 2010–2025 (the page then still works and the
 * calculation says which source it used). The first block needs no server; the second reads the real
 * quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { SNAPSHOT_NOTE, HELP_TEXT_REAL } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

test.describe("snapshot texts (no server)", () => {
  test("the notice and the help text say 2010–2025 and that the years filter does not apply", () => {
    expect(SNAPSHOT_NOTE).toBe("Datos fijos de 2010–2025: el filtro de años no los cambia.");
    /* F112 (D-249): the block «¿Cómo usar este tablero?» no longer repeats the snapshot; the cards of the panels 1 and 2 say it. */
    expect(HELP_TEXT_REAL.join(" ")).not.toContain("situación 2010–2025");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const PAGE = (query = "") => `/observatories/vri-udea/board-1${query ? `?${query}` : ""}`;

const legend = (page) =>
  page.getByTestId("category-legend").locator("[data-category]").evaluateAll((nodes) => Object.fromEntries(nodes.map((n) => [n.dataset.category, +n.dataset.count])));

async function open(page, query) {
  await page.goto(PAGE(query));
  await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
}

test.describe("snapshot 2010–2025 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let raw;
  test.beforeAll(async () => {
    raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
  });

  test("the year filter moves no point and no count of the panels 1 and 2, but it moves the rest of the board", async ({ page }) => {
    await open(page);
    const base = await legend(page);
    const kpiBase = await page.locator(".obs-kpi").first().innerText();
    await open(page, "from=2024&to=2025");
    expect(await legend(page)).toEqual(base);
    expect(await page.locator(".obs-kpi").first().innerText()).not.toBe(kpiBase); // the products of the board do follow the years
    await expect(page.getByTestId("snapshot-note")).toHaveCount(2);
    for (const note of await page.getByTestId("snapshot-note").allInnerTexts()) expect(note).toBe("Datos fijos de 2010–2025: el filtro de años no los cambia.");
    // the calculation says the same
    const a = computeCapacity(createDataset(raw));
    const b = computeCapacity(createDataset(raw), { yearFrom: 2024, yearTo: 2025 });
    expect(b.categoryCounts).toEqual(a.categoryCounts);
    expect(b.units.map((u) => [u.id, u.products, u.citations])).toEqual(a.units.map((u) => [u.id, u.products, u.citations]));
    expect(b.products).toBeLessThan(a.products);
  });

  test("a unit filter does move the panels, and so does the world referent", async ({ page }) => {
    await open(page);
    const base = await legend(page);
    await open(page, "faculty=1");
    expect(await legend(page)).not.toEqual(base);
    await open(page, "basis=global");
    expect(await legend(page)).not.toEqual(base);
  });

  test("the cards of the panels 1 and 2 say the snapshot; the block of help only orients (F112)", async ({ page }) => {
    await open(page);
    await expect(page.getByText(SNAPSHOT_NOTE, { exact: false }).first()).toBeVisible();
    await page.getByText("¿Cómo usar este tablero?").click();
    await expect(page.getByText("situación 2010–2025", { exact: false })).toHaveCount(0);
  });

  test("the tooltip agrees: products and citations of 2010–2025 add up with the yearly counts and the ratio names the referent", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);
    const card = page.getByTestId("chart-card").first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    let text = "";
    for (let y = box.y + 220; y < box.y + box.height - 140 && !text; y += 10) {
      for (let x = box.x + 120; x < box.x + box.width * 0.6 && !text; x += 8) {
        await page.mouse.move(x, y);
        const tip = page.locator(".g2-tooltip:visible").first();
        if ((await tip.count()) && /Categoría/.test((await tip.innerText().catch(() => "")) || "")) {
          await page.waitForTimeout(400);
          text = (await tip.innerText().catch(() => "")) || "";
        }
      }
    }
    expect(text, "a tooltip appeared").not.toBe("");
    const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
    const valueOf = (label) => lines[lines.indexOf(label) + 1];
    const products = +valueOf("Productos").replace(/\./g, "");
    const years = valueOf("Productos por año (2010–2025)").split(",").map((n) => +n.trim());
    expect(years.reduce((a, b) => a + b, 0)).toBe(products);
    expect(text).toMatch(/\(citas de la UdeA [\d.]+ frente a [\d.]+ de [^)]+\)|es la institución con más citas/);
    expect(text).not.toContain("del referente");
    expect(text).not.toContain("Referente principal");
  });

  test("with ref_2125 every topic with production has a named referent and a ratio between 0 and 1; the units without production are 1.298", async () => {
    test.skip(!Array.isArray(raw.ref_2125), "The bundle has no ref_2125 yet.");
    const result = computeCapacity(createDataset(raw));
    expect(result.referentSource).toBe("ref_1025");
    const drawn = result.units.filter((u) => u.products > 0);
    for (const u of drawn) {
      expect(u.ratio).toBeGreaterThanOrEqual(0);
      expect(u.ratio).toBeLessThanOrEqual(1);
    }
    // The figures of B106 and B153 change when B108 replaces the values: only the structure is fixed here.
    expect(drawn.filter((u) => u.referent).length).toBeGreaterThan(0.9 * drawn.length);
    expect(result.noProduction.total).toBe(1298); /* B153: with 2010–2025 (2.095 with 2021–2025) */
    expect(result.noProduction.otherYears + result.noProduction.never).toBe(1298);
    const pp = result.units.find((u) => u.label === "Particle physics theoretical and experimental studies");
    expect(pp.referent.length).toBeGreaterThan(0);
    expect(pp.leaderCitations).toBeGreaterThan(0);
  });

  test("lideres and mundo_anio are not read by the board when ref_2125 is there (B107 can remove them)", async () => {
    test.skip(!Array.isArray(raw.ref_2125), "The bundle has no ref_2125 yet.");
    const withAll = computeCapacity(createDataset(raw));
    const without = computeCapacity(createDataset({ ...raw, lideres: undefined, mundo_anio: undefined }));
    expect(without.model).toBe("capacity");
    expect(without.units.map((u) => [u.id, u.ratio, u.category])).toEqual(withAll.units.map((u) => [u.id, u.ratio, u.category]));
    expect(without.categoryCounts).toEqual(withAll.categoryCounts);
  });

  test("the source of the referent is reported: ref_2125 when the bundle has it", async () => {
    const result = computeCapacity(createDataset(raw));
    expect(["ref_1025", "ref_2125", "lideres"]).toContain(result.referentSource);
    expect(result.referentSource).toBe(Array.isArray(raw.ref_1025) ? "ref_1025" : Array.isArray(raw.ref_2125) ? "ref_2125" : "lideres");
  });
});
