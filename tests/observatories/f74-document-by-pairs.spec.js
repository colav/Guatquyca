/*
 * F74 (D-177): the filter «Documento de política» (and the scope of Board 1, the level of the document) delimits the products by
 * the union of the pairs product–axis (high or medium confidence, or the level of the control of confidence of Board 1) of the axes of
 * the document, in Boards 1 and 2; Board 3 keeps its mask. The link topic–axis (included or frontier) no longer decides the
 * membership. The first block needs no server; the second reads the real quyca (one run) with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { computeFoundations, createFoundationsDataset, DEFAULT_FOUNDATIONS_FILTERS } from "../../lib/observatories/foundations";
import { DOCUMENT_FILTER_HELP as HELP1 } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { DOCUMENT_FILTER_HELP as HELP2 } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { DOCUMENT_FILTER_HELP as HELP3 } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* Board 1: topics T1 (linked to the axis 0 as included and frontier), T2 (linked to the axis 1). */
const fact = (topic, pairs) => [topic, 2022, 1, 0, 0, 0, [0], [], [0], [0], [], [], pairs, [], 1];
const topic = (id, link) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link });
const axis = (id, agenda, nivel) => ({ id, clave: `K${id}`, eje: `Eje ${id}`, agenda, nivel, meta: "M" });
const raw1 = {
  meta: {},
  topics: [topic("T1", [[0, 5, 0]]), topic("T2", [[0, 3, 1], [1, 4, 0]]), topic("T3", [])],
  ejes: [axis(0, "Doc A", "Local"), axis(1, "Doc B", "Nacional")],
  facts: [
    fact(0, [[0, 0]]), //  topic of A, pair high with A: counts
    fact(1, []), //        topic linked to A (frontier) but no pair: does NOT count any more
    fact(1, [[0, 1]]), //  pair medium with A: counts
    fact(2, [[0, 0]]), //  topic with no link at all but a pair with A: counts
    fact(0, [[0, 2]]), //  pair low with A: only with «Incluir baja»
    fact(2, [[1, 0]]), //  pair with B
  ],
  groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100]], inst_lider: ["Inst"], ref_nacional: [0, 1, 2],
};
const ds1 = createDataset(raw1);

/* Board 2: works with a primary topic and pairs. */
const work = (topic) => [2022, 0, 0, 0, [], [], [], [], [], [], 0, 0, topic];
const raw2 = {
  sectors: ["academic", "company", "government", "nonprofit", "healthcare"], sectorsEs: ["A", "E", "G", "S", "H"], tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
  regions: [], countries: [], insts: [], depts: ["Antioquia"], groups: [], centros: [], deps: [], facs: [], subfields: [], sfField: [], subregs: [], doms: [], projects: [],
  works: [work(0), work(0), work(1), work(-1)],
  thesaurus: {
    agendas: [{ name: "Doc A", topics: [0] }, { name: "Doc B", topics: [1] }],
    ejes: [
      { id: 1, agenda: "Doc A", clave: "a", eje: "A", nivel: "N", topics: [0], direct: [0, 2, 3], direct_conf: [0, 1, 2] }, // works 0 (high), 2 (medium), 3 (low)
      { id: 2, agenda: "Doc B", clave: "b", eje: "B", nivel: "N", topics: [1], direct: [2], direct_conf: [0] },
    ],
  },
};
const ds2 = createCollaborationDataset(raw2);

