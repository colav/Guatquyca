/*
 * F59 (D-142, D-159, D-160): filter of Eje Temático in Board 2. With an axis chosen a work passes when it has a pair with
 * that axis of high or medium confidence (`thesaurus.ejes[].direct` + `direct_conf` of B120, codes 0 and 1), not by
 * primary topic; it combines with the document of policy, the years, the centre and the units with «y»; the social
 * appropriation and the projects have no pair. The first block needs no server; the second reads the real quyca and the
 * dev server of Luis (one run) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { computeCollaboration, createCollaborationDataset, parseCollabFilters, serializeCollabFilters } from "../../lib/observatories/collaboration";
import { AXIS_FILTER_NOTE, NO_AXIS_RESPONSE } from "../../app/observatories/vri-udea/board-2/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* works: [year, type, subfield, sectorMask, countries[], departments[], faculties[], units[], groups[], institutions[], subregionMask, iap, topic] */
const work = (year, type, topic, faculties = []) => [year, type, 0, 0, [], [], faculties, [], [], [], 0, 0, topic];
const raw = {
  sectors: ["academic", "company", "government", "nonprofit", "healthcare"],
  sectorsEs: ["Academia", "Empresa", "Gobierno", "Sin ánimo de lucro", "Salud"],
  tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
  regions: ["A", "B", "C", "D", "E", "F", "G", "H"],
  countries: [], insts: [{ n: "I", s: 1, c: "" }], depts: ["Antioquia"], groups: [{ id: "G0", n: "Grupo 0", c: -1, d: 0 }], centros: [], deps: [],
  subfields: ["S"], sfField: ["F"], subregs: [], doms: [], funders: [],
  works: [
    work(2022, 0, 0), // 0: pair high with A
    work(2023, 0, 0), // 1: pair medium with A
    work(2023, 1, 5), // 2: pair low with A (does not count)
    work(0, 3, 0), //    3: appropriation, no pair
    work(2021, 0, 7, [1]), // 4: pair high with A, unit 1; its primary topic is not an axis topic
    work(2024, 2, 1), // 5: pair high with B
  ],
  projects: [[2022, 0, 0, [], 0, 0, ""], [2023, 0, 0, [], 0, 0, ""]],
  thesaurus: {
    agendas: [{ name: "D1", topics: [0] }, { name: "D2", topics: [1] }],
    ejes: [
      { id: 1, agenda: "D1", clave: "D1|A", eje: "Eje A", nivel: "N", topics: [0], direct: [0, 1, 2, 4], direct_conf: [0, 1, 2, 0] },
      { id: 2, agenda: "D2", clave: "D2|B", eje: "Eje B", nivel: "N", topics: [1], direct: [5], direct_conf: [0] },
      { id: 3, agenda: "D2", clave: "D2|C", eje: "Eje C", nivel: "N", topics: [], direct: [3 - 3], direct_conf: [2] },
    ],
  },
};
const ds = createCollaborationDataset(raw);
const run = (filters) => computeCollaboration(ds, filters);

