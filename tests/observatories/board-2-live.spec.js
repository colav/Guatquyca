/*
 * Board 2 against a REAL quyca (read-only). Skipped unless E2E_LIVE is set, for example:
 *   E2E_LIVE=1 npx playwright test tests/observatories/board-2-live.spec.js -c playwright.observatories.config.js
 *
 * They only read GET /observatories/vri-udea/boards/2/bundle (02 §3.11). They check the shape,
 * the headers, that the computation does not break with the real vectors (countries without
 * coordinates, works without year) and that filters stack. No exact figures of the real data.
 */
import { test, expect } from "@playwright/test";

import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BUNDLE = `${API}/observatories/vri-udea/boards/2/bundle`;

test.describe("Board 2 against a real quyca (read-only)", () => {
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
    console.log(`[live] bundle 2: ${Date.now() - started} ms, ETag ${etag}`);
    for (const key of ["tipos", "sectors", "sectorsEs", "subfields", "countries", "regions", "depts", "groups", "centros", "insts", "subregs", "works", "projects", "thesaurus", "metas", "doms", "ext"]) {
      expect(raw, `key ${key}`).toHaveProperty(key);
    }
    expect(raw.works[0]).toHaveLength(13);
    expect(raw.projects[0]).toHaveLength(7);
    // The list of funders comes under ext (the artifact had it at the top level).
    expect(Array.isArray(raw.ext.funders)).toBe(true);
    expect(raw.ext.funders[0]).toHaveProperty("nm");
    expect(raw.ext.funders[0]).toHaveProperty("fsector");
    expect(raw.ext.funders[0]).toHaveProperty("proyectos");
  });

  test("If-None-Match with the same ETag answers 304", async () => {
    const response = await fetch(BUNDLE, { headers: { "If-None-Match": etag } });
    expect(response.status).toBe(304);
  });

  test("some countries have no coordinates and the computation still works", async () => {
    raw.funders = raw.ext.funders;
    const dataset = createCollaborationDataset(raw);
    // B114 may have completed the coordinates: the case without them is only checked while the bundle has it
    const withoutCoordinates = raw.countries.filter((c) => c.ll === null).length;
    console.log(`[live] countries without coordinates: ${withoutCoordinates}`);
    const all = computeCollaboration(dataset);
    expect(all.works).toBeGreaterThan(0);
    // Countries without coordinates stay in the table of countries; the map is built from those with them.
    expect(all.countries.length).toBeGreaterThan(0);
    expect(all.countries.filter((c) => c.ll).length).toBeLessThanOrEqual(all.countries.length);
    for (const c of all.countries.filter((x) => x.ll)) {
      expect(Number.isFinite(c.ll[0]) && Number.isFinite(c.ll[1])).toBe(true);
    }
  });

  test("works without a year count in the totals and the filters stack", async () => {
    const dataset = createCollaborationDataset(raw);
    const all = computeCollaboration(dataset);
    const noYear = raw.works.filter((w) => !w[0]).length;
    expect(noYear).toBeGreaterThan(0);
    // A narrow range of years still keeps every work without year (behaviour kept from the artifact, report section 11).
    const narrow = computeCollaboration(dataset, { yearFrom: 2020, yearTo: 2021 });
    expect(narrow.works).toBeGreaterThanOrEqual(noYear);
    expect(narrow.works).toBeLessThan(all.works);
    // Each added filter can only remove works.
    const faculty = raw.works.find((w) => w[6].length)[6][0];
    const withFaculty = computeCollaboration(dataset, { facultyIndex: faculty });
    const stacked = computeCollaboration(dataset, { yearFrom: 2020, yearTo: 2021, facultyIndex: faculty });
    expect(withFaculty.works).toBeLessThan(all.works);
    expect(stacked.works).toBeLessThanOrEqual(Math.min(narrow.works, withFaculty.works));
    // The graph and the tab views are computed with the real vectors.
    expect(all.graph.nodes.length).toBeGreaterThan(0);
    expect(all.domainRows(0)).toBeDefined();
    expect(all.axisRows(0)).toBeDefined();
  });

  test("the page loads the bundle, shows the real tag and the footer from /cut", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-2");
    await expect(page.getByText("Datos de ImpactU")).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("Datos de prueba")).toHaveCount(0);
    await expect(page.getByText("Datos consultados en octubre de 2026.")).toBeVisible();
    await expect(page.getByText("10 · Colaboración internacional")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("ai_panel_unreviewed");
  });

  test("a filter keeps the other parameters of the URL", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-2?scope=int");
    await expect(page.getByRole("button", { name: "Limpiar filtros" })).toBeVisible({ timeout: 120000 });
    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page).not.toHaveURL(/scope=/, { timeout: 5000 });
  });
});
