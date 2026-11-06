/*
 * F49 (D-142, D-143): choosing one or more Ejes Temáticos cuts the whole Board 1 to the products linked to them
 * (the pairs of facts[12] with the confidence of the board), also the panels 1 and 2 (which keep the window of
 * 2021–2025), and shows the table «Tópicos del Eje Temático» with all the filters, the years included. The first
 * block needs no server; the second reads the real quyca and the dev server of Luis (D-100) and only runs with
 * E2E_LIVE=1. No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset, rankAxisTopics, rankGoals } from "../../lib/observatories/capacity";
import { parseFilters, serializeFilters, sameFilters } from "../../lib/observatories/filters";

// facts: [topic, year, citations, type, quartile, access, facs, deps, centres, groups, subregions, ods, pairs, actors, record]
const fact = (topic, year, citations, pairs) => [topic, year, citations, 0, 0, 0, [0], [], [0], [0], [], [], pairs, [], 1];
const topic = (id, link) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link });
const axis = (id, eje, agenda = "Doc") => ({ id, clave: `K${id}`, eje, agenda, nivel: "Nacional", meta: "Goal" });

const raw = {
  meta: {},
  topics: [topic("T1", [[0, 5]]), topic("T2", [[1, 3]]), topic("T3", [[0, 2], [1, 2]]), topic("T4", [])],
  ejes: [axis(0, "Eje A"), axis(1, "Eje B with a name that is quite long to be cut")],
  facts: [
    fact(0, 2022, 10, [[0, 0]]), // T1, axis 0 (high)
    fact(0, 2023, 20, [[0, 1]]), // T1, axis 0 (medium)
    fact(0, 2024, 5, [[0, 2]]), //  T1, axis 0 (low: only with "all")
    fact(1, 2022, 7, [[1, 0]]), //  T2, axis 1
    fact(2, 2025, 3, [[0, 0], [1, 0]]), // T3, both axes
    fact(3, 2024, 40, [[0, 0]]), // T4 is not a topic of the axis 0, but this product is linked to it by a pair
    fact(0, 2015, 1, [[0, 0]]), //  T1 outside 2021–2025
    fact(1, 2024, 9, []), //       T2 without any pair
  ],
  groups: [["G0", "Grupo 0", "A1"]],
  cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100], [3, 1, 0, 5, 100]],
  inst_lider: ["Inst"],
  ref_nacional: [0, 1, 2, 3],
};
const ds = createDataset(raw);

test.describe("axis filter and table of topics (no server)", () => {
  test("a chosen axis cuts the products to the ones with a pair of the confidence of the board", () => {
    const r = computeCapacity(ds, { axisIds: [0] });
    // axis 0: T1 high, T1 medium, T3, T4 (pair) and T1 of 2015 = 5 products; the low pair does not count by default
    expect(r.products).toBe(5);
    expect(computeCapacity(ds, { axisIds: [0], pairLevel: "all" }).products).toBe(6);
    expect(computeCapacity(ds).products).toBe(8);
    expect(computeCapacity(ds, { axisIds: [] }).products).toBe(8);
  });

  test("the rest of the board follows: citations, the years filter and the other filters apply on top", () => {
    expect(computeCapacity(ds, { axisIds: [0] }).citations).toBe(10 + 20 + 3 + 40 + 1);
    expect(computeCapacity(ds, { axisIds: [0], yearFrom: 2021, yearTo: 2025 }).products).toBe(4);
    expect(computeCapacity(ds, { axisIds: [0], facultyIndex: 5 }).products).toBe(0);
  });

  test("the panels 1 and 2 keep 2021–2025 and answer to the axis: the topics outside the axis have no production", () => {
    const r = computeCapacity(ds, { axisIds: [1] });
    const byId = Object.fromEntries(r.units.map((u) => [u.id, u]));
    expect(byId.T2.products).toBe(1); // the one with the pair of axis 1 (the one without pair is out)
    expect(byId.T3.products).toBe(1);
    expect(byId.T1.products).toBe(0);
    expect(byId.T4.products).toBe(0);
    // the years filter does not move them
    const narrow = computeCapacity(ds, { axisIds: [1], yearFrom: 2010, yearTo: 2015 });
    expect(Object.fromEntries(narrow.units.map((u) => [u.id, u.products]))).toEqual(Object.fromEntries(r.units.map((u) => [u.id, u.products])));
  });

  test("the table has one row per topic of the axis, also with 0 products, sorted by products, with the totals", () => {
    const r = computeCapacity(ds, { axisIds: [0] });
    const rows = rankAxisTopics(ds, r);
    expect(rows.map((x) => x.id)).toEqual(["T1", "T3"]); // the topics linked to axis 0
    expect(rows.map((x) => x.products)).toEqual([3, 1]); // T1: 2022, 2023 and 2015; the product of the main topic
    expect(rows[0].citations).toBe(10 + 20 + 1);
    expect(rows.every((x) => x.axes.length === 1 && x.axes[0] === "Eje A")).toBe(true);
    // with the years of 2024 only, T1 and T3 have no products: they stay in the table with 0
    const none = rankAxisTopics(ds, computeCapacity(ds, { axisIds: [0], yearFrom: 2024, yearTo: 2024 }));
    expect(none.map((x) => x.products)).toEqual([0, 0]);
  });

  test("the product linked by a pair whose main topic is not a topic of the axis is in the cards and not in the table (reported, not adjusted)", () => {
    const r = computeCapacity(ds, { axisIds: [0] });
    const sum = rankAxisTopics(ds, r).reduce((a, x) => a + x.products, 0);
    expect(r.products - sum).toBe(1); // the T4 product
  });

  test("with several axes the topics are the union, a product is counted once and the axes of each topic are listed", () => {
    const r = computeCapacity(ds, { axisIds: [0, 1] });
    const rows = rankAxisTopics(ds, r);
    expect(rows.map((x) => x.id).sort()).toEqual(["T1", "T2", "T3"]);
    expect(rows.find((x) => x.id === "T3").axes).toHaveLength(2);
    expect(rows.find((x) => x.id === "T1").axes).toEqual(["Eje A"]);
    // the T3 product is linked to both axes and counts once
    expect(r.products).toBe(computeCapacity(ds, { axisIds: [0] }).products + computeCapacity(ds, { axisIds: [1] }).products - 1);
  });

  test("the panel 6 of goals counts only the chosen axes", () => {
    expect(rankGoals(ds, computeCapacity(ds))[0].value).toBe(2); // the goal of both axes
    expect(rankGoals(ds, computeCapacity(ds, { axisIds: [0] }))[0].value).toBe(1);
  });

  test("the axes go in the URL as ?axis=3,17 and come back; invalid values are ignored", () => {
    expect(serializeFilters({ ...parseFilters(new URLSearchParams("")), axisIds: [3, 17] })).toBe("axis=3%2C17");
    expect(parseFilters(new URLSearchParams("axis=3,17")).axisIds).toEqual([3, 17]);
    expect(parseFilters(new URLSearchParams("axis=3,x,3,-1,9")).axisIds).toEqual([3, 9]);
    expect(parseFilters(new URLSearchParams("")).axisIds).toEqual([]);
    const a = parseFilters(new URLSearchParams("axis=3,17"));
    expect(sameFilters(a, parseFilters(new URLSearchParams("axis=3,17")))).toBe(true);
    expect(sameFilters(a, parseFilters(new URLSearchParams("axis=3")))).toBe(false);
    expect(serializeFilters(parseFilters(new URLSearchParams("")))).toBe("");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const PAGE = (query = "") => `/observatories/vri-udea/board-1${query ? `?${query}` : ""}`;
const fmt = (n) => n.toLocaleString("es-CO");

test.describe("axis filter against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let real;
  let dataset;
  test.beforeAll(async () => {
    real = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    dataset = createDataset(real);
  });

  const open = async (page, query) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PAGE(query));
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1200);
  };

  test("without an axis there is no table; with one, the table appears with the years applied and the totals of the calculation", async ({ page }) => {
    await open(page, "");
    await expect(page.getByTestId("axis-topics-note")).toHaveCount(0);
    await open(page, "axis=98");
    const result = computeCapacity(dataset, { axisIds: [98] });
    const rows = rankAxisTopics(dataset, result);
    await expect(page.getByText("Tópicos del Eje Temático").first()).toBeVisible();
    await expect(page.getByTestId("axis-topics-note")).toContainText("Años aplicados: 2010–2026");
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(rows.reduce((a, r) => a + r.products, 0)));
    await expect(page.getByTestId("axis-topics-total-citations")).toHaveText(fmt(rows.reduce((a, r) => a + r.citations, 0)));
    // the cards are cut to the axis: the first KPI is the products of the axis
    await expect(page.locator(".obs-kpi").first()).toContainText(fmt(result.products));
    expect(result.products).toBeLessThan(computeCapacity(dataset).products);
    // the table does not have the column of axes with one axis
    await expect(page.locator(".ant-table-thead th", { hasText: /^Ejes$/ })).toHaveCount(0);
  });

  test("the table answers to the years filter and says which years; the panels 1 and 2 keep their snapshot", async ({ page }) => {
    await open(page, "axis=98&from=2021&to=2025");
    const all = rankAxisTopics(dataset, computeCapacity(dataset, { axisIds: [98] })).reduce((a, r) => a + r.products, 0);
    const years = rankAxisTopics(dataset, computeCapacity(dataset, { axisIds: [98], yearFrom: 2021, yearTo: 2025 })).reduce((a, r) => a + r.products, 0);
    expect(years).toBeLessThan(all);
    await expect(page.getByTestId("axis-topics-note")).toContainText("Años aplicados: 2021–2025");
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(years));
    const legendWithYears = await page.getByTestId("category-legend").innerText();
    await open(page, "axis=98&from=2012&to=2014");
    expect(await page.getByTestId("category-legend").innerText()).toBe(legendWithYears); // the panel 1 does not follow the years
  });

  test("a unit filter cuts the axis further and two axes show the column of axes with the union of their topics", async ({ page }) => {
    await open(page, "axis=98&faculty=1");
    const withUnit = computeCapacity(dataset, { axisIds: [98], facultyIndex: 1 });
    await expect(page.locator(".obs-kpi").first()).toContainText(fmt(withUnit.products));
    await open(page, "axis=98,203");
    const rows = rankAxisTopics(dataset, computeCapacity(dataset, { axisIds: [98, 203] }));
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(rows.reduce((a, r) => a + r.products, 0)));
    await expect(page.locator(".ant-table-thead th", { hasText: /^Ejes$/ })).toHaveCount(1);
    expect(new Set(rows.map((r) => r.index)).size).toBe(rows.length); // no topic twice
    await expect(page.getByTestId("axis-topics-note")).toContainText("2 ejes elegidos");
  });

  test("the control of the filter lists the 246 axes by document and the chosen ones come from the URL", async ({ page }) => {
    await open(page, "axis=98");
    const select = page.getByTestId("filters").locator(".ant-select").filter({ has: page.locator("input[aria-label='Eje Temático']") });
    await expect(select).toBeVisible();
    await expect(select).toContainText(dataset.axes[98].eje.slice(0, 25));
    expect(dataset.axes).toHaveLength(246);
  });

  test("cards against table in 5 real axes: the difference (products linked by a pair whose main topic is not a topic of the axis) is reported and not adjusted", async () => {
    const counts = new Map();
    for (const f of real.facts) for (const [a, code] of f[12]) if (code <= 1) counts.set(a, (counts.get(a) || 0) + 1);
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const pick = [0, 0.15, 0.4, 0.7, 1].map((p) => ranked[Math.min(ranked.length - 1, Math.floor(ranked.length * p))][0]);
    const out = [];
    for (const id of pick) {
      const r = computeCapacity(dataset, { axisIds: [id] });
      const sum = rankAxisTopics(dataset, r).reduce((a, x) => a + x.products, 0);
      expect(sum).toBeLessThanOrEqual(r.products);
      out.push(`${id}: cards ${r.products}, table ${sum}, difference ${r.products - sum}`);
    }
    console.log(`[live] ${out.join(" | ")}`);
  });
});
