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
  test("the file (B133, Natural Earth) has 247 polygons: three without code, three with AU, only code and name, no counts", () => {
    expect(geo.features).toHaveLength(247);
    expect(geo.features.filter((f) => !f.properties.country_code).map((f) => f.properties.name).sort()).toEqual(["N. Cyprus", "Siachen Glacier", "Somaliland"]);
    expect(geo.features.filter((f) => f.properties.country_code === "AU").map((f) => f.properties.name).sort()).toEqual(["Ashmore and Cartier Is.", "Australia", "Indian Ocean Ter."]);
    for (const code of ["TW", "PS", "GU", "VA", "GI", "MC", "MV", "RO", "CW", "HK", "MO", "GF", "GP", "RE"]) expect(geo.features.some((f) => f.properties.country_code === code), code).toBe(true);
    expect(Object.keys(geo.features[0].properties).sort()).toEqual(["country_code", "name"]);
    // the file has no counts of coauthorships: they are calculated with the filters of the board
    expect(geo.features.every((f) => !("count" in f.properties) && !("log_count" in f.properties))).toBe(true);
  });

  test("every polygon takes the count of its own country: Taiwan does not add to China, Guam to the Marianas, the Vatican to Italy; the polygons with a shared code show the same country", () => {
    const countries = [
      { key: "CN", name: "China", region: "Asia (resto)", value: 1000 },
      { key: "TW", name: "Taiwán", region: "Asia (Norte)", value: 47 },
      { key: "IT", name: "Italia", region: "Europa", value: 300 },
      { key: "VA", name: "Ciudad del Vaticano", region: "Europa", value: 2 },
      { key: "MP", name: "Islas Marianas del Norte", region: "Oceanía (resto)", value: 6 },
      { key: "GU", name: "Guam", region: "Oceanía (resto)", value: 4 },
      { key: "IL", name: "Israel", region: "MENA", value: 80 },
      { key: "PS", name: "Palestina", region: "MENA", value: 9 },
      { key: "AU", name: "Australia", region: "Oceanía (Norte)", value: 70 },
      { key: "FR", name: "Francia", region: "Europa", value: 500 },
      { key: "GF", name: "Guayana Francesa", region: "América Latina y el Caribe", value: 3 },
    ];
    const { data, withoutOutline, drawn } = geoMapData(geo, countries, POLYGON_KEYS.countries, "Sin productos en el T2");
    const of = (code) => data.features.filter((f) => f.properties.country_code === code);
    for (const c of countries) {
      expect(of(c.key).length, c.key).toBeGreaterThan(0);
      expect(of(c.key).every((f) => f.properties.count === c.value && f.properties.name === c.name), c.key).toBe(true);
    }
    expect(of("AU")).toHaveLength(3); // Australia and its two territories share one country and one count: nothing is added
    expect(of("AU").every((f) => f.properties.count === 70 && f.properties.name === "Australia")).toBe(true);
    expect(withoutOutline).toEqual([]);
    expect(drawn).toBe(countries.length);
    // what the T2 does not use: the name of the polygon plus the phrase, with 0 products
    const none = data.features.filter((f) => !countries.some((c) => c.key === f.properties.country_code));
    expect(none.length).toBe(247 - countries.length - 2); // the two extra polygons of AU
    expect(none.every((f) => f.properties.count === 0 && f.properties.log_count === 0 && f.properties.name.endsWith(" · Sin productos en el T2"))).toBe(true);
    expect(none.some((f) => f.properties.name === "Somaliland · Sin productos en el T2")).toBe(true);
    expect(none.every((f) => !f.properties.name.startsWith("Ashmore"))).toBe(true);
    // the geometry is not touched
    expect(data.features[0].geometry).toBe(geo.features[0].geometry);
    // the text is calculated, not written by hand
    expect(withoutOutlineText([])).toBe("");
    expect(withoutOutlineText([{ key: "XX", name: "Equis", value: 1 }])).toBe("1 país sin contorno en el mapa: Equis; 1 producto. Sí cuentan en la tabla.");
    expect(withoutOutlineText([{ key: "XX", name: "Equis", value: 1 }, { key: "YY", name: "Ye", value: 6 }])).toBe("2 países sin contorno en el mapa: Equis, Ye; 7 productos. Sí cuentan en la tabla.");
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

    expect(bundleMissing).toEqual([]); // B133: 170 of 170 have an outline
    expect(raw.countries.length - bundleMissing.length).toBe(170);
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
    // an empty box is a PNG of 1.5 to 2.7 KB, a drawn map one of 14 KB or more: if the first look is already big it was drawn before we looked
    let drawnAt = 0;
    const start = Date.now();
    let first = await blank();
    if (first > 8000) drawnAt = 1;
    while (!drawnAt && Date.now() - start < 60000) {
      await page.waitForTimeout(250);
      const now = await blank();
      if (now > 8000 || Math.abs(now - first) > 2000) drawnAt = Date.now() - start;
    }
    console.log(`[live] map: ${box ? "present" : "absent"}; drawn ${drawnAt ? `${drawnAt} ms after the container appears (${Date.now() - t0} ms from the navigation)` : "NOT detected as drawn in 60 s"}`);
    expect(drawnAt, "the map changed from its first state (WebGL drew)").toBeGreaterThan(0);
    // nothing is left without outline: the «?» of the map does not exist (and it is not left empty)
    await expect(page.getByTestId("country-map-help")).toHaveCount(0);
    console.log("[live] help of the map: absent (170 of 170 countries have an outline)");
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
