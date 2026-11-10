/*
 * F61 (D-163): axis and document in the filter of Eje Temático. (1) With a document chosen, the list of axes shows only the
 * axes of that document (Boards 1 and 2). (2) With an axis chosen, the document no longer restricts the products: it only
 * limits the list of axes (axis 98 with its own document = the axis alone). (3) Invalid combination: from the interface the
 * axis (Board 2) or the axes of other documents (Board 1) are cleared when the document changes; from the URL the axis wins
 * and the document is dropped. The first block needs no server; the second reads the real quyca and the dev server of Luis
 * (one run) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { computeCollaboration, createCollaborationDataset, parseCollabFilters, reconcileAxisDocument } from "../../lib/observatories/collaboration";
import { axesOutsideDocument, computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { AXIS_FILTER_NOTE } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { AXIS_FILTER_TOOLTIP } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* ---- Board 2 dataset (same shape as the one of F59) ---- */
const work = (year, type, topic) => [year, type, 0, 0, [], [], [], [], [], [], 0, 0, topic];
const raw2 = {
  sectors: ["academic", "company", "government", "nonprofit", "healthcare"],
  sectorsEs: ["Academia", "Empresa", "Gobierno", "Sin ánimo de lucro", "Salud"],
  tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
  regions: ["A", "B", "C", "D", "E", "F", "G", "H"],
  countries: [], insts: [{ n: "I", s: 1, c: "" }], depts: ["Antioquia"], groups: [{ id: "G0", n: "Grupo 0", c: -1, d: 0 }], centros: [], deps: [],
  subfields: ["S"], sfField: ["F"], subregs: [], doms: [], funders: [],
  works: [work(2022, 0, 0), work(2023, 0, 0), work(2023, 1, 5), work(0, 3, 0), work(2021, 0, 7), work(2024, 2, 1)],
  projects: [],
  thesaurus: {
    agendas: [{ name: "D1", topics: [0] }, { name: "D2", topics: [1] }],
    ejes: [
      { id: 1, agenda: "D1", clave: "D1|A", eje: "Eje A", nivel: "N", topics: [0], direct: [0, 1, 2, 4], direct_conf: [0, 1, 2, 0] },
      { id: 2, agenda: "D2", clave: "D2|B", eje: "Eje B", nivel: "N", topics: [1], direct: [5], direct_conf: [0] },
    ],
  },
};
const ds2 = createCollaborationDataset(raw2);
const run2 = (f) => computeCollaboration(ds2, f);

/* ---- Board 1 dataset (same shape as the one of F49) ---- */
const fact = (topic, year, citations, pairs) => [topic, year, citations, 0, 0, 0, [0], [], [0], [0], [], [], pairs, [], 1];
const topic = (id, link) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link });
const axis = (id, eje, agenda) => ({ id, clave: `K${id}`, eje, agenda, nivel: "Nacional", meta: "Goal" });
const raw1 = {
  meta: {},
  topics: [topic("T1", [[0, 5]]), topic("T2", [[1, 3]]), topic("T3", [[0, 2], [1, 2]]), topic("T4", [])],
  ejes: [axis(0, "Eje A", "Doc A"), axis(1, "Eje B", "Doc B")],
  facts: [
    fact(0, 2022, 10, [[0, 0]]), // topic of A, pair with A
    fact(0, 2023, 20, [[0, 1]]), // topic of A, pair with A (medium)
    fact(1, 2022, 7, [[1, 0]]), //  topic of B, pair with B
    fact(2, 2025, 3, [[0, 0], [1, 0]]), // topics of both, both pairs
    fact(3, 2024, 40, [[0, 0]]), // no topic of any document, pair with A
    fact(1, 2024, 9, []), //       topic of B, no pair
  ],
  groups: [["G0", "Grupo 0", "A1"]],
  cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100], [3, 1, 0, 5, 100]],
  inst_lider: ["Inst"],
  ref_nacional: [0, 1, 2, 3],
};
const ds1 = createDataset(raw1);
const run1 = (f) => computeCapacity(ds1, f);

