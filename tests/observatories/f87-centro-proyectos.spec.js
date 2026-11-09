/*
 * F87 (D-199): Board 3, panel 07 with each of the 25 centres of the filter, and «Sin centro asignado» (no project lacks a managing
 * centre: zero projects, never all of them). The first block needs no server; the second (E2E_LIVE=1) reads the bundle of the T3
 * (ETag of B138) and checks the panel with the 25 centres. Part 3 (Board 2 projects by `p[7]`) waits for B140. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FOUNDATIONS_FILTERS, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";
import { STUDENT_LEVELS } from "../../lib/observatories/foundations/constants";
import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const row = (a, b) => STUDENT_LEVELS.map((_, i) => (i === 0 ? a : i === 1 ? b : 0));
const raw = {
  doms: [], fields: [], subs: [], sub_meta: [], tops: [], top_meta: {}, facs: [], deps: [], groups: [],
  centros: ["Uno", "Sin centro", "Dos"], agendas: [], agendas_all: [],
  tipos: ["articulo", "libro", "capitulo", "apropiacion", "inv_creacion", "audiovisual", "prod_artistica", "dataset", "software", "preprint", "tesis_posgrado", "tesis_pregrado", "ondas"],
  tesis_sub: ["otra"], ambitos: ["Local", "Departamental", "Nacional", "Internacional"],
  P: [], A: [], inst: [], age_bins: [],
  proj: { years: [2020, 2021], levels: STUDENT_LEVELS, all: [row(5, 1), row(4, 2)], by_centro: { Uno: [row(3, 0), row(1, 1)] }, estudiantes_unicos: 12, proyectos_total: 3 },
  metas: [],
  talent: { staff_total: 1, por_minciencias: {}, poblacion_ajustada: 1, poblacion_censada: 1, inv_sheet: { personas: 0, por_vinculacion: {} }, planta_2021: { total: 1, edad_media: 40, por_edad: {} } },
  artes: { prof: [], proy_grupos: {}, fac_creacion: {}, creacion_proyectos_unicos: 0 },
  creacion: { obras: 0, personas: 0, grupos: 0 },
  pi: null,
};
const total = (students) => students.series.reduce((a, s) => a + s.values.reduce((x, y) => x + y, 0), 0);
const panel = (centerIndex) => computeFoundations(createFoundationsDataset(raw), { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex, yearFrom: 2014, yearTo: 2025 }).students;

test.describe("panel 07 by centre (no server)", () => {
  test("a centre with key shows its own matrix; no centre chosen shows all", () => {
    expect(total(panel(-1))).toBe(12);
    const own = panel(0);
    expect(own.byCenter).toBe(true);
    expect(total(own)).toBe(5);
    expect(own.centerMissing).toBe(false);
  });

  test("«Sin centro» (no key): zero projects, never all of them, and the flag for the note", () => {
    const none = panel(1);
    expect(total(none)).toBe(0);
    expect(none.byCenter).toBe(false);
    expect(none.withoutCenter).toBe(true);
    expect(none.series.every((s) => s.values.length === 2)).toBe(true); // the years are still there
  });

  test("any other centre whose key is missing: zero too, with the general note", () => {
    const missing = panel(2);
    expect(total(missing)).toBe(0);
    expect(missing.centerMissing).toBe(true);
    expect(missing.withoutCenter).toBe(false);
  });
});

/* Projects per centre of the table of B138 §1 (the sum of the 25 is 2.524), for the report. */
const EXPECTED = { Agrarias: 54, Nutrición: 69, Ingeniería: 300, Artes: 35, SIU: 374, "Corporación Académica Ambiental": 18, Farmacia: 92, Económicas: 84, Comunicaciones: 117, Exactas: 290, Bibliotecología: 35, Deportes: 41, INER: 32, "Estudios Políticos": 31, Idiomas: 51, Filosofía: 32, "Corporación Académica para el Estudio de Patologías Tropicales": 52, Educación: 88, Enfermería: 71, "Salud Pública": 73, Medicina: 200, Derecho: 127, Microbiología: 95, Odontología: 71, Sociales: 92 };

