/*
 * F72 (D-175): Board 3 adapted to the bundles of B126/B126b (P of 18 positions, 13 types, handle, preprints, level of the
 * arts, projects of creation), the texts of «departamental» and of the panel 2, and the indicator 7 of Board 2 as «sin dato
 * en la fuente». The first block needs no server; the second reads the real quyca and the dev server of Luis and only runs
 * with E2E_LIVE=1. No full regression (F37b).
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FOUNDATIONS_FILTERS, ART_LEVELS, PRODUCT, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";
import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { SCOPE_LABELS, AREAS_NOTE, PID_NOTE, pieNote } from "../../app/observatories/vri-udea/board-3/components/boardTexts";
import { NO_SECTOR_DATA, NO_SECTOR_DATA_NOTE, SCOPE_OPTIONS } from "../../app/observatories/vri-udea/board-2/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const fmt = (n) => Number(n).toLocaleString("es-CO");

/* Small bundle of Board 3 with the new keys: P of 18 positions [year, type, topic, mask, scope, oa, repo, doi, sector, ext, facs, deps, groups, authors, insts, thesis, handle, preprint]. */
const P = (type, doi, handle, preprint, authors = [0]) => [2022, type, -1, 0, 0, null, null, doi, 0, [], [], [], [], authors, [], 0, handle, preprint];
const raw = {
  doms: [], fields: [], subs: [], sub_meta: [], tops: [], top_meta: [], facs: [], deps: [], groups: [], centros: [], agendas: [], agendas_all: [],
  tipos: ["articulo", "libro", "capitulo", "apropiacion", "inv_creacion", "audiovisual", "prod_artistica", "dataset", "software", "preprint", "tesis_posgrado", "tesis_pregrado", "ondas"],
  tesis_sub: ["otra"], ambitos: ["Local", "Departamental", "Nacional", "Internacional"],
  P: [P(0, 1, 0, 0), P(0, 0, 1, 1), P(1, 1, 1, 0), P(2, 0, 0, 1), P(7, 0, 0, 0), P(8, 0, 1, 0), P(4, 0, 0, 1)],
  /* author: [staff, sex, birth, orcid, openalex, scholar, faculty, dept, group, contract, minciencias, jobcat, level] */
  A: [[1, 1, 1980, 1, 0, 0, -1, -1, -1, "vinculado", "", "", "doctorado"]],
  inst: [], age_bins: [], proj: { years: [], levels: [], all: [], by_centro: {}, estudiantes_unicos: 0, proyectos_total: 0 }, metas: [],
  talent: { staff_total: 1, por_minciencias: {}, poblacion_ajustada: 1, poblacion_censada: 1, inv_sheet: { personas: 0, por_vinculacion: {} }, planta_2021: { total: 1, edad_media: 40, por_edad: { "65+": 0 } } },
  artes: {
    prof: [
      { contrato: "vinculado", catlab: "x", fac: "F", works: 1, obras: 0, nivel: "doctorado" },
      { contrato: "ocasional", catlab: "x", fac: "F", works: 0, obras: 2, nivel: "especialización médico-quirúrgica" },
      { contrato: "ocasional", catlab: "x", fac: "F", works: 1, obras: 0, nivel: "Sin dato" },
    ],
    proy_grupos: {}, fac_creacion: { F: { obras: 3, proyectos: 2, personas: 2 } }, creacion_proyectos_unicos: 2,
  },
  creacion: { obras: 0, personas: 0, grupos: 0 },
  pi: null,
};
const ds = createFoundationsDataset(raw);
const run = () => computeFoundations(ds, DEFAULT_FOUNDATIONS_FILTERS);