test.describe("axis and document, model (no server)", () => {
  test("Board 2: with a known axis the document no longer restricts the products", () => {
    expect(run2({ axisId: 1 }).kpis.works).toBe(3);
    expect(run2({ axisId: 1, policyDoc: "D1" }).kpis.works).toBe(3); // its own document: the axis alone (before: 2)
    expect(run2({ axisId: 1, policyDoc: "D2" }).kpis.works).toBe(3); // another document: the axis wins
    expect(run2({ policyDoc: "D1" }).kpis.works).toBe(3); // without axis the document still restricts (by primary topic)
    expect(run2({ axisId: 99, policyDoc: "D1" }).kpis.works).toBe(run2({ policyDoc: "D1" }).kpis.works); // unknown axis: ignored
    expect(run2({ axisId: 1, policyDoc: "D1", yearFrom: 2023, yearTo: 2023 }).kpis.works).toBe(1); // the other filters still apply
  });

  test("Board 2: an invalid combination from the URL drops the document and keeps the axis", () => {
    const url = (q) => parseCollabFilters(new URLSearchParams(q));
    expect(reconcileAxisDocument(ds2, url("doc=D2&axis=1"))).toEqual({ policyDoc: "" });
    expect(reconcileAxisDocument(ds2, url("axis=1&doc=D2"))).toEqual({ policyDoc: "" });
    expect(reconcileAxisDocument(ds2, url("doc=D1&axis=1"))).toBeNull(); // consistent
    expect(reconcileAxisDocument(ds2, url("doc=D1"))).toBeNull(); // no axis
    expect(reconcileAxisDocument(ds2, url("axis=1"))).toBeNull(); // no document
    expect(reconcileAxisDocument(ds2, url("doc=D1&axis=99"))).toBeNull(); // unknown axis: nothing to decide
  });

  test("Board 2: the list of axes of a document and the axes that a change of document clears (the lists the control shows)", () => {
    const byDoc = (doc) => ds2.axisGroups.filter((g) => g.agenda === doc).flatMap((g) => g.axes.map((a) => a.id));
    expect(byDoc("D1")).toEqual([1]);
    expect(byDoc("D2")).toEqual([2]);
    expect(ds2.axisGroups.flatMap((g) => g.axes.map((a) => a.id))).toEqual([1, 2]); // no document: all
    // the control clears the axis when the new document is not its own
    expect(ds2.axisById.get(1).agenda !== "D2").toBe(true);
    expect(ds2.axisById.get(1).agenda !== "D1").toBe(false);
  });

  test("Board 1: with axes chosen the document does not restrict the products; without axes it does", () => {
    expect(run1({ axisIds: [0] }).products).toBe(4); // facts 0, 1, 3, 4
    expect(run1({ axisIds: [0], policyDoc: "Doc A" }).products).toBe(4); // its own document: the axis alone (before: 3, the topics of the document)
    expect(run1({ axisIds: [0], policyDoc: "Doc B" }).products).toBe(4); // another document: the axis wins
    expect(run1({ axisIds: [0, 1], policyDoc: "Doc A" }).products).toBe(run1({ axisIds: [0, 1] }).products);
    expect(run1({ policyDoc: "Doc A" }).products).toBe(4); // without axes: the pairs with the axes of the document (facts 0, 1, 3, 4) (F74: before, the linked topics: 3)
    expect(run1({ policyDoc: "Doc A" }).products).toBeLessThan(run1({}).products);
  });

  test("Board 1: the axes that are not of the document (to clear them on a change, or to drop the document from the URL)", () => {
    expect(axesOutsideDocument(ds1, { policyDoc: "Doc B", axisIds: [0, 1] })).toEqual([0]);
    expect(axesOutsideDocument(ds1, { policyDoc: "Doc A", axisIds: [0] })).toEqual([]);
    expect(axesOutsideDocument(ds1, { policyDoc: "", axisIds: [0] })).toEqual([]);
    expect(axesOutsideDocument(ds1, { policyDoc: "Doc A", axisIds: [] })).toEqual([]);
    expect(axesOutsideDocument(ds1, { policyDoc: "Doc A", axisIds: [77] })).toEqual([]); // unknown id: not decided
  });

  test("the notes carry the new sentence", () => {
    expect(AXIS_FILTER_NOTE).toContain("El documento solo limita los ejes disponibles.");
    expect(AXIS_FILTER_TOOLTIP).toContain("El documento solo limita los ejes disponibles.");
  });
});

/* ---- Real quyca ---- */
const open2 = "/observatories/vri-udea/board-2";
const open1 = "/observatories/vri-udea/board-1";
const fmt = (n) => n.toLocaleString("es-CO");

