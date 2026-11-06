/*
 * F58 (D-153, D-156): card «11b · Propiedad intelectual y patentes» of Board 3 with the key `pi` of the bundle. Answers
 * years (complete range 2010–2026 counts everything, a narrowed range only the assets with year inside it), unit and
 * centre (through the groups); does not answer scope, document, subunit or subfield. The first block needs no server; the
 * second reads the real quyca and the dev server of Luis (one run) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { computePropertyAssets, createFoundationsDataset, DEFAULT_FOUNDATIONS_FILTERS } from "../../lib/observatories/foundations";
import { PI_FILTER_NOTE, PI_TITLE } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* rows: [type, state, year (0 = none), country, subtype, [groups], [units]] */
const pi = {
  tipos: ["Marcas", "Secreto"],
  estados: ["Concedido", "Registrado"],
  paises: ["Colombia", "Chile"],
  subtipos: ["x"],
  rows: [
    [0, 0, 2015, 0, 0, [0], [0]],
    [0, 1, 2019, 0, 0, [1], [1]],
    [1, 0, 2005, 1, 0, [], [0]],
    [1, 0, 0, 0, 0, [0], []],
    [0, 0, 2024, 0, 0, [], [1]],
  ],
  patentes: { n: 71, tipos: {} },
};
const raw = {
  tops: [], top_meta: {}, P: [], A: [], facs: ["U0", "U1"], centros: ["C0", "C1"],
  groups: [["G0", "Grupo 0", "d", "A1", "C0", "U", "Activo"], ["G1", "Grupo 1", "d", "A1", "C1", "U", "Activo"]],
  pi,
};
const ds = createFoundationsDataset(raw);
const run = (filters = {}, dataset = ds) => computePropertyAssets(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, ...filters });

test.describe("card 11b, model (no server)", () => {
  test("without filters everything counts: the old, the ones without year, and the series", () => {
    const r = run();
    expect(r.fullRange).toBe(true);
    expect(r.total).toBe(5);
    expect(r.withGroup).toBe(3);
    expect(r.withoutYear).toBe(1);
    expect(r.years[0]).toBe(2005);
    expect(r.years[r.years.length - 1]).toBe(2024);
    expect(r.values.reduce((a, b) => a + b, 0)).toBe(4); // the one without year is not in the series
    expect(r.byType).toEqual([{ label: "Marcas", value: 3 }, { label: "Secreto", value: 2 }]);
    expect(r.byState.map((x) => x.value)).toEqual([4, 1]);
    expect(r.countries).toMatchObject({ colombia: 4, others: 1, otherCountries: 1 });
    expect(r.patents.n).toBe(71);
  });

  test("a narrowed range counts only the assets with year inside it; the ones without year need the complete range", () => {
    const r = run({ yearFrom: 2010, yearTo: 2020 });
    expect(r.fullRange).toBe(false);
    expect(r.total).toBe(2);
    expect(r.withoutYear).toBe(1); // the note still tells how many have no year
    expect(r.values.reduce((a, b) => a + b, 0)).toBe(2);
    expect(run({ yearFrom: 2024, yearTo: 2026 }).total).toBe(1);
    expect(run({ yearFrom: 2011, yearTo: 2026 }).total).toBe(3); // 2015, 2019 and 2024
  });

  test("unit and centre (through the groups) answer and combine with «y»", () => {
    expect(run({ facultyIndex: 0 }).total).toBe(2);
    expect(run({ facultyIndex: 1 }).total).toBe(2);
    expect(run({ facultyIndex: 0, yearFrom: 2010, yearTo: 2020 }).total).toBe(1);
    expect(run({ centerIndex: 0 }).total).toBe(2); // rows 0 and 3 have the group of C0
    expect(run({ centerIndex: 1 }).total).toBe(1);
    expect(run({ centerIndex: 1, facultyIndex: 1 }).total).toBe(1);
    expect(run({ centerIndex: 0, facultyIndex: 1 }).total).toBe(0);
  });

  test("scope, document, subunit and subfield do not answer and are named", () => {
    expect(run({ scopeIndex: 1, policyIndex: 2, departmentIndex: 3, subfieldIndex: 4 }).total).toBe(5);
    expect(run({ scopeIndex: 1, policyIndex: 2, departmentIndex: 3, subfieldIndex: 4 }).notResponding).toEqual(["ámbito", "documento de política", "subunidad", "subcampo"]);
    expect(run().notResponding).toEqual([]);
    expect(PI_FILTER_NOTE).toBe("La propiedad intelectual solo se puede filtrar por años, centro o unidad; no tiene subcampo ni documento de política.");
    expect(PI_TITLE).toBe("11b · Propiedad intelectual y patentes");
  });

  test("rankings: units, and groups (only the ones of the centre when it is chosen)", () => {
    expect(run().byUnit).toEqual([{ label: "U0", value: 2 }, { label: "U1", value: 2 }]);
    expect(run().byGroup).toEqual([{ label: "Grupo 0", value: 2 }, { label: "Grupo 1", value: 1 }]);
    expect(run({ centerIndex: 0 }).byGroup).toEqual([{ label: "Grupo 0", value: 2 }]);
  });

  test("the catalogues are read from the bundle: renaming a state changes nothing", () => {
    const renamed = createFoundationsDataset({ ...raw, pi: { ...pi, estados: ["Otro nombre", "Y otro"] } });
    expect(run({}, renamed).byState.map((x) => x.value)).toEqual([4, 1]);
    expect(run({}, renamed).byState[0].label).toBe("Otro nombre");
  });

  test("without the key `pi` (test data) there is no card", () => {
    const { pi: _omit, ...without } = raw;
    expect(run({}, createFoundationsDataset(without))).toBeNull();
  });
});