test.describe("panel 07 with the 25 centres (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the bundle of B138: every centre of the filter has its key, and the panel shows its own data", async ({ request }) => {
    test.setTimeout(200000);
    const response = await request.get(`${API}/observatories/vri-udea/boards/3/bundle`);
    console.log(`[live] ETag of the T3: ${response.headers().etag}`);
    expect(response.headers().etag).toBe('"20261107-72d119b00b79"'); // B142 (F88); B138 was a7410df8e340
    const body = await response.json();
    const b3 = body.data || body;
    const ds = createFoundationsDataset(b3);
    const filters = { ...DEFAULT_FOUNDATIONS_FILTERS, yearFrom: 2014, yearTo: 2025 };
    const all = computeFoundations(ds, filters).students;
    const rows = [];
    let sumKeys = 0;
    b3.centros.forEach((name, i) => {
      const s = computeFoundations(ds, { ...filters, centerIndex: i }).students;
      const expectedProjects = EXPECTED[name];
      rows.push({ name, key: name in b3.proj.by_centro, byCenter: s.byCenter, shown: total(s), expectedProjects });
      sumKeys += expectedProjects || 0;
    });
    console.log(`[live] centre | key | panel shows | projects expected (B138 §1)`);
    for (const r of rows) console.log(`[live] ${r.name} | ${r.key} | ${r.byCenter ? "own data" : r.shown === 0 ? "zero" : "ALL"} (${r.shown} student-years) | ${r.expectedProjects ?? "—"}`);
    console.log(`[live] all projects: ${total(all)} student-years; sum of the expected projects of the 25 centres ${sumKeys}`);
    const without = rows.filter((r) => r.name !== "Sin centro");
    expect(without).toHaveLength(25);
    for (const r of without) {
      expect(r.key, `${r.name} has its key`).toBe(true);
      expect(r.byCenter, `${r.name} shows its own data`).toBe(true);
      expect(r.expectedProjects, `${r.name} is in the table of B138`).toBeGreaterThan(0);
      expect(r.shown, `${r.name} shows less than all`).toBeLessThan(total(all) + 1);
    }
    expect(sumKeys).toBe(2524);
    const sin = rows.find((r) => r.name === "Sin centro");
    expect(sin.shown).toBe(0);
    // the larger the centre in projects, the more it shows: the three largest of B138 are the three largest in the panel
    const top = (key) => [...without].sort((a, b) => b[key] - a[key]).slice(0, 3).map((r) => r.name).sort();
    expect(top("shown")).toEqual(top("expectedProjects"));
  });

  test("the page: «Sin centro asignado» says there are no projects without a centre and shows none", async ({ page, request }) => {
    test.setTimeout(200000);
    const body3 = await (await request.get(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const index = (body3.data || body3).centros.indexOf("Sin centro");
    expect(index).toBeGreaterThanOrEqual(0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/observatories/vri-udea/board-3?center=${index}`);
    await expect(page.getByText("7 · Estudiantes en proyectos por nivel")).toBeVisible({ timeout: 120000 });
    const body = page.locator("body");
    await expect(body).toContainText("Ningún proyecto del listado figura sin centro gestor.", { timeout: 60000 });
  });

  test("Board 2: the projects of each of the 25 centres by position 7, before (first word) and after; KPI and funders of SIU", async ({ request }) => {
    test.setTimeout(250000);
    const response = await request.get(`${API}/observatories/vri-udea/boards/2/bundle`);
    console.log(`[live] ETag of the T2: ${response.headers().etag}`);
    expect(response.headers().etag).toBe('"20261107-c7efe30b89e2"');
    const body = await response.json();
    const b2 = body.data || body;
    b2.funders = b2.ext.funders; // what the adapter of the page does
    expect(b2.projects.every((p) => p.length === 8)).toBe(true);
    expect(b2.projects.filter((p) => p[7] === -1)).toHaveLength(0);
    const after = createCollaborationDataset(b2);
    const before = createCollaborationDataset({ ...b2, projects: b2.projects.map((p) => p.slice(0, 7)) }); // the old rule: first word of the text
    const filters = { yearFrom: 2010, yearTo: 2026 };
    const rows = b2.centros.map((name, i) => ({ name, expected: EXPECTED[name], before: computeCollaboration(before, { ...filters, centerIndex: i }).kpis.projects, after: computeCollaboration(after, { ...filters, centerIndex: i }).kpis.projects }));
    console.log("[live] centre | projects before (first word) | after (position 7) | expected (B140)");
    for (const r of rows) console.log(`[live] ${r.name} | ${r.before} | ${r.after} | ${r.expected}`);
    console.log(`[live] all projects ${computeCollaboration(after, filters).kpis.projects}; sum after ${rows.reduce((a, r) => a + r.after, 0)}; sum before ${rows.reduce((a, r) => a + r.before, 0)}`);
    expect(rows).toHaveLength(25);
    for (const r of rows) expect(r.after, `${r.name}: as B140`).toBe(r.expected);
    expect(rows.reduce((a, r) => a + r.after, 0)).toBe(2524);
    for (const name of ["SIU", "Medicina", "Derecho", "Farmacia", "Educación", "Odontología", "Bibliotecología", "Deportes", "INER"]) {
      const r = rows.find((x) => x.name === name);
      expect(r.before, `${name} showed none before`).toBe(0);
      expect(r.after, `${name} shows its own now`).toBeGreaterThan(0);
    }
    const i = b2.centros.indexOf("SIU");
    for (const [label, d] of [["before", before], ["after", after]]) {
      const r = computeCollaboration(d, { ...filters, centerIndex: i });
      console.log(`[live] SIU ${label}: projects ${r.kpis.projects}, with external funder ${r.kpis.projectsExternal}, funders ${r.funders.length} (projects counted ${r.funders.reduce((a, x) => a + x.proyectos, 0)})`);
    }
  });
});