test.describe("Board 3 with the new keys (no server)", () => {
  test("the pie of the indicator 17: every product in one portion, with the precedence preprint → publication → data → software", () => {
    const o = run().openAccess;
    // P: article (no mark), article preprint, book, chapter preprint, dataset, software, inv_creacion preprint
    expect(o.classes).toEqual({ preprints: 3, publications: 2, datasets: 1, software: 1 });
    expect(o.preprints).toBe(3);
    expect(o.preprintsFromPublications).toBe(2); // the preprint article and the preprint chapter leave «publications»
  });

  test("the indicator 18: the bar of Handle and the ones of «todos» with the rule of D-175 (4)(a)", () => {
    const rows = Object.fromEntries(run().pid.map((r) => [r.label, r]));
    expect(rows["Productos · Handle"]).toMatchObject({ withId: 3, total: 7 });
    expect(rows["Productos · todos (DOI o Handle)"].withId).toBe(4); // DOI: p0, p2; handle: p1, p2, p5; union: p0, p1, p2, p5
    expect(rows["Personas · todos (ORCID u OpenAlex)"].withId).toBe(1);
    expect(rows["Organizaciones · ROR (único disponible)"]).toBeTruthy();
    expect(PID_NOTE).toContain("DOI o Handle");
    expect(PID_NOTE).toContain("no es un identificador persistente registrado");
  });

  test("the indicator 12 groups by level (the two specialisations together) and the panel 14 has projects", () => {
    const a = run().arts;
    expect(a.byLevel).toBe(true);
    expect(a.groups).toEqual([...ART_LEVELS]);
    const byGroup = Object.fromEntries(a.points.map((p) => [`${p.group}|${p.products}`, p.professors]));
    expect(byGroup).toEqual({ "Doctorado|1": 1, "Especialización|2": 1, "Sin dato|1": 1 });
    expect(a.creationByFaculty[0].projects).toBe(2);
    expect(a.uniqueProjects).toBe(2);
    expect(PRODUCT.HANDLE).toBe(16);
    expect(PRODUCT.PREPRINT).toBe(17);
  });

  test("the texts: «departamental» without the Valle de Aburrá, the panel 2 says «miembros de un grupo», the pie says where the preprints go", () => {
    expect(SCOPE_LABELS[1]).toContain("sin el Valle de Aburrá");
    expect(SCOPE_OPTIONS.find((o) => o.value === "dep").label).toContain("sin el Valle de Aburrá");
    const note = AREAS_NOTE("2.943", 2021, "x");
    expect(note).toContain("miembros de un grupo");
    expect(note).not.toContain("9.005");
    expect(pieNote(362)).toContain("362 preprints");
  });

  test("Board 2, indicator 7: with no sector in the social appropriation it says «sin dato en la fuente»", () => {
    const base = {
      sectors: ["academic", "company", "government", "nonprofit", "healthcare"], sectorsEs: ["A", "E", "G", "S", "H"], tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
      regions: [], countries: [], insts: [{ n: "I", s: 0, c: "" }], depts: ["Antioquia"], groups: [], centros: [], deps: [], facs: [], subfields: [], sfField: [], subregs: [], doms: [], projects: [],
      thesaurus: { agendas: [], ejes: [] },
    };
    const work = (type, mask) => [2022, type, 0, mask, [], [], [], [], [], [], 0, 0, -1];
    const without = computeCollaboration(createCollaborationDataset({ ...base, works: [work(3, 0), work(3, 0), work(0, 2)] }), {});
    expect(without.helices.appropriationTotal).toBe(2);
    expect(without.helices.appropriationSectorData).toBe(false);
    const withData = computeCollaboration(createCollaborationDataset({ ...base, works: [work(3, 2), work(0, 2)] }), {});
    expect(withData.helices.appropriationSectorData).toBe(true);
    expect(NO_SECTOR_DATA).toBe("sin dato en la fuente");
    expect(NO_SECTOR_DATA_NOTE).toContain("solo del sector educación");
  });
});