test.describe("filter of axis, model (no server)", () => {
  test("a work passes with a pair of high or medium confidence; low confidence and appropriation do not", () => {
    expect(run({}).kpis.works).toBe(6);
    const a = run({ axisId: 1 });
    expect(a.kpis.works).toBe(3); // works 0, 1 and 4: not 2 (low), not 3 (appropriation)
    expect(a.axis).toMatchObject({ id: 1, label: "Eje A", agenda: "D1" });
    expect(a.helices.appropriationTotal).toBe(0);
    expect(run({ axisId: 2 }).kpis.works).toBe(1);
    expect(run({ axisId: 3 }).kpis.works).toBe(0); // an axis without pairs of high or medium confidence
  });

  test("it uses the pairs, not the primary topic", () => {
    // work 4 has a topic (7) that no axis lists, and it passes; work 2 has the topic of A... of no axis, and does not
    expect(run({ axisId: 1 }).works).toBe(3);
    expect(run({ policyDoc: "D1" }).kpis.works).toBe(3); // by topic: works 0, 1, 3 (topic 0)
  });

  test("it combines with the document, the years, the unit with «y»", () => {
    /* F61 (D-163): with an axis chosen the document no longer restricts the products (before: 2 and 0). */
    expect(run({ axisId: 1, policyDoc: "D1" }).kpis.works).toBe(3);
    expect(run({ axisId: 1, policyDoc: "D2" }).kpis.works).toBe(3);
    expect(run({ axisId: 1, yearFrom: 2023, yearTo: 2023 }).kpis.works).toBe(1);
    expect(run({ axisId: 1, facultyIndex: 1 }).kpis.works).toBe(1);
    expect(run({ axisId: 1, facultyIndex: 0 }).kpis.works).toBe(0);
  });

  test("the projects do not change and an unknown id is ignored", () => {
    expect(run({ axisId: 1 }).kpis.projects).toBe(run({}).kpis.projects);
    expect(run({ axisId: 99 }).kpis.works).toBe(6);
    expect(run({ axisId: 99 }).axis).toBeNull();
  });

  test("the sample for the cards that need it counts the products of the selection", () => {
    expect(run({ axisId: 1 }).sample).toMatchObject({ graph: 3, helices: 3 });
    expect(run({}).sample.graph).toBe(5); // appropriation is not in the graph
  });

  test("the indicator 14 shows only the chosen axis, with the definition of the filter", () => {
    const sectors = { ...raw, works: raw.works.map((w, i) => (i < 2 ? w.map((x, k) => (k === 3 ? 2 : x)) : w)) }; // works 0 and 1 with a company (bit 1)
    const r = computeCollaboration(createCollaborationDataset(sectors), { axisId: 1 });
    const rows = r.axisRows(6);
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe("Eje A");
    expect(rows[0].counts.company).toBe(2);
    expect(computeCollaboration(createCollaborationDataset(sectors), { axisId: 3 }).axisRows(6)).toEqual([]);
  });

  test("a bundle without the confidence arrays does not offer the filter", () => {
    const old = createCollaborationDataset({ ...raw, thesaurus: { ...raw.thesaurus, ejes: raw.thesaurus.ejes.map(({ direct_conf, id, ...e }) => e) } });
    expect(old.hasAxisPairs).toBe(false);
    expect(computeCollaboration(old, { axisId: 1 }).kpis.works).toBe(6);
  });

  test("URL: ?axis=, a list of Board 1 gives its first id, invalid values fall back", () => {
    expect(serializeCollabFilters({ ...parseCollabFilters(new URLSearchParams("")), axisId: 98 })).toBe("axis=98");
    expect(parseCollabFilters(new URLSearchParams("axis=98")).axisId).toBe(98);
    expect(parseCollabFilters(new URLSearchParams("axis=3,17")).axisId).toBe(3);
    expect(parseCollabFilters(new URLSearchParams("axis=zz")).axisId).toBe(-1);
    expect(parseCollabFilters(new URLSearchParams("")).axisId).toBe(-1);
    expect(serializeCollabFilters(parseCollabFilters(new URLSearchParams("doc=D1&axis=1")))).toBe("doc=D1&axis=1");
  });

  test("the texts", () => {
    expect(AXIS_FILTER_NOTE).toContain("confianza alta o media");
    expect(AXIS_FILTER_NOTE).toContain("apropiación social");
    expect(AXIS_FILTER_NOTE).not.toMatch(/\bIA\b/);
    expect(NO_AXIS_RESPONSE).toBe("no responde al eje");
  });
});

