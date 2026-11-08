/*
 * F71 (D-174): (1) Board 3, indicator 1 by level of education with talent.ext.por_nivel_academico and the density per
 * inhabitant (the Minciencias category stays as a second view); (2) Board 1, an ODS that can be chosen and cuts the scatter,
 * the calculator and the tables (URL, folded bar, combines with «y»); (3) panel 8 as a real treemap; (4) panels in the order
 * 1 to 8; (5) label «Dimensión (campos, subcampos o tópicos)». Indicators 12, 14, 17, 18 of Board 3 and X-05 are not touched.
 * The first block needs no server; the second reads the real quyca and the dev server of Luis and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset, rankOds } from "../../lib/observatories/capacity";
import { parseFilters, serializeFilters } from "../../lib/observatories/filters";
import { TALENT_VIEWS, talentLevelNote, talentMincienciasNote } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* facts: [topic, year, citations, type, quartile, access, facs, deps, centres, groups, subregions, ods[[n, score]], pairs, actors, record] */
const fact = (topic, year, ods) => [topic, year, 1, 0, 0, 0, [0], [], [0], [0], [], ods, [], [], 1];
const topic = (id) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link: [] });
const raw = {
  meta: {}, topics: [topic("T1"), topic("T2")], ejes: [],
  facts: [
    fact(0, 2022, [[3, 80], [7, 50]]), // ODS 3 and 7
    fact(0, 2023, [[3, 30]]), //          ODS 3 below the score: does not count
    fact(1, 2022, [[7, 90]]), //          ODS 7
    fact(1, 2024, []), //                  no ODS
  ],
  groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ods: Array.from({ length: 17 }, (_, i) => [i + 1, `ODS ${i + 1}`, "#4c9f38"]),
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100]], inst_lider: ["Inst"], ref_nacional: [0, 1],
};
const ds = createDataset(raw);

test.describe("F71 (no server)", () => {
  test("an ODS cuts the products (score 0,40 or more), combines with the years, and the ranking of ODS keeps all of them", () => {
    expect(computeCapacity(ds, {}).products).toBe(4);
    expect(computeCapacity(ds, { odsNumber: 3 }).products).toBe(1); // only the first fact: the second has a score of 0,30
    expect(computeCapacity(ds, { odsNumber: 7 }).products).toBe(2);
    expect(computeCapacity(ds, { odsNumber: 7, yearFrom: 2023, yearTo: 2026 }).products).toBe(0); // «y» with the years
    expect(computeCapacity(ds, { odsNumber: 0 }).products).toBe(4);
    expect(computeCapacity(ds, { odsNumber: 99 }).products).toBe(4); // not an ODS: no filter
    const counts = (f) => Object.fromEntries(rankOds(ds, computeCapacity(ds, f)).map((o) => [o.number, o.value]));
    const nonZero = (f) => Object.fromEntries(Object.entries(counts(f)).filter(([, v]) => v > 0));
    expect(nonZero({})).toEqual({ 3: 1, 7: 2 });
    expect(nonZero({ odsNumber: 3 })).toEqual({ 3: 1, 7: 2 }); // the ranking does not collapse: the choice can be changed
    expect(computeCapacity(ds, { odsNumber: 3 }).citations).toBe(1);
  });

  test("it travels in the URL; a value that is not an ODS is ignored", () => {
    expect(parseFilters(new URLSearchParams("ods=3")).odsNumber).toBe(3);
    expect(parseFilters(new URLSearchParams("ods=18")).odsNumber).toBe(0);
    expect(parseFilters(new URLSearchParams("ods=x")).odsNumber).toBe(0);
    expect(parseFilters(new URLSearchParams("")).odsNumber).toBe(0);
    expect(new URLSearchParams(serializeFilters({ ...parseFilters(new URLSearchParams("ods=7")) })).get("ods")).toBe("7");
    expect(serializeFilters({ ...parseFilters(new URLSearchParams("")) })).toBe("");
  });

  test("T3 texts of the panel 1 by level", () => {
    expect(TALENT_VIEWS.map((v) => v.value)).toEqual(["level", "minciencias"]);
    expect(talentLevelNote("2.621", "Planta.")).toContain("Nivel de formación de los 2.621 profesores");
    expect(talentLevelNote("2.621", "Planta.")).not.toContain("No existe campo de nivel");
    expect(talentMincienciasNote("Planta.")).toContain("Categoría Minciencias");
  });
});

const fmt = (n) => Number(n).toLocaleString("es-CO");

