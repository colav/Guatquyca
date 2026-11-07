/*
 * F66 and F66b (D-168, D-169): patents in the trend 05b and in the triple helix 06 (years, centre and unit answer; the rest
 * do not and are named), the card of funders counted over the projects that pass the filters (`ext.project_funders`), and
 * the document of policy filtering the projects through the pairs of its axes (not when an axis is chosen). The first
 * block needs no server; the second reads the real quyca and the dev server of Luis (one run) and only runs with
 * E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { PATENT_SERIES_LABEL, computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { NOTES, patentsIgnoredNote, realNotice } from "../../app/observatories/vri-udea/board-2/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const project = (year, centerText = "") => [year, 0, 0, [], 0, 0, centerText];
const base = {
  sectors: ["academic", "company", "government", "nonprofit", "healthcare"],
  sectorsEs: ["Academia", "Empresa", "Gobierno", "Sin ánimo de lucro", "Salud"],
  tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
  regions: ["A", "B", "C", "D", "E", "F", "G", "H"],
  countries: [], insts: [{ n: "I", s: 1, c: "" }], depts: ["Antioquia"],
  groups: [{ id: "G0", n: "Grupo 0", c: 0, d: 0 }, { id: "G1", n: "Grupo 1", c: 1, d: 0 }], centros: ["C0", "C1"], deps: [],
  subfields: ["S"], sfField: ["F"], subregs: [], doms: [], facs: ["U0", "U1"],
  works: [[2022, 0, 0, 0, [], [], [], [], [], [], 0, 0, 0]],
  projects: [project(2020), project(2021), project(2022), project(2023), project(2024)],
  funders: [
    { nm: "Ent A", fsector: "government", proyectos: 3, monto_total_cop: 10 },
    { nm: "Ent B", fsector: "company", proyectos: 3, monto_total_cop: 20 },
    { nm: "Ent C", fsector: "company", proyectos: 1, monto_total_cop: 30 },
  ],
  /* [year, company, groups[], units[]] */
  patentes: [[2012, 1, [0], [0]], [2015, 0, [0], [1]], [2015, 1, [1], [1]], [2022, 0, [1], [0]], [2008, 1, [0], [0]]],
  ext: { project_funders: [[0], [0, 1], [0, 1], [1, 2], []] },
  thesaurus: {
    agendas: [{ name: "D1", topics: [0] }, { name: "D2", topics: [1] }],
    ejes: [
      { id: 1, agenda: "D1", clave: "D1|A", eje: "Eje A", nivel: "N", topics: [0], direct: [0], direct_conf: [0], direct_proj: [0, 1, 4], direct_proj_conf: [0, 1, 2] },
      { id: 2, agenda: "D2", clave: "D2|B", eje: "Eje B", nivel: "N", topics: [1], direct: [], direct_conf: [], direct_proj: [2, 3], direct_proj_conf: [0, 0] },
    ],
  },
};
const ds = createCollaborationDataset(base);
const run = (f, d = ds) => computeCollaboration(d, f);

