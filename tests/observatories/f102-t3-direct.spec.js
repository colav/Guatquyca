/*
 * F102 (X-05, D-221, D-226): the filters of centre, unit and subunit of the Board 3 are direct. The first block needs no server; the second
 * (E2E_LIVE=1) checks the real bundle against the figures of F99 (column «directo»), the coherence with the Board 2, the lists of the filters
 * and the empty states of the pages.
 */
import { test, expect } from "@playwright/test";

import {
  DEFAULT_FOUNDATIONS_FILTERS,
  ENTITY_FILTERS_ARE_DIRECT,
  FEW_PRODUCTS_THRESHOLD,
  PRODUCT,
  computeFoundations,
  createFoundationsDataset,
  filterProducts,
  productOptionAvailability,
} from "../../lib/observatories/foundations";
import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { DIRECT_FILTERS_NOTE, fewProductsWarning, methodNotes } from "../../app/observatories/vri-udea/board-3/components/boardTexts";
import { PANEL_HELP } from "../../app/observatories/vri-udea/board-3/components/panelHelp";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

/* Small bundle: topic 0 has a product of the centre 0 (group 0) and one of another centre (group 1). Direct: only the first; the expansion adds the second. */
const P = (topic, groups, facs = [], deps = []) => [2022, 0, topic, 0, 0, null, null, 0, 0, [], facs, deps, groups, [0], [], 0, 0, 0];
const raw = {
  doms: ["D"], fields: ["F"], subs: ["S"], sub_meta: [], tops: ["T0", "T1"], top_meta: { T0: [0, 0, 0], T1: [0, 0, 0] }, facs: ["F0", "F1"], deps: ["D0"], groups: [["G0", "G", "A", "B", "C0", 1, "Activo"], ["G1", "G", "A", "B", "C1", 1, "Activo"]],
  centros: ["C0", "C1"], agendas: [], agendas_all: [],
  tipos: ["articulo", "libro", "capitulo", "apropiacion", "inv_creacion", "audiovisual", "prod_artistica", "dataset", "software", "preprint", "tesis_posgrado", "tesis_pregrado", "ondas"],
  tesis_sub: ["otra"], ambitos: ["Local", "Departamental", "Nacional", "Internacional"],
  P: [P(0, [0], [0]), P(0, [1], [1]), P(1, [1], [1])],
  A: [[1, 1, 1980, 1, 0, 0, -1, -1, -1, "vinculado", "", "", "doctorado"]],
  inst: [], age_bins: [], proj: { years: [], levels: [], all: [], by_centro: {}, estudiantes_unicos: 0, proyectos_total: 0 }, metas: [],
  talent: { staff_total: 1, por_minciencias: {}, poblacion_ajustada: 1, poblacion_censada: 1, inv_sheet: { personas: 0, por_vinculacion: {} }, planta_2021: { total: 1, edad_media: 40, por_edad: {} } },
  artes: { prof: [], proy_grupos: {}, fac_creacion: {}, creacion_proyectos_unicos: 0 },
  creacion: { obras: 0, personas: 0, grupos: 0 },
  pi: null,
};

test.describe("F102 direct filters (no server)", () => {
  test("the constant is on and the filter of centre or unit keeps only the products of the entity; without an entity nothing changes", () => {
    expect(ENTITY_FILTERS_ARE_DIRECT).toBe(true);
    const ds = createFoundationsDataset(raw);
    expect(filterProducts(ds, DEFAULT_FOUNDATIONS_FILTERS).F).toHaveLength(3);
    expect(filterProducts(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: 0 }).F).toHaveLength(1); // the expansion would add the product of the other centre in the same topic
    expect(filterProducts(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, facultyIndex: 0 }).F).toHaveLength(1);
    expect(computeFoundations(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: 0 }).tiles.products).toBe(1);
    expect(productOptionAvailability(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: 0 }).unit).toEqual(new Set([0]));
  });

  test("the entity filter and the subfield filter combine with AND", () => {
    const ds = createFoundationsDataset(raw);
    const f = { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: 1, subfieldIndex: 0 };
    expect(filterProducts(ds, f).F.every((p) => p[PRODUCT.GROUPS].includes(1))).toBe(true);
  });

  test("the texts: the note of method, the notice with few products and the help of the panels say that the filters are direct", () => {
    expect(methodNotes("X")).toContain(DIRECT_FILTERS_NOTE);
    expect(DIRECT_FILTERS_NOTE).toBe("Los filtros de centro, unidad y subunidad cuentan solo los productos de la entidad elegida.");
    expect(fewProductsWarning(7)).toBe("Esta selección tiene 7 productos; con pocos productos varios paneles pueden quedar vacíos.");
    expect(FEW_PRODUCTS_THRESHOLD).toBe(50);
    /* F112 (D-253 9): the rule is said once, in the foot; no «Cuidado» repeats it */
    for (const key of ["p2", "p4", "p10", "p16", "p19", "p1", "p12", "p13", "p14"]) expect([PANEL_HELP[key].care].flat().join(" ")).not.toContain("solo se cuentan los productos de esa entidad");
  });
});

