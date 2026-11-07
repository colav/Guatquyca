/*
 * F59b (D-162, D-163): the projects answer to the filter of Eje Temático of Board 2. A project passes when the axis is in
 * `direct_proj` with `direct_proj_conf` 0 or 1 (B121); it combines with the other filters with «y»; the document does not
 * restrict the projects when there is an axis; the social appropriation stays at 0. The first block needs no server; the
 * second reads the real quyca and the dev server of Luis (one run) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { AXIS_PROJECT_CONFIDENCE_MAX, SMALL_SAMPLE, computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { AXIS_FILTER_NOTE, NO_AXIS_RESPONSE, smallProjectsNote } from "../../app/observatories/vri-udea/board-2/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* projects: [year, funderSectorMask, subregionMask, groups[], iap, external, centerText] */
const project = (year, external = 0, iap = 0) => [year, 0, 0, [], iap, external, ""];
const work = (year, type, topic) => [year, type, 0, 0, [], [], [], [], [], [], 0, 0, topic];
const base = {
  sectors: ["academic", "company", "government", "nonprofit", "healthcare"],
  sectorsEs: ["Academia", "Empresa", "Gobierno", "Sin ánimo de lucro", "Salud"],
  tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
  regions: ["A", "B", "C", "D", "E", "F", "G", "H"],
  countries: [], insts: [{ n: "I", s: 1, c: "" }], depts: ["Antioquia"], groups: [{ id: "G0", n: "Grupo 0", c: -1, d: 0 }], centros: [], deps: [],
  subfields: ["S"], sfField: ["F"], subregs: [], doms: [], funders: [],
  works: [work(2022, 0, 0), work(2023, 0, 0)],
  projects: [project(2020, 1, 1), project(2021, 0, 0), project(2022, 1, 0), project(2023, 0, 1), project(2024, 0, 0)],
};
const ejes = (withProj) => [
  { id: 1, agenda: "D1", clave: "D1|A", eje: "Eje A", nivel: "N", topics: [0], direct: [0, 1], direct_conf: [0, 0], ...(withProj ? { direct_proj: [0, 1, 2, 3], direct_proj_conf: [0, 1, 2, 0] } : {}) },
  { id: 2, agenda: "D2", clave: "D2|B", eje: "Eje B", nivel: "N", topics: [1], direct: [], direct_conf: [], ...(withProj ? { direct_proj: [4], direct_proj_conf: [1] } : {}) },
  { id: 3, agenda: "D2", clave: "D2|C", eje: "Eje C", nivel: "N", topics: [], direct: [], direct_conf: [], ...(withProj ? { direct_proj: [], direct_proj_conf: [] } : {}) },
];
const make = (withProj) => createCollaborationDataset({ ...base, thesaurus: { agendas: [{ name: "D1", topics: [0] }, { name: "D2", topics: [1] }], ejes: ejes(withProj) } });
const ds = make(true);
const run = (f, d = ds) => computeCollaboration(d, f);

test.describe("projects and axis, model (no server)", () => {
  test("a project passes with a pair of high or medium confidence; low confidence does not", () => {
    expect(AXIS_PROJECT_CONFIDENCE_MAX).toBe(1);
    expect(run({}).kpis.projects).toBe(5);
    expect(run({ axisId: 1 }).kpis.projects).toBe(3); // projects 0 (high), 1 (medium) and 3 (high); not 2 (low)
    expect(run({ axisId: 2 }).kpis.projects).toBe(1);
    expect(run({ axisId: 3 }).kpis.projects).toBe(0); // an axis without pairs of projects
    expect(run({ axisId: 99 }).kpis.projects).toBe(5); // unknown id: ignored
  });

  test("the cards of projects follow: external, IAP, and the combination with the other filters with «y»", () => {
    expect(run({ axisId: 1 }).kpis.projectsExternal).toBe(1); // project 0 (project 2 is low)
    expect(run({ axisId: 1 }).iap.projects).toBe(2); // projects 0 and 3
    expect(run({ axisId: 1, yearFrom: 2021, yearTo: 2023 }).kpis.projects).toBe(2); // 1 and 3
    expect(run({ axisId: 1, policyDoc: "D2" }).kpis.projects).toBe(3); // the document does not restrict (D-163)
    expect(run({ axisId: 1 }).kpis.works).toBe(2); // the works are not touched by the pairs of projects
  });

  test("the appropriation stays at 0 with an axis; the sample of projects is reported", () => {
    expect(run({ axisId: 1 }).helices.appropriationTotal).toBe(0);
    expect(run({ axisId: 1 }).sample.projects).toBe(3);
    expect(run({ axisId: 1 }).axis.projectsRespond).toBe(true);
    expect(SMALL_SAMPLE).toBe(30);
    expect(smallProjectsNote(3)).toContain("3 proyectos");
  });

  test("a bundle without pairs of projects: the projects do not answer and the board says so", () => {
    const old = make(false);
    expect(run({ axisId: 1 }, old).kpis.projects).toBe(5);
    expect(run({ axisId: 1 }, old).axis.projectsRespond).toBe(false);
    expect(old.hasProjectPairs).toBe(false);
    expect(ds.hasProjectPairs).toBe(true);
  });

  test("the texts", () => {
    expect(AXIS_FILTER_NOTE).toBe("El filtro de eje se aplica a artículos, libros y capítulos, y a proyectos, con eje asignado por nuestra metodología (confianza alta o media). La apropiación social no tiene eje: no se cuenta. El documento solo limita los ejes disponibles.");
    expect(NO_AXIS_RESPONSE).toBe("no responde al eje");
  });
});