test.describe("patents, funders and document on projects, model (no server)", () => {
  test("patents: the series and the tile follow years, centre and unit; the rest are named", () => {
    const all = run({ yearFrom: 2010, yearTo: 2026 });
    expect(all.hasPatents).toBe(true);
    expect(all.helices.patents).toBe(4); // the default range 2010–2026 leaves the one of 2008 out, as with the works
    expect(all.helices.patentsWithCompany).toBe(2);
    const series = run({ yearFrom: 2010, yearTo: 2016 }).trendOthers.find((s) => s.label === PATENT_SERIES_LABEL);
    expect(series.values).toEqual([0, 0, 1, 0, 0, 2, 0]); // 2012 and two of 2015
    expect(run({ centerIndex: 0 }).helices.patents).toBe(2); // groups 0: patents of 2012 and 2015
    expect(run({ centerIndex: 1 }).helices.patents).toBe(2);
    expect(run({ facultyIndex: 1 }).helices.patents).toBe(2);
    expect(run({ centerIndex: 1, facultyIndex: 1 }).helices.patents).toBe(1); // «y»
    const ignored = run({ scope: "dep", policyDoc: "D1", axisId: 1, departmentIndex: 0, subfieldIndex: 0 }).patentsIgnored;
    expect(ignored).toEqual(["ámbito", "documento de política", "eje", "subunidad", "subcampo"]);
    expect(run({ scope: "dep", policyDoc: "D1", axisId: 1 }).helices.patents).toBe(run({}).helices.patents); // they do not change it
    expect(run({}).patentsIgnored).toEqual([]);
    expect(patentsIgnoredNote(["eje"])).toBe("Las patentes no responden a: eje.");
  });

  test("the order of the series of 05b is the one of Gabriel: books, chapters, appropriation, patents, projects", () => {
    expect(run({}).trendOthers.map((s) => s.label)).toEqual(["Libro", "Capítulo", "Apropiación social", "Patentes", "Proyectos (inicio)"]);
  });

  test("without the key `patentes` (test data) there is no series and no tile", () => {
    const { patentes: _omit, ...without } = base;
    const d = createCollaborationDataset(without);
    expect(run({}, d).hasPatents).toBe(false);
    expect(run({}, d).trendOthers.map((s) => s.label)).not.toContain("Patentes");
  });

  test("funders: without filters the sum per entity is the one of the bundle; with filters they are counted over the projects", () => {
    const f = run({ yearFrom: 2014, yearTo: 2026 }).funders;
    expect(f.map((x) => [x.nm, x.proyectos])).toEqual([["Ent A", 3], ["Ent B", 3], ["Ent C", 1]]);
    expect(run({ yearFrom: 2022, yearTo: 2026 }).funders.map((x) => [x.nm, x.proyectos])).toEqual([["Ent B", 2], ["Ent A", 1], ["Ent C", 1]]); // projects of 2022, 2023, 2024
    expect(run({ yearFrom: 2024, yearTo: 2026 }).funders).toEqual([]); // the only project of 2024 has none
    expect(run({ axisId: 1, yearFrom: 2014 }).funders.map((x) => [x.nm, x.proyectos])).toEqual([["Ent A", 2], ["Ent B", 1]]); // projects 0 and 1 (project 4 is low confidence)
    expect(run({}).fundersByProject).toBe(true);
  });

  test("funders: a bundle without the list per project keeps the fixed ranking", () => {
    const { ext: _omit, ...without } = base;
    const d = createCollaborationDataset(without);
    expect(run({}, d).fundersByProject).toBe(false);
    expect(run({ yearFrom: 2022 }, d).funders.map((x) => x.proyectos)).toEqual([3, 3, 1]);
  });

  test("the document filters the projects through the pairs of its axes; with an axis it does not (D-163)", () => {
    expect(run({ yearFrom: 2014, policyDoc: "D1" }).kpis.projects).toBe(2); // projects 0 and 1
    expect(run({ yearFrom: 2014, policyDoc: "D2" }).kpis.projects).toBe(2); // projects 2 and 3
    expect(run({ yearFrom: 2014, policyDoc: "D1", axisId: 2 }).kpis.projects).toBe(2); // the axis commands: projects 2 and 3
    expect(run({ yearFrom: 2014 }).kpis.projects).toBe(5);
    expect(run({ yearFrom: 2014, policyDoc: "D1" }).funders.map((x) => [x.nm, x.proyectos])).toEqual([["Ent A", 2], ["Ent B", 1]]);
  });

  test("the texts: the notice of the API says where the patents come from", () => {
    expect(realNotice({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 1, appropriation: 2 })).toContain("las patentes salen del portafolio de propiedad intelectual (patentes distintas, no el contador de Minciencias)");
    expect(NOTES.v6Patents).toContain("no indica quién co-inventó");
    expect(NOTES.v6Patents).not.toContain("no contiene patentes");
    expect(NOTES.v16Filtered).not.toContain("no responde a los filtros");
  });
});

