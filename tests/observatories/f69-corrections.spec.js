/*
 * F69 (D-171): corrections of the defects of F68 that do not depend on X-05 (centre, unit and subunit are not touched):
 * tooltips with the name of the series, the unit and the total (Boards 1, 2 and 3), descriptive labels of «Ámbito», the order
 * of «Documento de política», the panel 10 next to 11·12, tabs of the indicator 14 from the agendas of the bundle, no fixed
 * figure in the texts, and the checks of B125 (year 0, labels of the types, goals of the Misión de sabios, the 8 agendas).
 * The first block needs no server; the second reads the real quyca and the dev server of Luis and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

import { axisTabsFor, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { POLICY_DOCUMENTS, policyRank } from "../../lib/observatories/policyDocuments";
import { SCOPE_OPTIONS, appropriationYearNote, missionFociNote } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { SCOPE_LABELS as T1_SCOPES, byPolicyOrder } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { SCOPE_LABELS as T3_SCOPES } from "../../app/observatories/vri-udea/board-3/components/boardTexts";
import { TYPE_LABELS } from "../../lib/observatories/foundations";
import { computeCapacity, createDataset, rankGoals, topicPredicate } from "../../lib/observatories/capacity";
import { parseFilters, serializeFilters } from "../../lib/observatories/filters";
import { goalRows } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const ROOT = path.resolve(__dirname, "../../app/observatories/vri-udea");

test.describe("corrections of F68 (no server)", () => {
  test("the order of the documents is the one of Gabriel in the three boards", () => {
    expect(POLICY_DOCUMENTS).toHaveLength(12);
    const shuffled = ["OECD STI Outlook 2025", "CONPES 4144", "PDD mpal Medellín", "Misión de sabios 2019", "Plan Decenal CTI Medellín 2024-2033", "Otro"];
    expect([...shuffled].sort(byPolicyOrder)).toEqual(["PDD mpal Medellín", "Misión de sabios 2019", "CONPES 4144", "Plan Decenal CTI Medellín 2024-2033", "OECD STI Outlook 2025", "Otro"]);
    expect(policyRank("Desconocido")).toBe(12);
  });

  test("the tabs of the indicator 14 come from the agendas of the bundle", () => {
    const eight = ["CONPES 4069", "CONPES 4144", "Marco UNESCO de Educación Cultural y Artística 2025", "Misión de sabios 2019", "OECD STI Outlook 2025", "PDD dptal Antioquia", "PDD mpal Medellín", "Plan Decenal CTI Medellín 2024-2033"];
    const tabs = axisTabsFor(eight);
    expect(tabs.map((t) => t.label)).toEqual(["PDD Medellín", "PDD Antioquia", "CONPES 4069", "CONPES 4144", "Plan Decenal CTI Medellín", "OECD STI Outlook 2025", "Marco UNESCO de Educación Cultural y Artística 2025", "Misión de sabios (focos)", "Todas las agendas sin Misión"]);
    expect(tabs[tabs.length - 1].agenda).toBeNull();
    const without = axisTabsFor(["CONPES 4069", "PDD mpal Medellín"]);
    expect(without.map((t) => t.label)).toEqual(["PDD Medellín", "CONPES 4069", "Todas las agendas sin Misión"]); // no Misión: no focos tab
  });

  test("the axes of the filter are grouped in the order of Gabriel", () => {
    const base = {
      sectors: ["academic", "company", "government", "nonprofit", "healthcare"], sectorsEs: ["A", "E", "G", "S", "H"], tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
      regions: [], countries: [], insts: [], depts: ["Antioquia"], groups: [], centros: [], deps: [], facs: [], subfields: [], sfField: [], subregs: [], doms: [], works: [], projects: [],
      thesaurus: {
        agendas: [{ name: "CONPES 4069", topics: [] }, { name: "PDD mpal Medellín", topics: [] }],
        ejes: [
          { id: 1, agenda: "CONPES 4069", clave: "a", eje: "A", nivel: "N", topics: [], direct: [], direct_conf: [] },
          { id: 2, agenda: "PDD mpal Medellín", clave: "b", eje: "B", nivel: "N", topics: [], direct: [], direct_conf: [] },
        ],
      },
    };
    expect(createCollaborationDataset(base).axisGroups.map((g) => g.agenda)).toEqual(["PDD mpal Medellín", "CONPES 4069"]);
  });

  test("the labels of «Ámbito» say what each option means in each board", () => {
    expect(SCOPE_OPTIONS.map((o) => o.label)).toEqual(["Local (coautor en Antioquia)", "Departamental (subregión de Antioquia en el título, sin el Valle de Aburrá)", "Nacional (coautor de otros departamentos)", "Internacional (coautor extranjero)"]);
    expect(T1_SCOPES.Local).toContain("documentos de política de Medellín");
    expect(Object.values(T1_SCOPES)).toHaveLength(4);
    expect(T3_SCOPES).toHaveLength(4);
  });

  test("the notes calculate their figures (no fixed numbers in the texts)", () => {
    expect(appropriationYearNote(735, 752)).toBe("Apropiación social: 735 de 752 registros no tienen año.");
    expect(missionFociNote(8)).toContain("Los 8 focos de la Misión de sabios");
    const forbidden = /95\.471|33\.589|\b2\.248\b|4\.058|\b472 empresas|8\.168|\b484 repos|\b447 DOI|735 de (los )?752|\b562 productos|\b636 registros|4\.697|3\.899|ocho focos|\b77 %|50\.341|41\.653|42 de las 57|119 de los 406|18 registros sin/;
    const files = [];
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.js$/.test(e.name) && files.push(path.join(d, e.name))));
    walk(ROOT);
    const hits = files.filter((f) => forbidden.test(fs.readFileSync(f, "utf8"))).map((f) => path.relative(ROOT, f));
    expect(hits).toEqual([]);
  });

  test("T1: the goals without parent (Misión de sabios) get their label and not an empty one", () => {
    const raw = {
      meta: {}, topics: [], facts: [], groups: [], cens: [], facs: [], deps: [], subregiones: [], actores: [], ref_2125: [], inst_lider: [], ref_nacional: [],
      ejes: [
        { id: 1, clave: "k", eje: "Foco", agenda: "Misión de sabios 2019", nivel: "Nacional", meta: "" },
        { id: 2, clave: "k2", eje: "Eje", agenda: "CONPES 4069", nivel: "Nacional", meta: "Línea › Programa" },
      ],
    };
    const ds = createDataset(raw);
    const rows = goalRows(rankGoals(ds, { axisFilter: null, axisSelection: null }));
    const mission = rows.find((r) => r.detail === "Misión de sabios 2019");
    expect(mission.label).toContain("Sin meta superior definida");
    expect(rows.find((r) => r.detail === "CONPES 4069").label).toBe("Programa");
  });
});

test.describe("T1-02: filter of field, subfield or topic (no server)", () => {
  const fact = (topic, year, citations) => [topic, year, citations, 0, 0, 0, [0], [], [0], [0], [], [], [], [], 1];
  const topic = (id, f, sf) => ({ id, t: `Topic ${id}`, sf, f, d: "D", gm: 10, gw: 100, link: [] });
  const raw = {
    meta: {}, topics: [topic("T1", "Field A", "Sub 1"), topic("T2", "Field A", "Sub 2"), topic("T3", "Field B", "Sub 1")], ejes: [],
    facts: [fact(0, 2022, 1), fact(0, 2023, 1), fact(1, 2022, 1), fact(2, 2022, 1), fact(2, 2024, 1)],
    groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
    ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100]], inst_lider: ["Inst"], ref_nacional: [0, 1, 2],
  };
  const ds = createDataset(raw);
  test("a field, a subfield or a topic cuts the products; the key of two fields with the same subfield name does not mix them", () => {
    expect(computeCapacity(ds, {}).products).toBe(5);
    expect(computeCapacity(ds, { topicKey: "f:Field A" }).products).toBe(3);
    expect(computeCapacity(ds, { topicKey: "s:Field A|Sub 1" }).products).toBe(2); // not the Sub 1 of the Field B
    expect(computeCapacity(ds, { topicKey: "s:Field B|Sub 1" }).products).toBe(2);
    expect(computeCapacity(ds, { topicKey: "t:T2" }).products).toBe(1);
    expect(computeCapacity(ds, { topicKey: "t:T2", yearFrom: 2023, yearTo: 2026 }).products).toBe(0); // combines with «y»
    expect(computeCapacity(ds, { topicKey: "x:nothing" }).products).toBe(5); // unknown key: no filter
    expect(topicPredicate("")).toBeNull();
  });
  test("it travels in the URL and comes back", () => {
    const f = parseFilters(new URLSearchParams("topic=s:Field+A|Sub+1"));
    expect(f.topicKey).toBe("s:Field A|Sub 1");
    expect(new URLSearchParams(serializeFilters(f)).get("topic")).toBe("s:Field A|Sub 1");
    expect(serializeFilters({ ...f, topicKey: "" })).toBe("");
  });
});

const tipText = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".g2-tooltip")].filter((e) => e.offsetParent && e.innerText.trim() && e.innerText.length < 400).map((e) => e.innerText.replace(/\s+/g, " ").trim())[0] || "",
  );
const hover = async (page, title, points) => {
  const card = page.getByTestId("chart-card").filter({ hasText: title }).first();
  const canvas = card.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  const b = await canvas.boundingBox();
  /* The points given first, then a sweep of the canvas: the bars sit at different heights in each card. */
  const sweep = [];
  for (const fx of [0.3, 0.4, 0.55, 0.7]) for (let fy = 0.04; fy < 0.97; fy += 0.06) sweep.push([fx, fy]);
  for (const [fx, fy] of [...points, ...sweep]) {
    await page.mouse.move(b.x + b.width * fx, b.y + b.height * fy);
    await page.waitForTimeout(300);
    const t = await tipText(page);
    if (t) return t;
  }
  return "";
};
const options = async (page, label) => {
  const sel = page.getByTestId("filters").locator("label", { hasText: label }).first().locator("xpath=../..").locator(".ant-select-selector").first();
  await sel.click();
  await page.waitForTimeout(400);
  const items = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  return items;
};

