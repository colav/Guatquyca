/*
 * F51b / F51c (D-148): column «Vínculo con el eje» of the table of topics of the axis (Incluido green, Frontera
 * orange, «—» without state) and the tag «Por productos» (geekblue) of the row «Otros productos asignados al eje».
 * The first block needs no server; the second reads the real quyca and the dev server of Luis (D-100) and only runs
 * with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { axisTopicsOther, computeCapacity, createDataset, rankAxisTopics } from "../../lib/observatories/capacity";

const fact = (topic, year, citations, pairs) => [topic, year, citations, 0, 0, 0, [0], [], [0], [0], [], [], pairs, [], 1];
const topic = (id, link) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link });
const axis = (id, eje) => ({ id, clave: `K${id}`, eje, agenda: "Doc", nivel: "Nacional", meta: "Goal" });
const mk = (links) => createDataset({
  meta: {},
  topics: [topic("T1", links[0]), topic("T2", links[1]), topic("T3", links[2])],
  ejes: [axis(0, "Eje A"), axis(1, "Eje B")],
  facts: [fact(0, 2022, 1, [[0, 0]]), fact(1, 2022, 1, [[0, 0]]), fact(2, 2022, 1, [[0, 0], [1, 0]])],
  groups: [["G0", "Grupo 0", "A1", 1]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100]], inst_lider: ["Inst"], ref_nacional: [0, 1, 2],
});

test.describe("F51b (no server)", () => {
  test("the state of each topic comes from link[2]: 0 included, 1 frontier, null when the bundle does not carry it; with two axes the lower one", () => {
    const ds = mk([[[0, 5, 0]], [[0, 3, 1]], [[0, 2, 1], [1, 2, 0]]]);
    const rows = rankAxisTopics(ds, computeCapacity(ds, { axisIds: [0] }));
    expect(Object.fromEntries(rows.map((r) => [r.id, r.state]))).toEqual({ T1: 0, T2: 1, T3: 1 });
    const two = rankAxisTopics(ds, computeCapacity(ds, { axisIds: [0, 1] }));
    expect(two.find((r) => r.id === "T3").state).toBe(0); // included in the axis 1
    const old = mk([[[0, 5]], [[0, 3]], [[0, 2]]]);
    expect(rankAxisTopics(old, computeCapacity(old, { axisIds: [0] })).every((r) => r.state === null)).toBe(true);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const PAGE = (q) => `/observatories/vri-udea/board-1?${q}`;
const fmt = (n) => n.toLocaleString("es-CO");

test.describe("F51b / F51c against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let real;
  let dataset;
  test.beforeAll(async () => {
    real = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    dataset = createDataset(real);
  });
  const open = async (page, q) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE(q));
    await expect(page.getByTestId("axis-topics-note")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(800);
  };
  const tags = (page, color) => page.locator(".ant-table-tbody .ant-tag-" + color);

  test("axis 67 (CON|D-B01): 71 topics, 22 included and 49 frontier, with and without years", async ({ page }) => {
    const id = real.ejes.find((e) => e.clave === "CON|D-B01").id;
    expect(id).toBe(67);
    for (const years of [{}, { yearFrom: 2021, yearTo: 2025 }]) {
      const rows = rankAxisTopics(dataset, computeCapacity(dataset, { axisIds: [67], ...years }));
      expect(rows).toHaveLength(71);
      expect(rows.filter((r) => r.state === 0)).toHaveLength(22);
      expect(rows.filter((r) => r.state === 1)).toHaveLength(49);
    }
    await open(page, "axis=67");
    await expect(page.locator(".ant-table-thead th", { hasText: "Vínculo con el eje" })).toHaveCount(1);
    // the table scrolls (virtual body keeps all rows in the DOM with antd 5 small tables): count the tags
    await expect(tags(page, "green")).toHaveCount(22);
    await expect(tags(page, "orange")).toHaveCount(49);
    await open(page, "axis=67&from=2021&to=2025");
    await expect(tags(page, "green")).toHaveCount(22);
    await expect(tags(page, "orange")).toHaveCount(49);
  });

  test("header filter and sort of the column; the row «Por productos» is last, with its tag and tooltip, and follows the filter", async ({ page }) => {
    await open(page, "axis=98");
    const result = computeCapacity(dataset, { axisIds: [98] });
    const rows = rankAxisTopics(dataset, result);
    const other = axisTopicsOther(result, rows);
    await expect(page.getByTestId("axis-topics-other-link")).toHaveText("Por productos");
    expect(await page.getByTestId("axis-topics-other-link").evaluate((el) => el.className)).toContain("geekblue");
    await page.getByTestId("axis-topics-other-link").hover();
    await expect(page.getByText("Estos productos no tienen como tópico principal ninguno de los tópicos del eje.", { exact: false })).toBeVisible();
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(4423));
    expect(rows.reduce((a, r) => a + r.products, 0) + other.products).toBe(4423);
    expect(rows.reduce((a, r) => a + r.products, 0)).toBe(2357);
    // filter by Frontera
    const th = page.locator(".ant-table-thead th", { hasText: "Vínculo con el eje" });
    await th.locator(".ant-table-filter-trigger").click();
    await page.locator(".ant-table-filter-dropdown").getByText("Frontera", { exact: true }).click();
    await page.locator(".ant-table-filter-dropdown").getByRole("button", { name: /Aceptar|OK/ }).click();
    const frontier = rows.filter((r) => r.state === 1);
    await expect(tags(page, "green")).toHaveCount(0);
    await expect(tags(page, "orange")).toHaveCount(frontier.length);
    await expect(page.getByTestId("axis-topics-other")).toHaveCount(0); // «Por productos» left out of the filter
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(frontier.reduce((a, r) => a + r.products, 0)));
    // add «Por productos» to the filter: the row comes back
    await th.locator(".ant-table-filter-trigger").click();
    await page.locator(".ant-table-filter-dropdown").getByText("Por productos", { exact: true }).click();
    await page.locator(".ant-table-filter-dropdown").getByRole("button", { name: /Aceptar|OK/ }).click();
    await expect(page.getByTestId("axis-topics-other")).toHaveCount(1);
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(frontier.reduce((a, r) => a + r.products, 0) + other.products));
  });

  test("sorting by the column puts the included before the frontier; the default order does not change", async ({ page }) => {
    await open(page, "axis=67");
    const first = await page.locator(".ant-table-tbody tr.ant-table-row").first().innerText();
    const rows = rankAxisTopics(dataset, computeCapacity(dataset, { axisIds: [67] }));
    expect(first).toContain(rows[0].label); // by products, descending
    await page.locator(".ant-table-thead th", { hasText: "Vínculo con el eje" }).click();
    const firstTag = page.locator(".ant-table-tbody tr.ant-table-row").first().locator(".ant-tag");
    await expect(firstTag).toHaveText("Incluido");
    await expect(page.getByTestId("axis-topics-other")).toHaveCount(1);
  });
});

test.describe("F51b centring and wording (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("the tags of the column are centred in it and the tooltip of «Por productos» says «nuestra metodología»", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE("axis=67"));
    await expect(page.getByTestId("axis-topics-note")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(800);
    const centred = async (tag) => {
      const t = await tag.boundingBox();
      const c = await tag.locator("xpath=ancestor::*[self::td or self::th][1]").boundingBox();
      return Math.abs(t.x + t.width / 2 - (c.x + c.width / 2));
    };
    expect(await centred(page.locator(".ant-table-tbody .ant-tag-green").first())).toBeLessThan(2);
    expect(await centred(page.getByTestId("axis-topics-other-link"))).toBeLessThan(2);
    // F51b: every tag has the same width, the one the text «Por productos» takes (no wrap, one line)
    const widths = await page.locator(".ant-table-tbody .ant-tag, [data-testid='axis-topics-other-link']").evaluateAll((els) => [...new Set(els.map((e) => Math.round(e.getBoundingClientRect().width * 10) / 10))]);
    expect(widths).toHaveLength(1);
    expect(await page.getByTestId("axis-topics-other-link").evaluate((e) => e.getBoundingClientRect().height)).toBeLessThan(26);
    await page.getByTestId("axis-topics-other-link").hover();
    const tip = page.locator(".ant-tooltip:visible");
    await expect(tip).toContainText("Nuestra metodología los asigna al eje");
    expect(await tip.innerText()).not.toContain("La IA");
  });
});
