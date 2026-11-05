/*
 * Board 1 against a REAL quyca (read-only). Skipped unless E2E_LIVE is set, for example:
 *   E2E_LIVE=1 npx playwright test tests/observatories/board-1-live.spec.js -c playwright.observatories.config.js
 *
 * They only read: GET /observatories/vri-udea/boards/1/bundle and /cut (02 §3.11 and §3.12). They
 * check the shape, the headers, the error states and that the filters stack on the counts. They
 * do not assert exact figures of the real data (those change with every load).
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset, rankActors, rankAxes, rankOds } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BUNDLE = `${API}/observatories/vri-udea/boards/1/bundle`;

test.describe("Board 1 against a real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test.describe.configure({ mode: "serial" });

  let raw;
  let etag;

  test("the bundle answers 200 with ETag, gzip and the shape the board reads (02 §3.11)", async () => {
    const started = Date.now();
    const response = await fetch(BUNDLE, { headers: { "Accept-Encoding": "gzip" } });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("cache-control")).toContain("no-cache");
    etag = response.headers.get("etag");
    expect(etag).toMatch(/^"\d+-[0-9a-f]+"$/);
    raw = await response.json();
    console.log(`[live] bundle 1: ${Date.now() - started} ms, ETag ${etag}`);
    for (const key of ["meta", "topics", "facs", "deps", "cens", "groups", "ejes", "facts", "pies", "subregiones", "actores", "ods", "afils", "actor_tipos", "obs"]) {
      expect(raw, `key ${key}`).toHaveProperty(key);
    }
    // No envelope: it is not a list, so there is no meta.count (02 §3.11).
    expect(raw.meta).not.toHaveProperty("count");
    // facts[0..9] keep their positions; 10 to 13 are the new ones.
    expect(raw.facts[0]).toHaveLength(14);
    expect(raw.facts[0][1]).toBeGreaterThanOrEqual(raw.meta.years[0]);
    expect(raw.facts.length).toBe(raw.meta.n_topic);
  });

  test("If-None-Match with the same ETag answers 304", async () => {
    const response = await fetch(BUNDLE, { headers: { "If-None-Match": etag } });
    expect(response.status).toBe(304);
    expect((await response.arrayBuffer()).byteLength).toBe(0);
  });

  test("an unknown observatory or board is a 404 with the error of 02 §3.11", async () => {
    const response = await fetch(`${API}/observatories/otro/boards/1/bundle`);
    expect(response.status).toBe(404);
    expect(await response.json()).toHaveProperty("error");
    expect((await fetch(`${API}/observatories/vri-udea/boards/9/bundle`)).status).toBe(404);
  });

  test("/cut gives the footer text (02 §3.12)", async () => {
    const response = await fetch(`${API}/observatories/vri-udea/cut`);
    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(typeof data.texto).toBe("string");
    expect(data.texto.length).toBeGreaterThan(0);
    expect(data.load_id).toBeGreaterThan(0);
  });

  test("the dataset of the bundle computes and the counts stack with the filters", async () => {
    const dataset = createDataset(raw);
    expect(dataset.hasFactDetails).toBe(true);
    const all = computeCapacity(dataset);
    expect(all.products).toBeGreaterThan(0);

    const sum = (arr) => [...arr].reduce((a, b) => a + b, 0);
    const byYears = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022 });
    const byFaculty = computeCapacity(dataset, { facultyIndex: raw.facts.find((f) => f[6].length)[6][0] });
    const stacked = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022, facultyIndex: raw.facts.find((f) => f[6].length)[6][0] });

    // Each added filter can only remove products, and the complements follow in the same pass.
    expect(byYears.products).toBeLessThan(all.products);
    expect(stacked.products).toBeLessThanOrEqual(Math.min(byYears.products, byFaculty.products));
    expect(sum(stacked.subregionCounts)).toBeLessThanOrEqual(sum(byYears.subregionCounts));
    expect(sum(stacked.odsCounts)).toBeLessThanOrEqual(sum(byYears.odsCounts));
    expect(sum(stacked.actorCounts.values())).toBeLessThanOrEqual(sum(byYears.actorCounts.values()));
    expect(sum(all.subregionCounts)).toBeGreaterThan(0);
    expect(rankOds(dataset, all).length).toBe(17);
    expect(rankActors(dataset, all).length).toBeGreaterThan(0);
    // The ODS cut (score >= 0.40) leaves fewer assignments than the raw rows.
    expect(sum(all.odsCounts)).toBeLessThanOrEqual(raw.facts.reduce((n, f) => n + f[11].length, 0));
  });

  test("the axis–work pairs count by confidence: high and medium by default, low only on request, and filters stack", async () => {
    const dataset = createDataset(raw);
    const total = (r) => r.axisPairCounts.reduce((a, b) => a + b, 0);
    const core = computeCapacity(dataset);
    const all = computeCapacity(dataset, { pairLevel: "all" });
    expect(core.filters.pairLevel).toBe("core");
    expect(total(core)).toBeGreaterThan(0);
    expect(total(all)).toBeGreaterThan(total(core));
    // Same totals as counting the pairs of the bundle by hand.
    const byHand = (max) => raw.facts.reduce((n, f) => n + f[12].filter((p) => p[1] <= max).length, 0);
    expect(total(core)).toBe(byHand(1));
    expect(total(all)).toBe(byHand(2));
    // The ranking comes from the pairs, sorted, at most 15 rows, and low confidence can only add.
    const rows = rankAxes(dataset, core);
    expect(rows.length).toBeLessThanOrEqual(15);
    expect(rows.map((r) => r.value)).toEqual([...rows.map((r) => r.value)].sort((a, b) => b - a));
    expect(rankAxes(dataset, all)[0].value).toBeGreaterThanOrEqual(rows[0].value);
    // Stacked filters: years and a scope only remove pairs.
    const byYears = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022 });
    const stacked = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022, scope: dataset.scopes[0] });
    expect(total(byYears)).toBeLessThan(total(core));
    expect(total(stacked)).toBeLessThanOrEqual(total(byYears));
  });

  test("the confidence control goes to the URL (?pairs=all) and keeps the other parameters", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByText("Confianza de la asignación a ejes (IA)")).toBeVisible({ timeout: 120000 });
    await page.getByText("Incluir baja", { exact: true }).click();
    await expect(page).toHaveURL(/pairs=all/, { timeout: 5000 });
    await expect(page.getByText("productos con asignación de cualquier confianza (incluye baja)")).toBeVisible();
    await page.getByText("Alta y media", { exact: true }).click();
    await expect(page).not.toHaveURL(/pairs=/, { timeout: 5000 });
    await expect(page.getByText("productos con asignación de confianza alta o media")).toBeVisible();
  });

  test("the page loads the bundle, shows the footer from /cut and no 'Datos de prueba'", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByText("Datos de ImpactU · métrica de liderazgo provisional")).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("Datos de prueba")).toHaveCount(0);
    await expect(page.getByText("Datos consultados en octubre de 2026.")).toBeVisible();
    await expect(page.getByText("Ránking ODS")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("ai_panel_unreviewed");
  });
});