test.describe("card 11b against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let bundle;
  let dataset;
  test.beforeAll(async () => {
    bundle = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    dataset = createFoundationsDataset(bundle);
  });

  test("figures of the bundle: 431 assets, 363 with group, 16 without year, 71 patents, 385 with unit", () => {
    const r = computePropertyAssets(dataset, DEFAULT_FOUNDATIONS_FILTERS);
    console.log(`[live] total ${r.total}, with group ${r.withGroup}, without year ${r.withoutYear}, patents ${r.patents.n}, series ${r.values.reduce((a, b) => a + b, 0)} (${r.years[0]}–${r.years[r.years.length - 1]}), types ${JSON.stringify(r.byType)}, states ${r.byState.map((x) => `${x.label} ${x.value}`).join("; ")}`);
    expect(r.total).toBe(431);
    expect(r.withGroup).toBe(363);
    expect(r.withoutYear).toBe(16);
    expect(r.patents.n).toBe(71);
    expect(r.values.reduce((a, b) => a + b, 0)).toBe(431 - 16);
    expect(r.years[0]).toBe(1994);
    expect(r.years[r.years.length - 1]).toBe(2025);
    expect(bundle.pi.rows.filter((x) => x[6].length).length).toBe(385);
    expect(r.byType.reduce((s, x) => s + x.value, 0)).toBe(431);
    expect(r.byState.reduce((s, x) => s + x.value, 0)).toBe(431);
    expect(r.countries.colombia).toBe(368);
  });

  test("filters against the direct count of the rows", () => {
    const unit = bundle.facs.indexOf("Facultad de Ingeniería") >= 0 ? bundle.facs.indexOf("Facultad de Ingeniería") : 0;
    const byUnit = bundle.pi.rows.filter((x) => x[6].includes(unit)).length;
    expect(computePropertyAssets(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, facultyIndex: unit }).total).toBe(byUnit);
    const c = bundle.centros.indexOf("Exactas");
    const groups = new Set(bundle.groups.map((g, i) => (g[4] === "Exactas" ? i : -1)).filter((i) => i >= 0));
    const byCenter = bundle.pi.rows.filter((x) => x[5].some((g) => groups.has(g))).length;
    expect(computePropertyAssets(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: c }).total).toBe(byCenter);
    const inRange = bundle.pi.rows.filter((x) => x[2] >= 2015 && x[2] <= 2020).length;
    expect(computePropertyAssets(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, yearFrom: 2015, yearTo: 2020 }).total).toBe(inRange);
    console.log(`[live] unit ${bundle.facs[unit]}: ${byUnit}; centre Exactas: ${byCenter}; 2015–2020: ${inRange}`);
  });

  test("the page: the card sits after panel 11, with the figures, the notes and the switch of ranking", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-3");
    const card = page.getByTestId("pi-card");
    await expect(card).toBeVisible({ timeout: 120000 });
    await expect(card).toContainText("11b · Propiedad intelectual y patentes");
    await expect(card.locator(".obs-kpi").nth(0)).toContainText("431");
    await expect(card.locator(".obs-kpi").nth(1)).toContainText("363");
    await expect(card.locator(".obs-kpi").nth(2)).toContainText("71");
    await expect(page.getByTestId("pi-year-note")).toContainText("16 activos no tienen año de concesión");
    await expect(page.getByTestId("pi-filter-note")).toHaveText(PI_FILTER_NOTE);
    await expect(page.getByTestId("pi-not-responding")).toHaveCount(0);
    // order: panels 10 and 11, then 11b, then the section of Artes
    const titles = await page.getByTestId("chart-card").evaluateAll((els) => els.map((e) => e.querySelector(".ant-card-head-title")?.textContent || ""));
    const i11 = titles.findIndex((t) => t.startsWith("11 ·"));
    const i11b = titles.findIndex((t) => t.startsWith("11b ·"));
    expect(i11b).toBe(i11 + 1);
    expect(titles.findIndex((t) => t.startsWith("12 ·"))).toBe(i11b + 1);
    // same card style as its neighbours
    const style = await page.getByTestId("chart-card").evaluateAll((els) => els.filter((e) => /^(11|11b) ·/.test(e.querySelector(".ant-card-head-title")?.textContent || "")).map((e) => [e.className.includes("ant-card-small"), getComputedStyle(e).boxShadow]));
    expect(style[0]).toEqual(style[1]);
    // ranking: units by default, groups on request
    await expect(card).toContainText("unidades con más activos");
    await card.getByText("Por grupo").click();
    await expect(card).toContainText("grupos con más activos");
  });

  test("the page: a filter that does not answer is named; a unit narrows the figures", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-3?department=2&subfield=1&from=2015&to=2020");
    const note = page.getByTestId("pi-not-responding");
    await expect(note).toBeVisible({ timeout: 120000 });
    await expect(note).toContainText("subunidad, subcampo");
    const inRange = bundle.pi.rows.filter((x) => x[2] >= 2015 && x[2] <= 2020).length;
    await expect(page.getByTestId("pi-card").locator(".obs-kpi").nth(0)).toContainText(String(inRange));
    await expect(page.getByTestId("pi-year-note")).toContainText("con un rango de años elegido no se cuentan");
  });
});