test.describe("projects and axis against the real quyca (read-only, one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let bundle;
  let dataset;
  test.beforeAll(async () => {
    const res = await fetch(`${API}/observatories/vri-udea/boards/2/bundle`);
    console.log(`[live] ETag T2 ${res.headers.get("etag")}`);
    bundle = await res.json();
    dataset = createCollaborationDataset(bundle);
  });
  const directProj = (id) => {
    const e = bundle.thesaurus.ejes.find((x) => x.id === id);
    return e.direct_proj.filter((_, k) => e.direct_proj_conf[k] <= 1);
  };

  test("control figures: 3.974 pairs in 1.275 projects, and a large and a small axis against the direct count", () => {
    const list = bundle.thesaurus.ejes;
    let pairs = 0;
    const projects = new Set();
    for (const e of list) e.direct_proj.forEach((p, k) => { if (e.direct_proj_conf[k] <= 1) { pairs++; projects.add(p); } });
    console.log(`[live] pairs of projects high + medium: ${pairs} in ${projects.size} projects`);
    expect(pairs).toBe(3974);
    expect(projects.size).toBe(1275);
    const ranked = list.map((e) => ({ id: e.id, n: directProj(e.id).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
    const picks = [ranked[0], ranked[ranked.length - 1]];
    const all = computeCollaboration(dataset).kpis.projects;
    for (const { id, n } of picks) {
      const r = computeCollaboration(dataset, { axisId: id });
      console.log(`[live] axis ${id} «${list.find((e) => e.id === id).eje.slice(0, 50)}»: ${r.kpis.projects} projects (direct count ${n}; all ${all}); works ${r.kpis.works}; appropriation ${r.helices.appropriationTotal}`);
      expect(r.kpis.projects).toBe(n);
      expect(r.helices.appropriationTotal).toBe(0);
    }
    expect(dataset.hasProjectPairs).toBe(true);
    // axes without any pair of projects of high or medium confidence: the board shows 0
    const none = list.filter((e) => directProj(e.id).length === 0);
    console.log(`[live] axes without a pair of projects of high or medium confidence: ${none.length}`);
    expect(computeCollaboration(dataset, { axisId: none[0].id }).kpis.projects).toBe(0);
    // the document does not restrict the projects with an axis
    const e0 = list.find((e) => e.id === picks[0].id);
    expect(computeCollaboration(dataset, { axisId: e0.id, policyDoc: e0.agenda }).kpis.projects).toBe(picks[0].n);
  });

  test("the document filters the projects through the pairs of its axes (F66, D-168)", () => {
    const doc = "CONPES 4144";
    const withDoc = computeCollaboration(dataset, { policyDoc: doc }).kpis.projects;
    const all = computeCollaboration(dataset).kpis.projects;
    const inDoc = new Set();
    for (const e of bundle.thesaurus.ejes) if (e.agenda === doc) e.direct_proj.forEach((p, k) => { if (e.direct_proj_conf[k] <= 1) inDoc.add(p); });
    console.log(`[live] document ${doc}: projects with the filter of document today ${withDoc} (all ${all}); with pairs of its axes it would be ${inDoc.size}`);
    expect(withDoc).toBe(inDoc.size); /* F66: the document now filters the projects through the pairs of its axes */
  });

  test("the page: with an axis the cards of projects answer, without the label «no responde al eje»", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const big = bundle.thesaurus.ejes.map((e) => ({ id: e.id, n: directProj(e.id).length })).sort((a, b) => b.n - a.n)[0];
    await page.goto(`/observatories/vri-udea/board-2?axis=${big.id}`);
    await expect(page.getByTestId("axis-filter-note")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1000);
    const kpiProjects = page.locator(".obs-kpi").filter({ hasText: "proyectos SIIU" }).first();
    await expect(kpiProjects).toContainText(big.n.toLocaleString("es-CO"));
    await expect(kpiProjects).not.toContainText(NO_AXIS_RESPONSE);
    await expect(page.getByTestId("axis-filter-note")).toContainText("y a proyectos");
    await expect(page.getByText("La línea de proyectos no responde al eje")).toHaveCount(0);
    await expect(page.getByText("Los proyectos no responde al eje")).toHaveCount(0);
    // the funders ranking is an aggregate list and keeps its note
    await expect(page.getByText("No responde al eje", { exact: false }).first()).toBeVisible();
  });
});