test.describe("the new bundles (real quyca, read-only, one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let b1;
  let b3;
  let dataset;
  test.beforeAll(async () => {
    const etags = [];
    for (const n of [1, 2, 3]) etags.push((await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).headers.get("etag").replace(/"/g, ""));
    console.log(`[live] ETags ${etags.join(" ")}`);
    expect(etags).toEqual(["20261107-23175beb927f", "20261107-167ad80354ba", "20261107-e38e45aafac1"]);
    b1 = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    for (const p of b3.P) if (p[0] === 0) p[0] = null;
    dataset = createFoundationsDataset({ ...b3, artes: { ...b3.artes, prof: b3.artes.prof.map(({ id, ...rest }) => rest) } });
  });

  test("figures of backend: tiles, handle, the pie, the four scopes, levels of the arts, projects of creation", () => {
    expect(b3.P).toHaveLength(82589);
    expect(b3.P[0]).toHaveLength(18);
    expect(b3.tipos).toHaveLength(13);
    expect(b3.P.filter((p) => p[0] === null).length).toBe(1130);
    const r = computeFoundations(dataset, DEFAULT_FOUNDATIONS_FILTERS);
    console.log(`[live] tiles ${JSON.stringify(r.tiles)}`);
    expect(r.tiles).toMatchObject({ products: 82589, authors: 32641, staff: 2179, groups: 345 });
    const pid = Object.fromEntries(r.pid.map((x) => [x.label, x]));
    expect(pid["Productos · DOI (todos)"]).toMatchObject({ withId: 36711, total: 82589 });
    expect(pid["Productos · Handle"]).toMatchObject({ withId: 29910, total: 82589 });
    expect(pid["Productos · todos (DOI o Handle)"]).toMatchObject({ withId: 54417, total: 82589 });
    expect(pid["Personas · todos (ORCID u OpenAlex)"]).toMatchObject({ withId: 29140, total: 32641 });
    expect(pid["Organizaciones · ROR (único disponible)"]).toMatchObject({ withId: 8081, total: 8122 });
    expect(r.openAccess.classes).toMatchObject({ publications: 49467, preprints: 367 });
    expect(r.openAccess.preprintsFromPublications).toBe(362);
    expect(r.arts.byLevel).toBe(true);
    expect(r.arts.uniqueProjects).toBe(14);
    expect(r.arts.creationByFaculty.some((f) => f.projects > 0)).toBe(true);
    const scope = [0, 1, 2, 3].map((i) => b3.P.filter((p) => p[4] === i).length);
    console.log(`[live] scopes ${scope.join(" / ")}`);
    expect(scope).toEqual([51928, 2297, 14141, 14223]);
    for (let i = 0; i < 4; i++) expect(computeFoundations(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, scopeIndex: i }).tiles.products).toBe(scope[i]);
  });

  test("T1: no actor is typed «Financiadores»", () => {
    expect(b1.actores.filter((a) => a.t === "Financiadores")).toHaveLength(0);
  });

  test("the pages: T3 panels 2, 12, 14, 17 and 18, the scope list; T2 indicator 7; T1 without «Financiadores»", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-3");
    await page.getByTestId("filters").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3500);
    const text = (title) => page.getByTestId("chart-card").filter({ hasText: title }).first().innerText();
    await expect(page.locator(".obs-kpi").first()).toContainText("82.589");
    const p2 = await text("02 ·");
    expect(p2).toContain("miembros de un grupo");
    expect(p2).not.toContain("9.005");
    const p12 = await text("12 ·");
    expect(p12).toContain("nivel de formación");
    expect(p12).not.toContain("provisional");
    expect(p12).not.toContain("tipo de contrato");
    const p14 = await text("14 ·");
    expect(p14).not.toContain("No se muestra la columna de proyectos");
    const p17 = await text("17 ·");
    expect(p17).toContain("Producto por clase");
    expect(p17).toContain("362 preprints");
    expect(p17).not.toContain("484");
    const p18 = await text("18 ·");
    expect(p18).toContain("Productos · Handle");
    expect(p18).toContain("Productos · todos (DOI o Handle)");
    expect(p18).toContain("29.910");
    expect(p18).toContain("54.417");
    expect(p18).not.toContain("No hay Handle");
    // tooltip of the panel 14 does not say 0 projects
    const card = page.getByTestId("chart-card").filter({ hasText: "14 ·" }).first();
    const canvas = card.locator("canvas").first();
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    let tip = "";
    for (let fy = 0.05; fy < 0.9 && !tip; fy += 0.05) {
      await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * fy);
      await page.waitForTimeout(250);
      tip = await page.evaluate(() => [...document.querySelectorAll(".g2-tooltip")].filter((e) => e.offsetParent && e.innerText.trim()).map((e) => e.innerText.replace(/\s+/g, " ").trim())[0] || "");
    }
    console.log(`[live] T3 14: ${tip}`);
    expect(tip).toMatch(/proyectos/);
    expect(tip).not.toMatch(/\b0 proyectos/);
    // scope list
    const sel = page.getByTestId("filters").locator("label", { hasText: "Ámbito" }).first().locator("xpath=../..").locator(".ant-select-selector").first();
    await sel.click();
    await page.waitForTimeout(400);
    const items = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts();
    await page.keyboard.press("Escape");
    expect(items[1]).toContain("sin el Valle de Aburrá");

    // Board 2, indicator 7
    await page.goto("/observatories/vri-udea/board-2");
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3000);
    const p7 = await page.getByTestId("chart-card").filter({ hasText: "07 ·" }).first().innerText();
    expect(p7).toContain("sin dato en la fuente");
    await expect(page.getByTestId("no-sector-data-note")).toContainText("solo del sector educación");
    expect(await page.locator("main").innerText()).not.toContain("UNAULA");

    // Board 1: no «Financiadores»
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    expect(await page.locator("main").innerText()).not.toContain("Financiadores");
  });
});

test.describe("T1 · note of the panel 5 with an ODS chosen (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("it says that the products without a record in OpenAlex stay out (11.569)", async ({ page }) => {
    test.setTimeout(150000);
    const b1 = await (await page.request.get(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const noRecord = b1.facts.filter((f) => f[14] !== 1).length;
    expect(noRecord).toBe(11569);
    expect(b1.facts.filter((f) => f[14] !== 1 && f[11].length).length).toBe(0); // none of them has an ODS
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-1?ods=3");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(page.getByTestId("ods-selected-note")).toContainText("quedan fuera los 11.569 productos sin registro en OpenAlex");
  });
});