test.describe("filter of axis against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let bundle;
  let dataset;
  const inRange = (w) => !w[0] || (w[0] >= 2010 && w[0] <= 2026);
  /* Direct count from the arrays of the bundle, without going through the filter code. */
  const direct = (id) => {
    const e = bundle.thesaurus.ejes.find((x) => x.id === id);
    const set = new Set();
    e.direct.forEach((i, k) => { if (e.direct_conf[k] <= 1) set.add(i); });
    return [...set].filter((i) => inRange(bundle.works[i]));
  };
  test.beforeAll(async () => {
    bundle = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    dataset = createCollaborationDataset(bundle);
  });

  test("control figures: axis 98 and a small axis against the direct count of the bundle", () => {
    const ejes = bundle.thesaurus.ejes;
    const small = ejes.map((e) => ({ id: e.id, n: direct(e.id).length })).filter((x) => x.n > 0).sort((a, b) => a.n - b.n)[0];
    for (const id of [98, small.id]) {
      const expected = direct(id).length;
      const r = computeCollaboration(dataset, { axisId: id });
      console.log(`[live] axis ${id} «${ejes.find((e) => e.id === id).eje.slice(0, 50)}»: ${r.kpis.works} products (direct count ${expected}); appropriation ${r.helices.appropriationTotal}; projects ${r.kpis.projects} (all ${computeCollaboration(dataset).kpis.projects})`);
      expect(r.kpis.works).toBe(expected);
      expect(r.helices.appropriationTotal).toBe(0);
      /* F59b: the projects answer to the axis through direct_proj (see the f59b spec); here only that they are not all */
      expect(r.kpis.projects).toBeLessThan(computeCollaboration(dataset).kpis.projects);
    }
    // indicator 14 (canvas): only the chosen axis, counted with the definition of the filter
    const rows = computeCollaboration(dataset, { axisId: 98 }).axisRows(6);
    console.log(`[live] indicator 14 with axis 98: ${rows.length} row(s), total ${rows[0]?.total}`);
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe(ejes.find((e) => e.id === 98).eje);
    // the pairs of high or medium confidence of the whole bundle (backend: 76.178)
    expect(ejes.reduce((s, e) => s + e.direct_conf.filter((c) => c <= 1).length, 0)).toBe(76178);
  });

  test("axis plus document: the axis commands (F61, D-163), the document does not restrict the products", () => {
    const e = bundle.thesaurus.ejes.find((x) => x.id === 98);
    const other = bundle.thesaurus.agendas.find((a) => a.name !== e.agenda);
    const same = computeCollaboration(dataset, { axisId: 98, policyDoc: e.agenda });
    const diff = computeCollaboration(dataset, { axisId: 98, policyDoc: other.name });
    const topics = new Set(bundle.thesaurus.agendas.find((a) => a.name === e.agenda).topics);
    const expected = direct(98).length;
    console.log(`[live] axis 98 + its document «${e.agenda}»: ${same.kpis.works} (expected ${expected}); + «${other.name}»: ${diff.kpis.works}`);
    expect(same.kpis.works).toBe(expected);
    expect(diff.kpis.works).toBe(expected);
    expect(topics.size).toBeGreaterThan(0);
  });

  test("the page: the filter is small, searchable and grouped; the document narrows the list; the URL keeps ?axis=", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-2");
    await expect(page.getByTestId("filters-toggle")).toBeVisible({ timeout: 120000 });
    const height = Math.round((await page.getByTestId("filters").boundingBox()).height);
    const rows = await page.getByTestId("filter-row").count(); // F77b: two rows of filters
    console.log(`[live] height of the container of the filters at 1440: ${height} px, ${rows} rows of filters`);
    expect(rows).toBe(2);
    const axisSelect = page.getByTestId("axis-filter");
    await expect(axisSelect).toBeVisible();
    await axisSelect.locator(".ant-select-selector").click();
    const groups = page.locator(".ant-select-item-group");
    await expect(groups.first()).toBeVisible();
    // the list is virtual: it renders the groups that fit; the first is the first agenda of the bundle
    console.log(`[live] first group of the list: ${await groups.first().innerText()}`);
    await expect(groups.first()).toHaveText("PDD mpal Medellín") /* F69: the groups follow the order of Gabriel */;
    await page.keyboard.type("biodiversidad");
    await expect(page.locator(".ant-select-item-option").first()).toBeVisible();
    await page.locator(".ant-select-item-option").first().click();
    await expect(page).toHaveURL(/axis=\d+/, { timeout: 30000 });
    await page.getByRole("button", { name: "Ayuda del filtro Eje Temático" }).hover(); // the note of the axis is the help «?» (F77b)
    await expect(page.getByTestId("axis-filter-note")).toContainText("confianza alta o media");
    await expect(page.getByText(NO_AXIS_RESPONSE).first()).toBeVisible();
  });

  test("a link with ?axis=98 filters, and with a document only the axes of that document are listed", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const e = bundle.thesaurus.ejes.find((x) => x.id === 98);
    const expected = direct(98).length;
    await page.goto(`/observatories/vri-udea/board-2?axis=98&doc=${encodeURIComponent(e.agenda)}`);
    const topics = new Set(bundle.thesaurus.agendas.find((a) => a.name === e.agenda).topics);
    const both = expected; /* F61: the document does not restrict when there is an axis */
    await expect(page.locator(".obs-kpi").first()).toContainText(both.toLocaleString("es-CO"), { timeout: 120000 });
    await expect(page.getByTestId("axis-14-note")).toContainText("misma definición del filtro");
    await page.getByTestId("axis-filter").locator(".ant-select-selector").click();
    /* The list opens scrolled to the chosen axis, so the header may be out of view: every option shown must be an axis of the document (F62: the list has the height of Board 1). */
    await page.waitForTimeout(500);
    const labels = new Set(bundle.thesaurus.ejes.filter((x) => x.agenda === e.agenda).map((x) => x.eje));
    const shown = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").evaluateAll((els) => els.map((x) => x.textContent.trim()));
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.every((t) => labels.has(t))).toBe(true);
    const groups = page.locator(".ant-select-item-group");
    console.log(`[live] axis 98: ${expected} alone, ${both} with its document; list with the document: only axes of «${e.agenda}» (${shown.length} shown)`);
  });
});