test.describe("axis and document against the real quyca (read-only, one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let b1;
  let b2;
  let d1;
  let d2;
  test.beforeAll(async () => {
    b2 = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    d2 = createCollaborationDataset(b2);
    b1 = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    d1 = createDataset(b1);
  });

  const kpi2 = async (page) => Number((await page.locator(".obs-kpi").first().innerText()).split("\n").pop().replace(/\./g, ""));
  const kpi1 = async (page) => Number((await page.locator(".obs-kpi").filter({ hasText: "productos con tópico (artículos" }).first().innerText()).split("\n").pop().replace(/\./g, ""));
  const groupsOf = async (page, wrapper) => {
    await wrapper.click();
    await page.waitForTimeout(400);
    const groups = await page.locator(".ant-select-dropdown:visible .ant-select-item-group").allTextContents();
    await page.keyboard.press("Escape");
    return groups;
  };
  const searchCount = async (page, wrapper, text) => {
    await wrapper.click();
    await page.keyboard.type(text);
    await page.waitForTimeout(400);
    const n = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").count();
    await page.keyboard.press("Escape");
    return n;
  };
  const doc2 = (page) => page.locator("label", { hasText: "Documento de política" }).locator("xpath=../..").locator(".ant-select-selector");
  const chooseDoc = async (page, selector, name) => {
    await selector.click();
    await page.locator(".ant-select-dropdown:visible .ant-select-item-option", { hasText: name }).first().click();
    await page.waitForTimeout(700);
  };

  test("figures of the model against the bundle: axis 98 with its document = 4.423; CONPES 4144 and a PDD axis", () => {
    const own = d2.axisById.get(98).agenda;
    const alone = computeCollaboration(d2, { axisId: 98 }).kpis.works;
    expect(alone).toBe(4423);
    expect(computeCollaboration(d2, { axisId: 98, policyDoc: own }).kpis.works).toBe(4423);
    const pdd = b2.thesaurus.ejes.find((e) => e.agenda === "PDD mpal Medellín" && /Determinantes sociales de la salud/.test(e.eje));
    const conpes = computeCollaboration(d2, { policyDoc: "CONPES 4144" }).kpis.works;
    const both = computeCollaboration(d2, { policyDoc: "CONPES 4144", axisId: pdd.id }).kpis.works;
    const axisOnly = computeCollaboration(d2, { axisId: pdd.id }).kpis.works;
    expect(both).toBe(axisOnly);
    console.log(`[live] T2: eje 98 solo ${alone}; con su documento (${own}) ${computeCollaboration(d2, { axisId: 98, policyDoc: own }).kpis.works}; CONPES 4144 ${conpes}; eje ${pdd.id} (${pdd.eje}) solo ${axisOnly}; con CONPES 4144 ${both}`);
    // Board 1: the same cases
    const t1own = d1.axes.find((e) => e.id === 98).agenda;
    expect(computeCapacity(d1, { axisIds: [98], policyDoc: t1own }).products).toBe(computeCapacity(d1, { axisIds: [98] }).products);
    console.log(`[live] T1: eje 98 solo ${computeCapacity(d1, { axisIds: [98] }).products}; con su documento ${computeCapacity(d1, { axisIds: [98], policyDoc: t1own }).products}; CONPES 4144 solo ${computeCapacity(d1, { policyDoc: "CONPES 4144" }).products}`);
  });

  test("Board 2 in the page: both orders and the URL (the case of Luis)", async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const pdd = b2.thesaurus.ejes.find((e) => e.agenda === "PDD mpal Medellín" && /Determinantes sociales de la salud/.test(e.eje));
    const axisSel = () => page.getByTestId("axis-filter").locator(".ant-select-selector");
    const alone = computeCollaboration(d2, { axisId: pdd.id }).kpis.works;
    const conpes = computeCollaboration(d2, { policyDoc: "CONPES 4144" }).kpis.works;

    // order 1: the document, then the list is only the document's, then the axis of another document is not offered
    await page.goto(open2);
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await chooseDoc(page, doc2(page), "CONPES 4144");
    expect(await kpi2(page)).toBe(conpes);
    expect(await groupsOf(page, axisSel())).toEqual(["CONPES 4144"]);
    // order 2: the axis (list of all the documents), then a document that is not its own clears the axis
    await page.goto(`${open2}?axis=${pdd.id}`);
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await page.waitForTimeout(800);
    expect(await kpi2(page)).toBe(alone);
    /* the list is as high as the one of Board 1 (F62) and shows one group at a time: the PDD axis is offered when no document is chosen */
    expect(await searchCount(page, axisSel(), "Determinantes sociales de la salud")).toBeGreaterThan(0);
    /* F75 (D-178, D-163): with an axis chosen the list of documents offers only the document that contains it, so another document cannot be chosen */
    await doc2(page).click();
    await page.waitForTimeout(400);
    expect(await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts()).toEqual(["PDD mpal Medellín"]);
    await page.keyboard.press("Escape");
    expect(await kpi2(page)).toBe(alone);
        // URL: an axis that is not of the document: the axis wins and the document is dropped (the URL is rewritten)
    await page.goto(`${open2}?doc=CONPES+4144&axis=${pdd.id}`);
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await page.waitForTimeout(1200);
    expect(await kpi2(page)).toBe(alone);
    await expect(doc2(page)).not.toContainText("CONPES 4144");
    expect(page.url()).toContain(`axis=${pdd.id}`);
    expect(page.url()).not.toContain("doc=");
    // URL: axis 98 with its document: 4.423
    const own = d2.axisById.get(98).agenda;
    await page.goto(`${open2}?axis=98&doc=${encodeURIComponent(own).replace(/%20/g, "+")}`);
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await page.waitForTimeout(1000);
    expect(await kpi2(page)).toBe(4423);
    await page.getByRole("button", { name: "Ayuda del filtro Eje Temático" }).hover(); // the note of the axis is the help «?» (F77b)
    await expect(page.getByTestId("axis-filter-note")).toContainText("El documento solo limita los ejes disponibles.");
  });

  test("Board 1 in the page: the list of axes is limited to the document, in both orders and from the URL", async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1280, height: 900 });
    const pdd = d1.axes.find((e) => e.agenda === "PDD mpal Medellín" && /Determinantes sociales de la salud/.test(e.eje));
    const wrapper = () => page.getByTestId("filters").locator(".ant-select").filter({ has: page.locator("input[aria-label='Eje Temático']") }).locator(".ant-select-selector");
    const docWrapper = () => page.getByTestId("filters").locator("label", { hasText: "Documento de política" }).locator("xpath=../..").locator(".ant-select-selector");
    const wait = async () => {
      await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1200);
    };

    // order 1: document first
    await page.goto(open1);
    await wait();
    await chooseDoc(page, docWrapper(), "CONPES 4144");
    expect(await groupsOf(page, wrapper())).toEqual(["CONPES 4144"]);
    const conpes = await kpi1(page);
    expect(conpes).toBe(computeCapacity(d1, { policyDoc: "CONPES 4144" }).products);
    // order 2: the axis first, then a document that is not its own removes the axis
    await page.goto(`${open1}?axis=${pdd.id}`);
    await wait();
    const alone = await kpi1(page);
    expect(alone).toBe(computeCapacity(d1, { axisIds: [pdd.id] }).products);
    expect(await searchCount(page, wrapper(), "Determinantes sociales de la salud")).toBeGreaterThan(0); // with no document the axis of the PDD is offered
    /* F75: with an axis chosen the list of documents offers only the document that contains it */
    await docWrapper().click();
    await page.waitForTimeout(400);
    expect(await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts()).toEqual(["PDD mpal Medellín"]);
    await page.keyboard.press("Escape");
        // URL with an invalid combination: the axes win and the document is dropped
    await page.goto(`${open1}?doc=CONPES+4144&axis=${pdd.id}`);
    await wait();
    expect(await kpi1(page)).toBe(alone);
    await expect(docWrapper()).not.toContainText("CONPES 4144");
    expect(page.url()).not.toContain("doc=");
    // axis 98 with its document: the axis alone
    const own = d1.axes.find((e) => e.id === 98).agenda;
    await page.goto(`${open1}?axis=98&doc=${encodeURIComponent(own).replace(/%20/g, "+")}`);
    await wait();
    expect(await kpi1(page)).toBe(computeCapacity(d1, { axisIds: [98] }).products);
    console.log(`[live] T1 en pantalla: CONPES 4144 ${fmt(conpes)}; eje ${pdd.id} solo ${fmt(alone)}; eje 98 con su documento ${fmt(computeCapacity(d1, { axisIds: [98] }).products)}`);
  });
});
