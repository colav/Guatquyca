/*
 * F80 (D-186): choropleth maps of departments (Board 2) and subregions of Antioquia (Boards 1 and 2). The first block needs no
 * server (joins, zeros, «Sin asignar», attribution); the second reads the real quyca and measures (E2E_LIVE=1). No screenshots are
 * saved: the pixels of the maps are compared in memory.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { DANE_ATTRIBUTION, POLYGON_KEYS, departmentRows, departmentsWithoutOutlineText, geoMapData, subregionRowsFromCatalogue, subregionRowsFromObject } from "../../lib/observatories/geoMap";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const read = (name) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "lib/observatories/data/geo", name), "utf8"));
const colombia = read("colombia.json");
const subregions = read("antioquia_subregiones.json");

const SUBREGIONS = ["Valle de Aburrá", "Oriente", "Urabá", "Bajo Cauca", "Suroeste", "Occidente", "Nordeste", "Magdalena Medio", "Norte"];
const NO_DATA = ["Arauca", "Putumayo", "Guainía", "Guaviare", "Vaupés", "Vichada"];

test.describe("departments (no server)", () => {
  test("colombia.json: 33 polygons, 27 with nombre_t2; the six without data are the ones of the order", () => {
    expect(colombia.features).toHaveLength(33);
    const named = colombia.features.filter((f) => f.properties.nombre_t2);
    expect(named).toHaveLength(27);
    expect(new Set(named.map((f) => f.properties.nombre_t2)).size).toBe(27);
    const unnamed = colombia.features.filter((f) => !f.properties.nombre_t2).map((f) => f.properties.NOMBRE_DPT.toLowerCase());
    expect(unnamed.sort()).toEqual(["arauca", "guainia", "guaviare", "putumayo", "vaupes", "vichada"]);
  });

  test("the 27 names join; the six without data are 0; «Sin asignar» has no polygon and goes in the help with its figure", () => {
    const names = colombia.features.map((f) => f.properties.nombre_t2).filter(Boolean);
    const departments = Object.fromEntries(names.map((n, i) => [n, i + 1]));
    departments["Sin asignar"] = 11;
    const { data, withoutOutline, drawn } = geoMapData(colombia, departmentRows(departments), POLYGON_KEYS.departments);
    expect(drawn).toBe(27);
    expect(withoutOutline).toEqual([{ key: "Sin asignar", name: "Sin asignar", value: 11 }]);
    expect(data.features).toHaveLength(33);
    const count = (name) => data.features.find((f) => f.properties.nombre_t2 === name).properties;
    expect(count("Antioquia").count).toBe(departments.Antioquia);
    expect(count("Antioquia").log_count).toBe(Math.log(departments.Antioquia));
    expect(count("Antioquia").name).toBe("Antioquia");
    const zeros = data.features.filter((f) => !f.properties.nombre_t2);
    expect(zeros).toHaveLength(6);
    expect(zeros.every((f) => f.properties.count === 0 && f.properties.log_count === 0)).toBe(true);
    expect(departmentsWithoutOutlineText(withoutOutline)).toBe("«Sin asignar»: 11 productos con instituciones colombianas, sin contorno en el mapa.");
    expect(departmentsWithoutOutlineText([])).toBe("");
    // the six departments of the order are not in the bundle: they are the polygons that stay in 0
    expect(NO_DATA).toHaveLength(6);
  });
});

test.describe("subregions of Antioquia (no server)", () => {
  test("the file has the nine subregions with the names of the bundles", () => {
    expect(subregions.features).toHaveLength(9);
    expect(subregions.features.map((f) => f.properties.subregion).sort()).toEqual([...SUBREGIONS].sort());
    expect(Object.keys(subregions.features[0].properties)).toEqual(["subregion"]);
  });

  test("Board 2: name -> value; Board 1: catalogue and counts of the filters (or the fixed n_title)", () => {
    const counts = Object.fromEntries(SUBREGIONS.map((s, i) => [s, i]));
    const a = geoMapData(subregions, subregionRowsFromObject(counts), POLYGON_KEYS.subregions);
    expect(a.drawn).toBe(8); // one subregion is 0
    expect(a.withoutOutline).toEqual([]);
    expect(a.data.features.find((f) => f.properties.subregion === "Urabá").properties.count).toBe(2);

    const catalogue = SUBREGIONS.map((sub, i) => ({ sub, n_title: 100 + i, n_regprog: i % 2 ? 7 : 0, topics: [["Tópico A", 3], ["Tópico B", 2], ["Tópico C", 1]] }));
    const withFilters = subregionRowsFromCatalogue(catalogue, SUBREGIONS.map((_, i) => 10 * i));
    expect(withFilters[2]).toEqual({ key: "Urabá", name: "Urabá", value: 20, regprog: "—", topics: "Tópico A · Tópico B" });
    expect(withFilters[1].regprog).toBe("7");
    expect(subregionRowsFromCatalogue(catalogue)[2].value).toBe(102);
    const b = geoMapData(subregions, withFilters, POLYGON_KEYS.subregions);
    const props = b.data.features.find((f) => f.properties.subregion === "Oriente").properties;
    expect(props).toMatchObject({ count: 10, regprog: "7", topics: "Tópico A · Tópico B", name: "Oriente" });
  });

  test("the attribution of the DANE is the sentence of the order", () => {
    expect(DANE_ATTRIBUTION).toBe("Límites municipales: Departamento Administrativo Nacional de Estadística - DANE (www.dane.gov.co), Marco Geoestadístico Nacional 2024; simplificados.");
  });
});

/* Helpers of the live block. */
async function drawn(page, box, label) {
  // WebGL: the map is drawn when the pixels stop being the empty state. The size of the PNG tells: an empty box is small
  // (a few KB), a drawn map is much bigger; if the first look is already big the map was drawn before we looked.
  const size = async () => (await box.screenshot({ type: "png" })).length;
  const start = Date.now();
  const first = await size();
  if (first > 8000) {
    console.log(`[live] ${label}: already drawn at the first look (${first} bytes)`);
    return 1;
  }
  while (Date.now() - start < 60000) {
    await page.waitForTimeout(250);
    const now = await size();
    if (now > 8000 || Math.abs(now - first) > 1500) {
      const ms = Date.now() - start;
      console.log(`[live] ${label}: drawn ${ms} ms after the container appears (${first} -> ${now} bytes)`);
      return ms;
    }
  }
  console.log(`[live] ${label}: not drawn in 60 s (${first} bytes at the start)`);
  return 0;
}
const readHash = (box) => box.screenshot({ type: "png" }).then((b) => b.length + ":" + b.subarray(Math.floor(b.length / 2), Math.floor(b.length / 2) + 64).toString("base64"));

