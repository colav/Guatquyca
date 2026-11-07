/*
 * F64 (D-166): chain of filters Ámbito → Documento de política → Eje Temático. In Board 1 the scope is the level of the policy
 * document, so a scope limits the documents listed and the axes of those documents; a document limits its axes (F61); with
 * an axis chosen the scope and the document do not restrict the products and only limit the lists (D-163); when a change leaves
 * the filter below out, it is cleared; an inconsistent URL drops the upper filters. In Boards 2 and 3 the scope is a property of
 * the product (geography of the co-authors), not of the document, so the chain there is Documento → Eje (F61) only.
 * The first block needs no server; the second reads the real quyca and the dev server (one run) with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset, docsInScope, reconcileChain, scopeChangePatch } from "../../lib/observatories/capacity";
import { parseFilters } from "../../lib/observatories/filters";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const fact = (topic, pairs) => [topic, 2022, 1, 0, 0, 0, [0], [], [0], [0], [], [], pairs, [], 1];
const topic = (id, link) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link });
const axis = (id, agenda, nivel) => ({ id, clave: `K${id}`, eje: `Eje ${id}`, agenda, nivel, meta: "M" });
const raw = {
  meta: {},
  topics: [topic("T1", [[0, 5, 0]]), topic("T2", [[1, 5, 0]]), topic("T3", [[2, 5, 0]])],
  ejes: [axis(0, "Doc Local", "Local"), axis(1, "Doc Nacional", "Nacional"), axis(2, "Doc Nacional B", "Nacional")],
  facts: [fact(0, [[0, 0]]), fact(1, [[1, 0]]), fact(1, [[1, 0]]), fact(2, [[2, 0]])],
  groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100]], inst_lider: ["Inst"], ref_nacional: [0, 1, 2],
};
const ds = createDataset(raw);

test.describe("chain Ámbito → Documento → Eje in Board 1 (no server)", () => {
  test("a scope limits the documents listed", () => {
    expect(docsInScope(ds, "").sort()).toEqual(["Doc Local", "Doc Nacional", "Doc Nacional B"]);
    expect(docsInScope(ds, "Nacional").sort()).toEqual(["Doc Nacional", "Doc Nacional B"]);
    expect(docsInScope(ds, "Local")).toEqual(["Doc Local"]);
    expect(docsInScope(ds, "Internacional")).toEqual([]);
  });

  test("a change of scope clears the document and the axes that no longer belong to it", () => {
    expect(scopeChangePatch(ds, { policyDoc: "Doc Local", axisIds: [] }, "Nacional")).toEqual({ scope: "Nacional", policyDoc: "" });
    expect(scopeChangePatch(ds, { policyDoc: "Doc Nacional", axisIds: [1] }, "Nacional")).toEqual({ scope: "Nacional" }); // it still belongs
    expect(scopeChangePatch(ds, { policyDoc: "", axisIds: [0, 1] }, "Nacional")).toEqual({ scope: "Nacional", axisIds: [1] }); // the axis 0 is Local
    expect(scopeChangePatch(ds, { policyDoc: "Doc Local", axisIds: [0] }, "")).toEqual({ scope: "" }); // «all» clears nothing
  });

  test("with an axis chosen the scope does not restrict the products (D-163)", () => {
    expect(computeCapacity(ds, {}).products).toBe(4);
    expect(computeCapacity(ds, { scope: "Local" }).products).toBe(1);
    expect(computeCapacity(ds, { scope: "Local", axisIds: [1] }).products).toBe(2); // the axis commands: its products, whatever the scope
    expect(computeCapacity(ds, { scope: "Local", policyDoc: "Doc Local", axisIds: [2] }).products).toBe(1);
    expect(computeCapacity(ds, { scope: "Nacional", policyDoc: "Doc Nacional" }).products).toBe(2); // without axes both restrict
  });

  test("an inconsistent URL: the axes win, then the lower filter is cleared", () => {
    const f = (q) => parseFilters(new URLSearchParams(q));
    expect(reconcileChain(ds, f("scope=Local&axis=1"))).toEqual({ scope: "" }); // the axis is Nacional
    expect(reconcileChain(ds, f("scope=Local&doc=Doc+Nacional&axis=1"))).toEqual({ scope: "" }); // axis 1 is of that document: only the scope goes
    expect(reconcileChain(ds, f("scope=Local&doc=Doc+Nacional"))).toEqual({ policyDoc: "" }); // no axes: the lower one is cleared
    expect(reconcileChain(ds, f("doc=Doc+Local&axis=1"))).toEqual({ policyDoc: "" });
    expect(reconcileChain(ds, f("scope=Nacional&doc=Doc+Nacional&axis=1"))).toBeNull();
    expect(reconcileChain(ds, f(""))).toBeNull();
  });
});

test.describe("chain in Board 1 against the real quyca (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("scope Local: the documents and the axes listed; a change clears; the URL; the products with an axis", async ({ page, request }) => {
    test.setTimeout(250000);
    const b1 = await (await request.get(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const dataset = createDataset(b1);
    const local = docsInScope(dataset, "Local");
    console.log(`[live] documents of scope Local: ${local.join(" | ")}`);
    expect(local.sort()).toEqual(["PDD mpal Medellín", "Plan Decenal CTI Medellín 2024-2033"]);
    const options = async (label) => {
      const sel = page.getByTestId("filters").locator("label", { hasText: label }).first().locator("xpath=../..").locator(".ant-select-selector").first();
      await sel.click();
      await page.waitForTimeout(400);
      const items = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      return items;
    };
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-1?scope=Local");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    expect((await options("Documento de política")).sort()).toEqual(local);
    // the axes listed are the ones of the two documents (open the list and read the groups)
    const axisSel = page.getByTestId("filters").locator(".ant-select").filter({ has: page.locator("input[aria-label='Eje Temático']") }).locator(".ant-select-selector");
    await axisSel.click();
    await page.keyboard.type("Seguridad");
    await page.waitForTimeout(400);
    const shown = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts();
    await page.keyboard.press("Escape");
    const expectedLocalAxes = new Set(dataset.axes.filter((e) => e.nivel === "Local").map((e) => e.eje));
    console.log(`[live] axes of scope Local offered for «Seguridad»: ${shown.length}`);
    expect(shown.every((t) => expectedLocalAxes.has(t))).toBe(true);
    // a document of another level in the URL with the scope: the lower filter is cleared
    await page.goto("/observatories/vri-udea/board-1?scope=Local&doc=CONPES+4069");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    expect(page.url()).not.toContain("doc=");
    expect(page.url()).toContain("scope=Local");
    // an axis of another level in the URL: the axis wins and the scope goes
    const national = dataset.axes.find((e) => e.nivel === "Nacional");
    await page.goto(`/observatories/vri-udea/board-1?scope=Local&axis=${national.id}`);
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    expect(page.url()).not.toContain("scope=");
    expect(page.url()).toContain(`axis=${national.id}`);
    const all = computeCapacity(dataset, { axisIds: [national.id] }).products;
    expect(computeCapacity(dataset, { scope: "Local", axisIds: [national.id] }).products).toBe(all); // the axis commands
    await expect(page.locator(".obs-kpi").filter({ hasText: "productos (artículos" }).first()).toContainText(all.toLocaleString("es-CO"));
    console.log(`[live] axis ${national.id} of scope Nacional with scope Local in the URL: ${all} products (the axis alone)`);
  });
});
