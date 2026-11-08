/*
 * Board 3 against a REAL quyca (read-only). Skipped unless E2E_LIVE is set, for example:
 *   E2E_LIVE=1 npx playwright test tests/observatories/board-3-live.spec.js -c playwright.observatories.config.js
 *
 * They only read GET /observatories/vri-udea/boards/3/bundle (02 §3.11). They check the shape,
 * the headers, the rules of the bundle (author level from A[10], repository flag null = no data,
 * group category from the 957 call, products without year) and that the page does not break
 * with the real vectors. No exact figures of the real data.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FOUNDATIONS_FILTERS as DEFAULTS, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";
import { withoutPersonalIdentifiers } from "../../lib/observatories/data/capacidadesAdapter";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BUNDLE = `${API}/observatories/vri-udea/boards/3/bundle`;

test.describe("Board 3 against a real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test.describe.configure({ mode: "serial" });

  let raw;
  let etag;

  test("the bundle answers 200 with ETag and the keys the board reads (02 §3.11)", async () => {
    const started = Date.now();
    const response = await fetch(BUNDLE, { headers: { "Accept-Encoding": "gzip" } });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    etag = response.headers.get("etag");
    expect(etag).toMatch(/^"\d+-[0-9a-f]+"$/);
    raw = await response.json();
    console.log(`[live] bundle 3: ${Date.now() - started} ms, ETag ${etag}`);
    for (const key of ["doms", "fields", "subs", "tops", "facs", "deps", "groups", "centros", "agendas", "tipos", "tesis_sub", "ambitos", "inst", "P", "A", "age_bins", "proj", "creacion", "metas", "talent", "artes"]) {
      expect(raw, `key ${key}`).toHaveProperty(key);
    }
    expect(raw.P[0]).toHaveLength(18); // B126b: P[16] handle and P[17] preprint
    expect(raw.A[0]).toHaveLength(13);
    // The bundle carries no personal identifier in the arts table (02 §3.11).
    expect(raw.artes.prof.some((p) => "id" in p)).toBe(false);
    expect(raw.metas.length).toBeGreaterThan(0);
  });

  test("If-None-Match with the same ETag answers 304", async () => {
    const response = await fetch(BUNDLE, { headers: { "If-None-Match": etag } });
    expect(response.status).toBe(304);
  });

  test("rules of the bundle: author level in A[10], repository flag null = no data, products without year", async () => {
    // A[10] is the Minciencias category of the author: the four "Investigador" levels, old SCIENTI codes and "" (no category).
    const levels = new Set(raw.A.map((a) => a[10]));
    for (const level of ["Investigador Emérito", "Investigador Sénior", "Investigador Asociado", "Investigador Junior", ""]) {
      expect(levels.has(level), `level "${level}"`).toBe(true);
    }
    expect([...levels].some((l) => l && !l.startsWith("Investigador"))).toBe(true); // "otras siglas"
    // P[6] (text in repository) is 1, 0 or null; it only exists inside the open works (closed = 0 or null).
    const repo = new Set(raw.P.map((p) => p[6]));
    expect([...repo].every((v) => v === 1 || v === 0 || v === null)).toBe(true);
    expect(repo.has(null)).toBe(true);
    // Products without year count in the totals and stay out of the series by year.
    expect(raw.P.filter((p) => !p[0]).length).toBeGreaterThan(0);
    // Types that only the bundle has still have a label (no raw code reaches the screen).
    expect(raw.tipos.length).toBe(13); // B126b: 13 types (the 10 without products left)
  });

  test("the computation works with the real vectors and filters stack", async () => {
    /* Same year normalisation as the adapter: 0 (bundle) = null (model). */
    const normalised = { ...raw, P: raw.P.map((p) => (p[0] === 0 ? [null, ...p.slice(1)] : p)) };
    const dataset = createFoundationsDataset(withoutPersonalIdentifiers(normalised));
    const all = computeFoundations(dataset, DEFAULTS);
    expect(all.status.products).toBe(raw.P.length);
    expect(all.status.authors).toBeGreaterThan(0);
    expect(all.talent.staff_total).toBeGreaterThan(0);
    const narrow = computeFoundations(dataset, { ...DEFAULTS, yearFrom: 2020, yearTo: 2021 });
    expect(narrow.status.products).toBeLessThan(all.status.products);
    const stacked = computeFoundations(dataset, { ...DEFAULTS, yearFrom: 2020, yearTo: 2021, policyIndex: 0 });
    expect(stacked.status.products).toBeLessThanOrEqual(narrow.status.products);
    // Panel c (staff by product type) labels: none is an English/snake-case code.
    for (const row of all.staffByType) expect(row.label).not.toMatch(/_/);
  });

  test("the page loads the bundle, shows the real tag, the new staff label and the footer from /cut", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/observatories/vri-udea/board-3");
    await expect(page.getByText("Datos de ImpactU · ensayo con limitaciones de datos")).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("Datos de prueba")).toHaveCount(0);
    await expect(page.getByText("1 · Talento investigador por nivel", { exact: false }).first()).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).toContain("con contrato vigente al 30 de mayo");
    expect(text).not.toContain("tabla de personal anterior");
    expect(text).not.toContain("undefined");
    expect(text).not.toMatch(/ai_panel/);
    expect(text).not.toMatch(/Ondas/);
    expect(text).toContain("Datos consultados en octubre de 2026.");
    expect(errors).toEqual([]);
  });
});