/* F99 «directo» column (products and publications of the real bundle, default years) and the works of the Board 2 for the same entity. */
const SCENARIOS = [
  { name: "centro Artes", f: (r) => ({ centerIndex: r.centros.indexOf("Artes") }), products: 1056, publications: 363, t2: 415, options: { unit: 14, subunit: 23 } },
  { name: "centro Idiomas", f: (r) => ({ centerIndex: r.centros.indexOf("Idiomas") }), products: 734, publications: 342, t2: 342, options: { unit: 10, subunit: 19 } },
  { name: "centro Exactas", f: (r) => ({ centerIndex: r.centros.indexOf("Exactas") }), products: 5368, publications: 3588, t2: 3607, options: { unit: 18, subunit: 53 } },
  { name: "unidad Ingeniería", f: (r) => ({ facultyIndex: r.facs.findIndex((n) => /Ingenier/i.test(n)) }), products: 10539, publications: 5519, t2: 5581, options: { center: 21, subunit: 83 } },
  { name: "unidad Instituto de Filosofía", f: (r) => ({ facultyIndex: r.facs.findIndex((n) => /Filosof/i.test(n)) }), products: 851, publications: 554, t2: 557, options: { center: 11, subunit: 30 } },
  { name: "subunidad Instituto de Biología", f: (r) => ({ departmentIndex: r.deps.findIndex((n) => /Instituto de Biolog/i.test(n)) }), products: 3040, publications: 2053, t2: 2060, options: { center: 18, unit: 18 } },
];

test.describe("F102 against the real bundles (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("without an entity filter 82.589 products; with an entity, the figures of F99; the T3 agrees with the T2 within 70 products; the lists of the filters", async () => {
    test.setTimeout(250000);
    const b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const b2 = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    b2.funders = b2.ext?.funders;
    for (const p of b3.P) if (p[0] === 0) p[0] = null; /* what the adapter does (capacidadesAdapter) */
    const ds3 = createFoundationsDataset(b3);
    const ds2 = createCollaborationDataset(b2);
    expect(b3.P).toHaveLength(82589);
    expect(computeFoundations(ds3, DEFAULT_FOUNDATIONS_FILTERS).tiles.products).toBe(82589); /* the adapter turns the year 0 of 1.130 products into «sin año»: they count with the default years */
    for (const s of SCENARIOS) {
      const f = { ...DEFAULT_FOUNDATIONS_FILTERS, ...s.f(b3) };
      const r = computeFoundations(ds3, f);
      expect(r.tiles.products, `${s.name} products`).toBe(s.products);
      expect(r.tiles.publications, `${s.name} publications`).toBe(s.publications);
      const f2 = { yearFrom: 2010, yearTo: 2026, centerIndex: f.centerIndex, facultyIndex: f.facultyIndex, departmentIndex: f.departmentIndex };
      const works = computeCollaboration(ds2, f2).kpis.works;
      expect(works - r.tiles.publications, `${s.name}: the Board 2 has the innovation and appropriation products that the T3 counts apart`).toBeGreaterThanOrEqual(0);
      expect(works - r.tiles.publications, `${s.name}: T3 against T2`).toBeLessThanOrEqual(70);
      expect(works, `${s.name} works of the Board 2`).toBe(s.t2);
      const options = productOptionAvailability(ds3, f);
      for (const [key, n] of Object.entries(s.options)) expect(options[key].size, `${s.name} options ${key}`).toBe(n);
    }
  });

  for (const [name, query, minProducts] of [["Artes", "center=1", 1056], ["Idiomas", "center=16", 734], ["Exactas", "center=12", 5349], ["Multilingua (1 producto)", "department=102", 1]]) {
    test(`page ${name}: no «NaN», «undefined» or «Infinity», no console error, the panels in 0 show their empty state, and the notice with few products only when it is the case`, async ({ page }) => {
      test.setTimeout(200000);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${BASE}/observatories/vri-udea/board-3?${query}`, { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId("chart-card").first()).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(3500);
      const text = await page.locator("body").innerText();
      expect(text).not.toMatch(/\bNaN\b|undefined|Infinity|\[object/);
      const cards = await page.getByTestId("chart-card").evaluateAll((els) => els.map((e) => ({ title: e.querySelector(".ant-card-head-title")?.textContent.slice(0, 4), empty: !!e.querySelector(".ant-empty") })));
      console.log(`[live] ${name}: ${cards.length} panels, empty: ${cards.filter((c) => c.empty).map((c) => c.title).join(" | ") || "none"}; notice: ${await page.getByTestId("few-products-warning").count()}`);
      if (minProducts < 50) await expect(page.getByTestId("few-products-warning")).toContainText("Esta selección tiene");
      else await expect(page.getByTestId("few-products-warning")).toHaveCount(0);
      await expect(page.getByTestId("method-notes")).toContainText("cuentan solo los productos de la entidad elegida");
      expect(errors.filter((m) => !/enableRelativeCoordinates/.test(m))).toEqual([]);
    });
  }
});
