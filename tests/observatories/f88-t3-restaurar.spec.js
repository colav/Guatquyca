/*
 * F88 part A (D-200): panel 16 of Board 3 counts the datasets whose year is 2026 among the filtered ones (the panel's own total),
 * so the note can say «N de los M conjuntos de datos tienen año 2026». Small bundle, no server.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FOUNDATIONS_FILTERS, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";

const TIPOS = ["articulo", "libro", "capitulo", "apropiacion", "inv_creacion", "audiovisual", "prod_artistica", "dataset", "software", "preprint", "tesis_posgrado", "tesis_pregrado", "ondas"];
const product = (year, type) => [year, type, -1, 0, 0, null, null, 0, 0, [], [], [], [], [0], [], 0, 0, 0];
const raw = (P) => ({
  doms: [], fields: [], subs: [], sub_meta: [], tops: [], top_meta: {}, facs: [], deps: [], groups: [], centros: [], agendas: [], agendas_all: [],
  tipos: TIPOS, tesis_sub: ["otra"], ambitos: ["Local", "Departamental", "Nacional", "Internacional"],
  P, A: [[1, 1, 1980, 1, 0, 0, -1, -1, -1, "vinculado", "", "", "doctorado"]], inst: [], age_bins: [],
  proj: { years: [2020], levels: ["Pregrado"], all: [[5]], by_centro: {}, estudiantes_unicos: 5, proyectos_total: 1 },
  metas: [],
  talent: { staff_total: 1, por_minciencias: {}, poblacion_ajustada: 1, poblacion_censada: 1, inv_sheet: { personas: 0, por_vinculacion: {} }, planta_2021: { total: 1, edad_media: 40, por_edad: {} } },
  artes: { prof: [], proy_grupos: {}, fac_creacion: {}, creacion_proyectos_unicos: 0 }, creacion: { obras: 0, personas: 0, grupos: 0 }, pi: null,
});
const compute = (P, filters = {}) => computeFoundations(createFoundationsDataset(raw(P)), { ...DEFAULT_FOUNDATIONS_FILTERS, ...filters }).datasets;

test.describe("panel 16, datasets with year 2026 (no server)", () => {
  const P = [product(2026, 7), product(2026, 7), product(2024, 7), product(2026, 0), product(2020, 7)];

  test("counts only datasets of 2026 (not articles of 2026) against the total of datasets", () => {
    const d = compute(P);
    expect(d.total).toBe(4);
    expect(d.year2026).toBe(2);
  });

  test("follows the filters of the panel: a range that ends in 2025 leaves none", () => {
    const d = compute(P, { yearFrom: 2010, yearTo: 2025 });
    expect(d.total).toBe(2);
    expect(d.year2026).toBe(0);
  });

  test("no datasets of 2026: zero (the note is not shown)", () => {
    expect(compute([product(2024, 7)]).year2026).toBe(0);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("panel 16 with the real bundle (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the bundle gives 119 of 406 datasets with year 2026 (B141) and the page says it", async ({ page, request }) => {
    test.setTimeout(250000);
    const response = await request.get(`${API}/observatories/vri-udea/boards/3/bundle`);
    console.log(`[live] ETag of the T3: ${response.headers().etag}`);
    const body = await response.json();
    const b3 = body.data || body;
    const d = computeFoundations(createFoundationsDataset(b3), DEFAULT_FOUNDATIONS_FILTERS).datasets;
    console.log(`[live] datasets: ${d.total}; with year 2026: ${d.year2026}`);
    expect(d.total).toBe(406);
    expect(d.year2026).toBe(119);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    await expect(page.getByText("16 · Conjuntos de datos abiertos por tópico")).toBeVisible({ timeout: 120000 });
    await expect(page.locator("body")).toContainText("119 de los 406 conjuntos de datos tienen año 2026 (fecha de carga del registro).", { timeout: 60000 });
  });
});