test.describe("corrections of F68 against the real quyca (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let b2;
  let b3;

  test.beforeAll(async () => {
    b2 = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
  });

  test("B125 checks on the data: year 0, labels of all the types, the 8 agendas with products", () => {
    const withoutYear = b3.P.filter((p) => p[0] === 0).length;
    expect(withoutYear).toBeGreaterThan(0);
    for (const t of b3.tipos) expect(TYPE_LABELS[t], `label of ${t}`).toBeTruthy();
    expect(b3.agendas).toHaveLength(8);
    for (let i = 0; i < b3.agendas.length; i++) {
      const bit = b3.agendas_all.indexOf(b3.agendas[i]);
      expect(b3.P.filter((p) => p[3] & (1 << bit)).length, b3.agendas[i]).toBeGreaterThan(0);
    }
    console.log(`[live] T3: ${b3.P.length} products, ${withoutYear} with year 0; ${b3.tipos.length} types, all with label; 8 agendas with products`);
  });

  test("T2 page: tooltips with the name of the series, unit and total; Ámbito; documents in order; tabs; panel 10 next to 11·12", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-2");
    await page.getByTestId("axis-filter").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3500);
    // tooltips
    const t03 = await hover(page, "3 ·", [[0.25, 0.1], [0.25, 0.14], [0.3, 0.2]]);
    const funders = await hover(page, "15 · Entidades", [[0.15, 0.1], [0.2, 0.12], [0.3, 0.1]]);
    const t14 = await hover(page, "14 ·", [[0.2, 0.1], [0.3, 0.1], [0.3, 0.15]]);
    console.log(`[live] T2 03: ${t03} | funders: ${funders} | 14: ${t14}`);
    expect(t03).toMatch(/total/);
    expect(t03).toMatch(/Artículo|Capítulo|Libro|Apropiación/);
    expect(t03).toContain("productos");
    expect(t03).not.toContain("Detalle");
    expect(funders).toContain("proyectos");
    expect(funders).not.toMatch(/Productos|Detalle/);
    expect(t14).toMatch(/Empresa|Gobierno|Sin ánimo|Salud/);
    // Ámbito and documents
    expect(await options(page, "Ámbito")).toEqual(SCOPE_OPTIONS.map((o) => o.label));
    const docs = await options(page, "Documento de política");
    expect(docs).toEqual([...docs].sort(byPolicyOrder));
    expect(docs).toHaveLength(8);
    // tabs of the indicator 14
    const tabs = await page.getByTestId("chart-card").filter({ hasText: "14 ·" }).first().locator(".ant-segmented-item-label").allInnerTexts();
    expect(tabs).toEqual(axisTabsFor(b2.thesaurus.agendas.map((a) => a.name)).map((t) => t.label));
    // notes with figures from the bundle
    const works = b2.works.filter((w) => w[1] === 3);
    await expect(page.getByText(appropriationYearNote(works.filter((w) => !w[0]).length, works.length))).toBeVisible();
    await expect(page.getByText(missionFociNote(b2.thesaurus.ejes.filter((e) => e.agenda === "Misión de sabios 2019").length))).toBeVisible();
    // order: 10 and 11·12 in the same row
    const pos = await page.getByTestId("chart-card").evaluateAll((els) => els.map((e) => [e.querySelector(".ant-card-head-title")?.textContent || "", Math.round(e.getBoundingClientRect().y), Math.round(e.getBoundingClientRect().x)]));
    const p10 = pos.find((p) => p[0].startsWith("10 ·"));
    const p1112 = pos.find((p) => p[0].startsWith("11 · 12"));
    expect(Math.abs(p10[1] - p1112[1])).toBeLessThan(5);
    expect(p10[2]).toBeLessThan(p1112[2]);
    // the flagged institution is not in the bundle with that name: nothing says «Alcaldía … (verificar)»
    expect(await page.locator("main").innerText()).not.toContain("(verificar)");
  });

  test("T3 page: tooltip of the panel 02, notes without fixed figures, Ámbito and documents, tile with year 0", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-3");
    await page.getByTestId("filters").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3500);
    const t02 = await hover(page, "2 ·", [[0.3, 0.3], [0.5, 0.5], [0.25, 0.7], [0.7, 0.4]]);
    console.log(`[live] T3 02: ${t02}`);
    expect(t02).toMatch(/Porcentaje \d/);
    expect(t02).not.toContain("undefined");
    const text = await page.locator("main").innerText();
    expect(text).not.toContain("0 patentes en la base");
    expect(text).not.toMatch(/484 repositorios/);
    // the note of the panel 12 does not talk about the column of projects (it is of the panel 14)
    const card12 = (await page.getByTestId("chart-card").filter({ hasText: "12 ·" }).first().innerText());
    expect(card12).not.toContain("columna de proyectos");
    expect(await options(page, "Ámbito")).toEqual(T3_SCOPES);
    const docs = await options(page, "Documento de política");
    expect(docs).toHaveLength(8);
    expect(docs).toEqual([...docs].sort(byPolicyOrder));
    // tile of products: the ones without year count with the default range
    await expect(page.locator(".obs-kpi").first()).toContainText(b3.P.length.toLocaleString("es-CO"));
    const noYear = b3.P.filter((p) => p[0] === 0).length;
    console.log(`[live] T3 tile: ${b3.P.length.toLocaleString("es-CO")} with the default range (${noYear} without year count; a narrowed range leaves them out)`);
  });

  test("T1 page: the filter of field, subfield or topic cuts the board and comes from the URL", async ({ page }) => {
    test.setTimeout(250000);
    const b1 = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const dataset = createDataset(b1);
    const field = b1.topics[0].f;
    const expected = computeCapacity(dataset, { topicKey: `f:${field}` }).products;
    const all = computeCapacity(dataset, {}).products;
    console.log(`[live] T1 field «${field}»: ${expected} of ${all} products`);
    expect(expected).toBeGreaterThan(0);
    expect(expected).toBeLessThan(all);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/observatories/vri-udea/board-1?topic=${encodeURIComponent(`f:${field}`)}`);
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1500);
    await expect(page.locator(".obs-kpi").filter({ hasText: "productos (artículos" }).first()).toContainText(expected.toLocaleString("es-CO"));
    await expect(page.getByTestId("topic-filter")).toContainText(field);
  });

  test("T1 page: unit in the tooltips, Ámbito descriptive and documents in order", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(3000);
    const t3 = await hover(page, "3 · Grupos", [[0.4, 0.08], [0.4, 0.12], [0.5, 0.2]]);
    const t6 = await hover(page, "6 · Meta", [[0.4, 0.08], [0.4, 0.14], [0.5, 0.2]]);
    console.log(`[live] T1 3: ${t3} | 6: ${t6}`);
    expect(t3).toContain("Productos");
    expect(t3).not.toContain("Valor");
    expect(t6).toContain("Ejes Temáticos");
    expect(t6).not.toContain("Valor");
    const scope = await options(page, "Ámbito");
    expect(scope[0]).toBe("Local (documentos de política de Medellín)");
    const docs = await options(page, "Documento de política");
    expect(docs).toEqual([...docs].sort(byPolicyOrder));
  });
});
