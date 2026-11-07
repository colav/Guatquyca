/*
 * F79 (D-184): choropleth of products by country in Board 2. The first block needs no server (join by ISO, corrections of the
 * polygons without code, countries without outline); the second reads the real quyca and draws the page once, measuring
 * (E2E_LIVE=1). No screenshots are saved: the pixels of the map are compared in memory.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { POLYGON_KEYS, geoMapData, withoutOutlineText } from "../../lib/observatories/geoMap";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const geo = JSON.parse(fs.readFileSync(path.join(process.cwd(), "lib/observatories/data/geo/world.json"), "utf8"));

test.describe("join of the countries with the polygons (no server)", () => {
  test("the file (B131) has 215 polygons, only three without code (the four fixes come in the file) and it carries no counts", () => {
    expect(geo.features).toHaveLength(215);
    expect(geo.features.filter((f) => !f.properties.country_code).map((f) => f.properties.name).sort()).toEqual(["East timor", "Prince edward island", "Tm"]);
    for (const code of ["RO", "CW", "HK", "MO"]) expect(geo.features.some((f) => f.properties.country_code === code)).toBe(true);
    expect(Object.keys(geo.features[0].properties).sort()).toEqual(["country_code", "name"]);
    // the file has no counts of coauthorships: they are calculated with the filters of the board
    expect(geo.features.every((f) => !("count" in f.properties) && !("log_count" in f.properties))).toBe(true);
  });

  test("count and log_count by country; the polygons without products have 0; the countries without polygon are listed with their products", () => {
    const countries = [
      { key: "CO", name: "Colombia", region: "Sudamérica", value: 100 },
      { key: "US", name: "Estados Unidos", region: "Norteamérica", value: 40 },
      { key: "RO", name: "Rumania", region: "Europa", value: 3 },
      { key: "TW", name: "Taiwán", region: "Asia", value: 5 }, // no polygon
      { key: "VA", name: "Ciudad del Vaticano", region: "Europa", value: 2 }, // no polygon
    ];
    const { data, withoutOutline, drawn } = geoMapData(geo, countries, POLYGON_KEYS.countries);
    const of = (code) => data.features.filter((f) => f.properties.country_code === code);
    expect(of("CO").every((f) => f.properties.count === 100 && f.properties.log_count === Math.log(100) && f.properties.region === "Sudamérica")).toBe(true);
    expect(of("RO")[0].properties.count).toBe(3);
    expect(data.features.filter((f) => f.properties.count === 0).length).toBeGreaterThan(150);
    expect(withoutOutline.map((c) => c.key)).toEqual(["TW", "VA"]);
    expect(drawn).toBe(3);
    // the geometry is not touched
    expect(data.features[0].geometry).toBe(geo.features[0].geometry);
    // the text is calculated, not written by hand
    expect(withoutOutlineText(withoutOutline)).toBe("2 países sin contorno en el mapa: Taiwán, Ciudad del Vaticano; 7 productos. Sí cuentan en la tabla.");
    expect(withoutOutlineText([])).toBe("");
    expect(withoutOutlineText([{ key: "TW", name: "Taiwán", value: 1 }])).toContain("1 país sin contorno");
  });
});

test.describe("the page of Board 2 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("the map is drawn, redraws with a filter, and the countries without outline are counted", async ({ page, request }) => {
    test.setTimeout(240000);
    const raw = await (await request.get(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    const codes = new Set(geo.features.map((f) => f.properties.country_code));
    const bundleMissing = raw.countries.filter((c) => !codes.has(c.c)).map((c) => c.c);
    console.log(`[live] countries of the bundle: ${raw.countries.length}; without polygon even after the corrections: ${bundleMissing.length} (${bundleMissing.join(", ")})`);

    expect(bundleMissing.sort()).toEqual(["GI", "GU", "MC", "MV", "PS", "TW", "VA"]); // B130: 163 of 170 have an outline
    expect(raw.countries.length - bundleMissing.length).toBe(163);
    const t0 = Date.now();
    await page.goto("/observatories/vri-udea/board-2");
    const box = page.getByTestId("country-map");
    await box.waitFor({ timeout: 120000 });
    await box.evaluate((el) => el.scrollIntoView({ block: "center" }));
    // the map is drawn when its pixels stop being the empty background: poll the area
    const shot = async () => (await box.screenshot({ type: "png" })).toString("base64");
    const blank = async () => {
      const b = await box.screenshot({ type: "png" });
      return b.length;
    };
    let drawnAt = 0;
    const start = Date.now();
    let first = await blank();
    while (Date.now() - start < 60000) {
      await page.waitForTimeout(250);
      const now = await blank();
      if (Math.abs(now - first) > 2000) {
        drawnAt = Date.now() - start;
        break;
      }
    }
    console.log(`[live] map: ${box ? "present" : "absent"}; drawn ${drawnAt ? `${drawnAt} ms after the container appears (${Date.now() - t0} ms from the navigation)` : "NOT detected as drawn in 60 s"}`);
    expect(drawnAt, "the map changed from its first state (WebGL drew)").toBeGreaterThan(0);
    // the countries without outline are counted in the help «?», with the figures of the real join
    await page.getByTestId("country-map-help").locator("button").hover();
    const helpText = await page.locator(".ant-tooltip:not(.ant-tooltip-hidden)").innerText();
    console.log(`[live] help of the map: ${helpText}`);
    expect(helpText).toMatch(/^7 países sin contorno en el mapa: .*Taiwán.*; [0-9.]+ productos[.] Sí cuentan en la tabla.$/s);
    await page.mouse.move(0, 0);
    const before = await shot();
    // the tooltip names the country, the region and the products
    // a filter: the map redraws and the table changes
    const rowsBefore = await page.locator("[data-testid=country-map] canvas").count();
    const tFilter = Date.now();
    await page.goto("/observatories/vri-udea/board-2?scope=int");
    await page.getByTestId("country-map").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3000);
    await page.getByTestId("country-map").evaluate((el) => el.scrollIntoView({ block: "center" }));
    const after = await shot();
    console.log(`[live] canvases in the map: ${rowsBefore}; the pixels change with the filter scope=int: ${before !== after}`);
    expect(before).not.toBe(after);
    void tFilter;
  });
});

test.describe("cost of the map (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("redraw when a filter changes: time, and whether the map is rebuilt", async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    const box = page.getByTestId("country-map");
    await box.waitFor({ timeout: 120000 });
    await page.waitForTimeout(6000);
    await box.evaluate((el) => {
      el.scrollIntoView({ block: "center" });
      // mark the canvases and the container of the map to see whether they are replaced
      el.querySelectorAll("canvas").forEach((c) => (c.dataset.mark = "m1"));
      window.__mapRoot = el.firstElementChild;
    });
    // time the drawing with the animation frames: from the click of the filter until the pixels of the canvas change
    await page.evaluate(() => {
      window.__perf = { t0: 0, drawn: 0 };
      const c = document.querySelector("[data-testid=country-map] canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      window.__perf.hasGl = !!gl;
    });
    const readHash = () => box.screenshot({ type: "png" }).then((b) => b.length + ":" + b.subarray(Math.floor(b.length / 2), Math.floor(b.length / 2) + 64).toString("base64"));
    const h0 = await readHash();
    await page.getByTestId("filter-scope").locator(".ant-select-selector").click();
    const option = page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option").nth(1);
    const t0 = Date.now();
    await option.click();
    // timeline of the changes of the pixels of the map: every change is a repaint; the last one is the redraw with the new data
    const changes = [];
    let last = h0;
    while (Date.now() - t0 < 6000) {
      const h = await readHash();
      if (h !== last) {
        changes.push(Date.now() - t0);
        last = h;
      }
    }
    const at = changes.length ? changes[0] : 0;
    const settled = changes.length ? changes[changes.length - 1] : 0;
    await page.waitForTimeout(1500);
    const info = await box.evaluate((el) => ({
      sameRoot: window.__mapRoot === el.firstElementChild,
      marked: [...el.querySelectorAll("canvas")].filter((c) => c.dataset.mark === "m1").length,
      canvases: el.querySelectorAll("canvas").length,
    }));
    console.log(`[live] map redraw after the filter: pixels change at ${changes.join(", ")} ms after the click (first ${at}, last ${settled}; the figures include the 200 ms of the filters and the screenshots used to see it; final state differs from the initial one: ${last !== h0}); same container ${info.sameRoot}; the same canvases kept ${info.marked} of ${info.canvases}`);
    expect(at).toBeGreaterThan(0);
    expect(last).not.toBe(h0);
  });
});