test.describe("F71 against the real quyca (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let b1;
  let b3;
  let d1;
  test.beforeAll(async () => {
    b1 = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    d1 = createDataset(b1);
  });

  test("T3 panel 1: bars by level of education with the density, the Minciencias category as second view", async ({ page }) => {
    test.setTimeout(200000);
    const lv = b3.talent.ext.por_nivel_academico;
    const staff = Object.values(lv).reduce((a, b) => a + b, 0);
    expect(staff).toBe(b3.talent.staff_total);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-3");
    await page.getByTestId("filters").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3000);
    const card = page.getByTestId("chart-card").filter({ hasText: "1 ·" }).first();
    await expect(card).toContainText("1 · Talento investigador por nivel de formación");
    await expect(card).toContainText(`Nivel de formación de los ${fmt(staff)} profesores`);
    await expect(card).not.toContainText("No existe campo de nivel");
    // the density per 100.000 inhabitants (adjusted and census) in the tooltip of a bar
    const canvas = card.locator("canvas").first();
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    let tip = "";
    for (let fy = 0.05; fy < 0.9 && !tip; fy += 0.05) {
      await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * fy);
      await page.waitForTimeout(250);
      tip = await page.evaluate(() => [...document.querySelectorAll(".g2-tooltip")].filter((e) => e.offsetParent && e.innerText.trim()).map((e) => e.innerText.replace(/\s+/g, " ").trim())[0] || "");
    }
    console.log(`[live] T3 panel 1 by level: ${tip}`);
    expect(tip).toMatch(/Doctorado|Maestría|Especialización|Profesional|Sin dato/);
    expect(tip).toContain("por 100.000 hab. (ajustada)");
    expect(tip).toContain("(censada)");
    // the second view
    await card.getByTestId("talent-view").getByText("Por categoría Minciencias").click();
    await expect(card).toContainText("1 · Talento investigador por categoría Minciencias");
    await expect(card).toContainText("Categoría Minciencias de los profesores con contrato vigente");
    console.log(`[live] levels: ${JSON.stringify(lv)} (suma ${staff})`);
  });

  test("T1: panels 1 to 8 in order, label of the filter 5, ODS from the URL and from the filter, treemap and clicks", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(3000);
    // order of the panels
    const titles = await page.getByTestId("chart-card").evaluateAll((els) => els.map((e) => e.querySelector(".ant-card-head-title")?.textContent || ""));
    const numbers = titles.map((t) => /^(\d) ·/.exec(t)?.[1]).filter(Boolean).map(Number);
    console.log(`[live] T1 order of the panels: ${numbers.join(", ")}`);
    expect(numbers.slice(0, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    await expect(page.getByTestId("filters").getByText("Dimensión (campos, subcampos o tópicos)")).toBeVisible();
    const kpi = () => page.locator(".obs-kpi").filter({ hasText: "productos (artículos" }).first();
    const all = computeCapacity(d1, {}).products;
    await expect(kpi()).toContainText(fmt(all));
    // ODS from the URL
    const ods3 = computeCapacity(d1, { odsNumber: 3 }).products;
    expect(ods3).toBeGreaterThan(0);
    expect(ods3).toBeLessThan(all);
    await page.goto("/observatories/vri-udea/board-1?ods=3");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(kpi()).toContainText(fmt(ods3));
    await expect(page.getByTestId("ods-selected-note")).toContainText("3 · ");
    // the ranking of ODS still lists the other goals (the choice can be changed)
    const ranking = rankOds(d1, computeCapacity(d1, { odsNumber: 3 })).filter((o) => o.value > 0);
    expect(ranking.length).toBeGreaterThan(5);
    // the filter bar: folded tag and the control
    await expect(page.getByTestId("ods-filter")).toContainText("Salud");
    // from the control: another ODS, then «all»
    await page.getByTestId("ods-filter").locator(".ant-select-selector").click();
    await page.keyboard.type("Hambre");
    await page.locator(".ant-select-dropdown:visible .ant-select-item-option").first().click();
    await expect(page).toHaveURL(/ods=2/, { timeout: 15000 });
    await page.waitForTimeout(1500);
    await expect(kpi()).toContainText(fmt(computeCapacity(d1, { odsNumber: 2 }).products));
    // combines with «y»: ODS 2 and a range of years
    expect(computeCapacity(d1, { odsNumber: 2, yearFrom: 2015, yearTo: 2020 }).products).toBeLessThan(computeCapacity(d1, { odsNumber: 2 }).products);
    // a click on the treemap chooses an ODS (the biggest block is the top left one); a second click on it removes it
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const tree = page.getByTestId("ods-treemap");
    await tree.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const box = await tree.locator("canvas").first().boundingBox();
    await page.mouse.move(box.x + box.width * 0.49, box.y + box.height * 0.49);
    await page.waitForTimeout(500);
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 5 });
    await page.waitForTimeout(500);
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await expect(page).toHaveURL(/ods=\d+/, { timeout: 15000 });
    const chosen = Number(/ods=(\d+)/.exec(page.url())[1]);
    await page.waitForTimeout(1500);
    await expect(kpi()).toContainText(fmt(computeCapacity(d1, { odsNumber: chosen }).products));
    console.log(`[live] click on the treemap chose ODS ${chosen}: ${computeCapacity(d1, { odsNumber: chosen }).products} products`);
    await tree.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const box2 = await tree.locator("canvas").first().boundingBox();
    await page.mouse.click(box2.x + box2.width * 0.5, box2.y + box2.height * 0.5);
    await expect(page).not.toHaveURL(/ods=/, { timeout: 15000 });
    // a click on a bar of the ranking of ODS
    const bars = page.getByTestId("ranking-selectable").last();
    await bars.evaluate((el) => el.scrollIntoView({ block: "start" }));
    // the chart must start below the sticky bar of filters (it is 220 px tall since F77)
    const stickyBottom = (await page.getByTestId("filters").boundingBox()).y + (await page.getByTestId("filters").boundingBox()).height;
    await page.evaluate((delta) => window.scrollBy(0, -delta), stickyBottom + 8);
    await page.waitForTimeout(600);
    const bb = await bars.locator("canvas").first().boundingBox();
    for (let y = 12; y < bb.height - 20 && !/ods=\d+/.test(page.url()); y += 14) {
      await page.mouse.move(bb.x + bb.width * 0.88, bb.y + y, { steps: 3 });
      await page.waitForTimeout(250);
      await page.mouse.click(bb.x + bb.width * 0.88, bb.y + y);
      await page.waitForTimeout(700);
    }
    await expect(page).toHaveURL(/ods=\d+/, { timeout: 15000 });
    console.log(`[live] click on the ranking chose ${/ods=(\d+)/.exec(page.url())[0]}`);
  });
});