test.describe("patents, funders and document against the real quyca (read-only, one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let bundle;
  let dataset;
  test.beforeAll(async () => {
    const res = await fetch(`${API}/observatories/vri-udea/boards/2/bundle`);
    console.log(`[live] ETag T2 ${res.headers.get("etag")}`);
    bundle = await res.json();
    bundle.funders = bundle.ext.funders;
    dataset = createCollaborationDataset(bundle);
  });

  test("control figures: 83 patents, 29 with company, the series by year, the funders against the bundle", () => {
    const rows = bundle.patentes;
    expect(rows).toHaveLength(83);
    expect(rows.filter((r) => r[1] === 1)).toHaveLength(29);
    const r = computeCollaboration(dataset, { yearFrom: 2010, yearTo: 2026 });
    const inRange = rows.filter((x) => x[0] >= 2010 && x[0] <= 2026);
    console.log(`[live] patents in the bundle ${rows.length} (${rows.filter((x) => x[0] < 2010).length} before 2010), with company ${rows.filter((x) => x[1]).length}; board 2010–2026: ${r.helices.patents} patents, ${r.helices.patentsWithCompany} with company`);
    expect(r.helices.patents).toBe(inRange.length);
    expect(r.helices.patentsWithCompany).toBe(inRange.filter((x) => x[1] === 1).length);
    const series = r.trendOthers.find((s) => s.label === "Patentes").values;
    expect(series).toEqual(r.years.map((y) => rows.filter((x) => x[0] === y).length));
    expect(series.reduce((a, b) => a + b, 0)).toBe(inRange.length);
    expect(series.slice(r.years.indexOf(2024)).every((v) => v === 0)).toBe(true);
    // funders: sum per entity = funders[i].proyectos without filters (2014–2026 covers the years of the projects)
    const f = bundle.ext.funders;
    const counts = new Array(f.length).fill(0);
    for (const list of bundle.ext.project_funders) for (const k of list) counts[k]++;
    expect(counts).toEqual(f.map((x) => x.proyectos));
    expect(r.funders.map((x) => [x.nm, x.proyectos])).toEqual(f.slice(0, 25).map((x) => [x.nm, x.proyectos]));
    // with an axis: the funders of its projects, against the direct count
    const axis = bundle.thesaurus.ejes.find((e) => e.id === 98);
    const ids = new Set(axis.direct_proj.filter((_, k) => axis.direct_proj_conf[k] <= 1));
    const direct = new Array(f.length).fill(0);
    for (const i of ids) for (const k of bundle.ext.project_funders[i]) direct[k]++;
    const withAxis = computeCollaboration(dataset, { axisId: 98 });
    console.log(`[live] axis 98: ${ids.size} projects; funders ${withAxis.funders.length}; top ${withAxis.funders[0]?.nm} ${withAxis.funders[0]?.proyectos}`);
    for (const x of withAxis.funders) expect(x.proyectos).toBe(direct[f.findIndex((y) => y.nm === x.nm)]);
    // the document on projects: 92 for CONPES 4144
    const doc = computeCollaboration(dataset, { policyDoc: "CONPES 4144" }).kpis.projects;
    console.log(`[live] CONPES 4144 on projects: ${doc} of ${computeCollaboration(dataset).kpis.projects}`);
    expect(doc).toBe(92);
  });

  test("the page: the tile of patents, the funders card without the old note, and the line under the filters", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-2?axis=98");
    await expect(page.getByTestId("axis-filter-note")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("patents-ignored-note")).toContainText("eje");
    await expect(page.getByText("patentes con empresa como cotitular")).toBeVisible();
    await expect(page.getByText("no indica quién co-inventó", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Este ránking no responde a los filtros")).toHaveCount(0);
    await expect(page.getByText("responden a temporalidad, centro, ámbito departamental, eje y documento")).toBeVisible();
    await expect(page.getByText("La base no contiene patentes")).toHaveCount(0);
  });
});