test.describe("document by pairs (no server)", () => {
  test("Board 1: a product counts with a pair of its axes, not with the linked topic; the level of confidence of the board decides", () => {
    expect(computeCapacity(ds1, {}).products).toBe(6);
    expect(computeCapacity(ds1, { policyDoc: "Doc A" }).products).toBe(3); // facts 0, 2 and 3; not the one with the linked topic and no pair
    expect(computeCapacity(ds1, { policyDoc: "Doc A", pairLevel: "all" }).products).toBe(4); // with «Incluir baja»
    expect(computeCapacity(ds1, { policyDoc: "Doc B" }).products).toBe(1);
  });

  test("Board 1: the scope (level of the document) uses the same rule; with an axis chosen neither restricts", () => {
    expect(computeCapacity(ds1, { scope: "Local" }).products).toBe(3);
    expect(computeCapacity(ds1, { scope: "Nacional" }).products).toBe(1);
    expect(computeCapacity(ds1, { scope: "Local", policyDoc: "Doc A" }).products).toBe(3);
    expect(computeCapacity(ds1, { scope: "Local", axisIds: [1] }).products).toBe(1); // the axis commands
    expect(computeCapacity(ds1, { policyDoc: "Doc A", yearFrom: 2023, yearTo: 2026 }).products).toBe(0); // «y» with the years
  });

  test("Board 1: the panels by topic add up (the topics of the document are the ones of its products)", () => {
    const r = computeCapacity(ds1, { policyDoc: "Doc A" });
    const sum = r.units.reduce((a, u) => a + u.products, 0);
    expect(sum).toBe(r.products);
    // the topic T2 is linked to A but its product without pair is out: it shows no production
    expect(r.units.find((u) => u.id === "T2").products).toBe(1); // only the one with the medium pair
  });

  test("Board 2: a work counts with a pair of high or medium confidence with an axis of the document, not with the primary topic", () => {
    expect(computeCollaboration(ds2, {}).kpis.works).toBe(4);
    expect(computeCollaboration(ds2, { policyDoc: "Doc A" }).kpis.works).toBe(2); // works 0 and 2; the low pair (3) and the work 1 (topic of A, no pair) are out
    expect(computeCollaboration(ds2, { policyDoc: "Doc B" }).kpis.works).toBe(1);
    expect(computeCollaboration(ds2, { policyDoc: "Doc A", axisId: 2 }).kpis.works).toBe(1); // with an axis chosen the document does not restrict
  });

  test("the texts say that the document delimits the products by the axes the panel assigned", () => {
    for (const text of [HELP1, HELP2, HELP3]) {
      expect(text).toContain("el panel de jueces asignó a alguno de sus ejes");
      expect(text).toContain("Un producto sin eje asignado no cuenta");
    }
    expect(HELP1).toContain("Confianza de la asignación a ejes");
    expect(HELP3).toContain("no tiene control de confianza");
  });
});

test.describe("document by pairs against the real quyca (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("the 8 documents: T1 and T2 give the same publications as the mask of the T3; CONPES 4144 = 1.651", async ({ request, page }) => {
    test.setTimeout(250000);
    const get = async (n) => (await request.get(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();
    const [b1, b2, b3] = [await get(1), await get(2), await get(3)];
    for (const p of b3.P) if (p[0] === 0) p[0] = null;
    const d1 = createDataset(b1);
    const d2 = createCollaborationDataset({ ...b2, funders: b2.ext.funders });
    const d3 = createFoundationsDataset({ ...b3, artes: { ...b3.artes, prof: b3.artes.prof.map(({ id, ...r }) => r) } });
    const estimate = { "PDD dptal Antioquia": 14108, "CONPES 4069": 11725, "PDD mpal Medellín": 10181, "Plan Decenal CTI Medellín 2024-2033": 10083, "Misión de sabios 2019": 6630, "Marco UNESCO de Educación Cultural y Artística 2025": 2252, "CONPES 4144": 1651, "OECD STI Outlook 2025": 922 };
    const rows = [];
    for (const doc of d2.policyDocs) {
      const t1 = computeCapacity(d1, { policyDoc: doc }).products;
      const t2 = computeCollaboration(d2, { policyDoc: doc }).kpis.works;
      const bit = 1 << b3.agendas_all.indexOf(doc);
      const t3pubs = b3.P.filter((p) => p[3] & bit && p[1] <= 2).length;
      const t3 = computeFoundations(d3, { ...DEFAULT_FOUNDATIONS_FILTERS, policyIndex: b3.agendas_all.indexOf(doc) }).tiles.products;
      rows.push([doc, t1, t2, t3pubs, t3]);
      expect(Math.abs(t1 - estimate[doc]), `${doc} T1 against the estimate`).toBeLessThanOrEqual(1);
      expect(t1).toBe(t2); // T1 and T2 agree exactly
      expect(Math.abs(t1 - t3pubs), `${doc} T1 against the publications of T3`).toBeLessThanOrEqual(1);
    }
    console.log(`[live] ${rows.map((r) => r.join(" ")).join(" | ")}`);
    const conpes = rows.find((r) => r[0] === "CONPES 4144");
    expect(conpes.slice(1)).toEqual([1651, 1651, 1651, 2942]);
    // scopes of Board 1: Departamental is the document PDD dptal Antioquia
    expect(computeCapacity(d1, { scope: "Departamental" }).products).toBe(14108);
    // the page: CONPES 4144 in the KPI of Board 1 and the help of the filter
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-1?doc=CONPES+4144");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(page.locator(".obs-kpi").filter({ hasText: "productos (artículos" }).first()).toContainText("1.651");
    await page.goto("/observatories/vri-udea/board-2?doc=CONPES+4144");
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(page.locator(".obs-kpi").first()).toContainText("1.651");
  });
});