/* Box of the drawing inside the container: share of the area that is not the background, from the canvas pixels. */
async function fill(box) {
  return box.evaluate((el) => {
    const canvases = [...el.querySelectorAll("canvas")];
    const c = canvases.sort((a, b) => b.width * b.height - a.width * a.height)[0];
    return c ? { w: c.clientWidth, h: c.clientHeight } : null;
  });
}

test.describe("maps of Boards 1 and 2 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 2: map of departments and of subregions; redraw with a filter; the maps are not rebuilt; the tab changes the numbers", async ({ page, request }) => {
    test.setTimeout(300000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const raw = await (await request.get(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    expect(raw.depts).toContain("Sin asignar");
    const polygonNames = new Set(colombia.features.map((f) => f.properties.nombre_t2).filter(Boolean));
    expect(raw.depts.filter((d) => d !== "Sin asignar").every((d) => polygonNames.has(d))).toBe(true);
    expect([...raw.subregs].sort()).toEqual([...SUBREGIONS].sort());

    await page.goto("/observatories/vri-udea/board-2");
    const dep = page.getByTestId("department-map");
    await dep.waitFor({ timeout: 120000 });
    await dep.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const depMs = await drawn(page, dep, "map of departments");
    expect(depMs, "the department map is drawn").toBeGreaterThan(0);
    console.log(`[live] department map: ${JSON.stringify(await dep.boundingBox())}; canvas ${JSON.stringify(await fill(dep))}`);
    // the help carries «Sin asignar» with its figure
    const helpButton = page.getByTestId("department-map-help").locator("button");
    await helpButton.hover();
    const depHelp = await page.locator(".ant-tooltip:not(.ant-tooltip-hidden)").innerText();
    console.log(`[live] help of the departments: ${depHelp}`);
    expect(depHelp).toMatch(/^«Sin asignar»: [0-9.]+ productos con instituciones colombianas, sin contorno en el mapa\.$/);
    await page.mouse.move(0, 0);

    const sub = page.getByTestId("subregion-map");
    await sub.waitFor({ timeout: 60000 });
    await sub.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const subMs = await drawn(page, sub, "map of subregions (Board 2)");
    expect(subMs, "the subregion map is drawn").toBeGreaterThan(0);
    console.log(`[live] subregion map: ${JSON.stringify(await sub.boundingBox())}; canvas ${JSON.stringify(await fill(sub))}`);
    await expect(page.getByTestId("dane-attribution")).toBeVisible();
    await expect(page.getByTestId("dane-attribution")).toHaveText(DANE_ATTRIBUTION);

    // change of tab of the subregions: the pixels change, the map is not rebuilt
    await sub.evaluate((el) => {
      el.querySelectorAll("canvas").forEach((c) => (c.dataset.mark = "m1"));
      window.__subRoot = el.firstElementChild;
    });
    const h0 = await readHash(sub);
    const tabs = sub.locator("xpath=ancestor::div[contains(@class,'ant-card')][1]").locator(".ant-segmented-item");
    const nTabs = await tabs.count();
    console.log(`[live] tabs of the subregions: ${nTabs}`);
    const t0 = Date.now();
    await tabs.nth(2).click();
    const changes = [];
    let last = h0;
    while (Date.now() - t0 < 5000) {
      const h = await readHash(sub);
      if (h !== last) {
        changes.push(Date.now() - t0);
        last = h;
      }
    }
    const kept = await sub.evaluate((el) => ({ sameRoot: window.__subRoot === el.firstElementChild, marked: [...el.querySelectorAll("canvas")].filter((c) => c.dataset.mark === "m1").length, canvases: el.querySelectorAll("canvas").length }));
    console.log(`[live] tab of subregions: pixels change at ${changes.join(", ")} ms; same container ${kept.sameRoot}; canvases kept ${kept.marked} of ${kept.canvases}`);
    expect(changes.length, "the tab changes the colours").toBeGreaterThan(0);

    // a filter of the panel: both maps redraw without being rebuilt
    await dep.evaluate((el) => {
      el.scrollIntoView({ block: "center" });
      el.querySelectorAll("canvas").forEach((c) => (c.dataset.mark = "m1"));
      window.__depRoot = el.firstElementChild;
    });
    const d0 = await readHash(dep);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByTestId("filter-scope").locator(".ant-select-selector").click();
    const tF = Date.now();
    await page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option").nth(1).click();
    await dep.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const dchanges = [];
    let dlast = d0;
    while (Date.now() - tF < 6000) {
      const h = await readHash(dep);
      if (h !== dlast) {
        dchanges.push(Date.now() - tF);
        dlast = h;
      }
    }
    const dkept = await dep.evaluate((el) => ({ sameRoot: window.__depRoot === el.firstElementChild, marked: [...el.querySelectorAll("canvas")].filter((c) => c.dataset.mark === "m1").length, canvases: el.querySelectorAll("canvas").length }));
    console.log(`[live] department map after the filter: pixels change at ${dchanges.join(", ")} ms (include the 200 ms of the filters and the screenshots); same container ${dkept.sameRoot}; canvases kept ${dkept.marked} of ${dkept.canvases}`);
    expect(dkept.sameRoot).toBe(true);
    expect(dkept.marked).toBe(dkept.canvases);
  });

  test("Board 1: map of subregions with the attribution; redraw with a filter; not rebuilt", async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-1");
    const sub = page.getByTestId("subregion-map");
    await sub.waitFor({ timeout: 120000 });
    await sub.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const ms = await drawn(page, sub, "map of subregions (Board 1)");
    expect(ms, "the subregion map is drawn").toBeGreaterThan(0);
    console.log(`[live] board 1 subregion map: ${JSON.stringify(await sub.boundingBox())}; canvas ${JSON.stringify(await fill(sub))}`);
    await expect(page.getByTestId("dane-attribution")).toHaveText(DANE_ATTRIBUTION);
    await page.waitForTimeout(1500);
    await sub.evaluate((el) => {
      el.querySelectorAll("canvas").forEach((c) => (c.dataset.mark = "m1"));
      window.__subRoot = el.firstElementChild;
    });
    const h0 = await readHash(sub);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByTestId("filter-scope").locator(".ant-select-selector").click();
    const tF = Date.now();
    await page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option").nth(1).click();
    await sub.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const changes = [];
    let last = h0;
    while (Date.now() - tF < 6000) {
      const h = await readHash(sub);
      if (h !== last) {
        changes.push(Date.now() - tF);
        last = h;
      }
    }
    const kept = await sub.evaluate((el) => ({ sameRoot: window.__subRoot === el.firstElementChild, marked: [...el.querySelectorAll("canvas")].filter((c) => c.dataset.mark === "m1").length, canvases: el.querySelectorAll("canvas").length }));
    console.log(`[live] board 1 subregion map after the filter: pixels change at ${changes.join(", ")} ms; same container ${kept.sameRoot}; canvases kept ${kept.marked} of ${kept.canvases}`);
    expect(kept.sameRoot).toBe(true);
  });
});
