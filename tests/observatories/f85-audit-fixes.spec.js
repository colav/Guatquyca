/*
 * F85 (D-196): fixes of the audit of Fable. The first block needs no server (the field filter of the panel 03 of Board 3, the
 * note of the panel 07, the tooltip of the trend lines, the texts); the second (E2E_LIVE=1) measures on the real bundles what
 * the order asks to measure and checks the three boards in the page. One live run (D-146). No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FOUNDATIONS_FILTERS, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";
import { OECD_AREAS } from "../../lib/observatories/foundations/constants";
import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { trendTooltipItem } from "../../lib/observatories/trendTooltip";
import { BOARD_LEAD } from "../../app/observatories/vri-udea/board-3/components/boardTexts";
import { NOTES, realNotice } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { ratioSentence, realDataWarnings } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* Small bundle of Board 3: two topics in two fields and two active groups, one product each. P: [year, type, topic, mask, scope, oa, repo, doi, sector, ext, facs, deps, groups, authors, insts, thesis, handle, preprint]. */
const product = (topic, group) => [2022, 0, topic, 0, 0, null, null, 0, 0, [], [], [], [group], [0], [], 0, 0, 0];
const raw = {
  doms: [], fields: [], subs: [], sub_meta: [], tops: ["T1", "T2"], top_meta: { T1: [0, 0], T2: [1, 1] }, facs: [], deps: [],
  groups: [
    ["G1", "g1", OECD_AREAS[0], "A", "Centro", 0, "Activo"],
    ["G2", "g2", OECD_AREAS[1], "A", "Centro", 0, "Activo"],
  ],
  centros: ["Zeta"], agendas: [], agendas_all: [],
  tipos: ["articulo", "libro", "capitulo", "apropiacion", "inv_creacion", "audiovisual", "prod_artistica", "dataset", "software", "preprint", "tesis_posgrado", "tesis_pregrado", "ondas"],
  tesis_sub: ["otra"], ambitos: ["Local", "Departamental", "Nacional", "Internacional"],
  P: [product(0, 0), product(1, 1)],
  A: [[1, 1, 1980, 1, 0, 0, -1, -1, -1, "vinculado", "", "", "doctorado"]],
  inst: [], age_bins: [],
  proj: { years: [2020], levels: ["Pregrado"], all: [[5]], by_centro: { Otro: [[1]] }, estudiantes_unicos: 5, proyectos_total: 1 },
  metas: [],
  talent: { staff_total: 1, por_minciencias: {}, poblacion_ajustada: 1, poblacion_censada: 1, inv_sheet: { personas: 0, por_vinculacion: {} }, planta_2021: { total: 1, edad_media: 40, por_edad: {} } },
  artes: { prof: [], proy_grupos: {}, fac_creacion: {}, creacion_proyectos_unicos: 2 },
  creacion: { obras: 0, personas: 0, grupos: 0 },
  pi: null,
};

test.describe("fixes of the audit (no server)", () => {
  test("Board 3, panel 03 (G-2): choosing a whole field narrows the groups, with no other filter", () => {
    const ds = createFoundationsDataset(raw);
    const all = computeFoundations(ds, DEFAULT_FOUNDATIONS_FILTERS);
    expect(all.groupGrid.total).toBe(2);
    const one = computeFoundations(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, fieldIndex: 0 });
    expect(one.groupGrid.total).toBe(1);
    expect(one.groupGrid.cells.map((c) => c.area)).toEqual([OECD_AREAS[0]]);
  });

  test("Board 3, panel 07 (G-4): a centre that the table of projects does not name is said, not shown as filtered", () => {
    const ds = createFoundationsDataset(raw);
    const none = computeFoundations(ds, DEFAULT_FOUNDATIONS_FILTERS);
    expect(none.students.byCenter).toBe(false);
    expect(none.students.centerMissing).toBe(false);
    const missing = computeFoundations(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: 0 });
    expect(missing.students.byCenter).toBe(false);
    expect(missing.students.centerMissing).toBe(true);
    expect(missing.students.series[0].values).toEqual([0]); // no projects (F87), never all of them
    const known = computeFoundations(createFoundationsDataset({ ...raw, centros: ["Otro"] }), { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: 0 });
    expect(known.students.byCenter).toBe(true);
    expect(known.students.centerMissing).toBe(false);
    expect(known.students.series[0].values).toEqual([1]);
  });

  test("Board 3 (G-1, G-3): the lead says what the document delimits; panel 13 no longer carries the unique projects of the creation base", () => {
    expect(BOARD_LEAD).toContain("El filtro de documento delimita los productos que el panel de jueces asignó a alguno de sus ejes; los filtros de centro, unidad, subunidad y subcampo delimitan la producción asociada a los tópicos en los que participa cada entidad.");
    expect(BOARD_LEAD).not.toContain("Los filtros de documento, centro");
  });

  test("Board 2 (N-01): each trend series says its own name and unit in the tooltip", () => {
    expect(trendTooltipItem({ series: "Proyectos (inicio)", unit: "proyectos", value: 1234 })).toEqual({ name: "Proyectos (inicio)", value: "1.234 proyectos" });
    expect(trendTooltipItem({ series: "Patentes", unit: "patentes", value: 7 })).toEqual({ name: "Patentes", value: "7 patentes" });
    expect(trendTooltipItem({ series: "Libro", unit: "productos", value: 1 })).toEqual({ name: "Libro", value: "1 productos" });
    expect(trendTooltipItem({ series: "x", value: 3 })).toEqual({ name: "x", value: "3" });
  });

  test("Board 2 (M-01, M-06): the sentence about patents starts with a capital and the last concession is not fixed in the text", () => {
    const text = realNotice({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 1, appropriation: 2 });
    expect(text).toContain("). Las patentes salen del portafolio");
    expect(text).not.toMatch(/[.;)] las patentes/);
    expect(NOTES.v5bPatents(2031)).toContain("la última concesión es de 2031");
    expect(NOTES.v5bPatents(2031)).not.toContain("2023");
    expect(NOTES.v5bPatents(null)).not.toContain("última concesión");
  });

  test("Board 1 (A1-01): a unit with a leader of 0 citations says «sin referente»; the others keep their sentence", () => {
    const fmtRatio = (v) => v.toFixed(2).replace(".", ",");
    const opts = { ratioBasis: "national", dimension: "topic", fmtRatio, fmt: (n) => String(n) };
    expect(ratioSentence({ noReferent: true, ratio: 0, referent: "", ratioCitations: 5, leaderCitations: 0 }, opts)).toBe("0,00 · sin referente (ninguna institución con citas en este tópico)");
    expect(ratioSentence({ noReferent: false, ratio: 0.5, referent: "X", ratioCitations: 5, leaderCitations: 10, ratioTopics: null }, opts)).toContain("frente a");
  });

  test("Board 1 (A1-03, A1-04): the warning of the coverage does not claim repeated DOIs without a measurement", () => {
    const text = realDataWarnings({ n_sel: 100, n_topic: 90 }).join(" ");
    expect(text).toContain("El universo se pliega por obra (identificador de OpenAlex, DOI o identificador interno).");
    expect(text).not.toContain("Hay DOI y títulos repetidos");
  });
});

/* ---- live ---- */
const open = async (page, url) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(url);
};

test.describe("measures and pages (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("measures on the real bundles (no page): topics without referent, groups without projects, centres, external funder, last patent year", async ({ request }) => {
    test.setTimeout(250000);
    const get = async (n) => {
      const body = await (await request.get(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();
      return body.data || body;
    };
    // (13) topics whose leader has 0 citations
    const b1 = await get(1);
    const dataset = createDataset(b1);
    for (const basis of ["national", "global"]) {
      const units = computeCapacity(dataset, { ratioBasis: basis }).units;
      const zero = units.filter((u) => u.noReferent && u.windowTotal > 0);
      const five = zero.filter((u) => u.windowTotal >= 5);
      console.log(`[live] A1-01 ${basis}: ${units.filter((u) => u.windowTotal > 0).length} topics with production in 2010–2025; leader with 0 citations: ${zero.length}; with 5 or more products: ${five.length}${five.length ? ` (${five.map((u) => `${u.label} [${u.category}]`).join("; ")})` : ""}; categories of the ones with fewer: ${JSON.stringify(zero.reduce((a, u) => ({ ...a, [u.category]: (a[u.category] || 0) + 1 }), {}))}`);
      expect(five.length, `topics with 5 or more products and no referent (${basis})`).toBe(0);
    }
    // (1) groups of Artes with 0 projects, (5) centres without key in the table of projects, (2) field filter on the real bundle
    const b3 = await get(3);
    const entries = Object.entries(b3.artes.proy_grupos);
    const zeros = entries.filter(([, v]) => v === 0).map(([k]) => k);
    console.log(`[live] G-1: ${entries.length} groups in panel 13, ${zeros.length} with 0 projects (${zeros.join("; ")}); sum ${entries.reduce((a, [, v]) => a + v, 0)}; creacion_proyectos_unicos ${b3.artes.creacion_proyectos_unicos}`);
    const missing = b3.centros.filter((c) => !(c in b3.proj.by_centro));
    console.log(`[live] G-4: ${b3.centros.length} centres in the filter, ${b3.proj.by_centro ? Object.keys(b3.proj.by_centro).length : 0} keys in by_centro, ${missing.length} centres without key (${missing.length === 26 ? "all" : `${missing.length} of ${b3.centros.length}`}); «Sin centro» key: ${"Sin centro" in b3.proj.by_centro}`);
    const ds3 = createFoundationsDataset(b3);
    const whole = computeFoundations(ds3, DEFAULT_FOUNDATIONS_FILTERS).groupGrid.total;
    const withField = computeFoundations(ds3, { ...DEFAULT_FOUNDATIONS_FILTERS, fieldIndex: 0 }).groupGrid.total;
    console.log(`[live] G-2: active groups ${whole}; with field 0 «${b3.fields[0]}» ${withField}`);
    expect(withField).toBeLessThan(whole);
    // (8), (14)
    const b2 = await get(2);
    const ds2 = createCollaborationDataset(b2);
    const r2 = computeCollaboration(ds2, {});
    console.log(`[live] M-06: last year of patents ${r2.patentsLastYear}; 05b units ${JSON.stringify(r2.trendOthers.map((s) => [s.label, s.unit]))}`);
    expect(r2.patentsLastYear).toBe(2023);
    expect(r2.trendOthers.every((s) => s.unit)).toBe(true);
    console.log(`[live] N-04: T2 «con aportante externo» (P[5]) = ${r2.kpis.projectsExternal}; T3 does not show a count of funders (no key «externo» in its code)`);
  });

  test("Board 1: KPI 4 to 6 and the summary say 2010–2025, the panel 6 note, and «Restablecer filtros» clears the pinned point and the isolated categories", async ({ page }) => {
    test.setTimeout(250000);
    await open(page, "/observatories/vri-udea/board-1?cat=lider,consolidado");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    const body = () => page.locator("body").innerText();
    await expect.poll(async () => (await body()).toLowerCase(), { timeout: 60000 }).toContain("unidades líder + consolidado (2010–2025)"); /* F94 puts a capital first */
    const text = (await body()).toLowerCase();
    expect(text).toContain("unidades emergentes + en consolidación (2010–2025)");
    expect(text).toContain("unidades en riesgo de desaparecer (2010–2025)");
    expect(text).toMatch(/con producción \(2010–2025\)/);
    /* F100 (D-223), F108 (D-243): the header note of the panel (it repeated the care) is gone; the window says once that it does not follow the filters */
    await page.getByTestId("chart-card").filter({ hasText: "5 · Meta / reto" }).first().getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-care").last()).toContainText("No mide producción: no cambia con los filtros de años, centro, tema, ODS ni unidad.");
    await expect(page.getByTestId("panel-info-note")).toHaveCount(0);
    await page.keyboard.press("Escape");
    expect(text).not.toContain("términos Núcleo");
    // pin a point
    const card = page.getByTestId("chart-card").first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.locator("canvas").first().boundingBox();
    let pinned = false;
    for (let gy = 1; gy <= 14 && !pinned; gy++) {
      for (let gx = 1; gx <= 24 && !pinned; gx++) {
        const x = box.x + (box.width * gx) / 25;
        const y = box.y + (box.height * gy) / 15;
        await page.mouse.move(x, y);
        await page.waitForTimeout(60);
        if (!(await page.locator(".g2-tooltip:visible").count())) continue;
        await page.mouse.click(x, y);
        await page.waitForTimeout(250);
        pinned = !(await page.getByText("Pase el cursor por un punto").count());
      }
    }
    expect(pinned, "a point is pinned").toBe(true);
    expect(page.url()).toContain("cat=");
    await page.getByTestId("filters-reset").click();
    await expect(page.getByText("Pase el cursor por un punto")).toBeVisible({ timeout: 20000 });
    await expect.poll(() => page.url(), { timeout: 20000 }).not.toContain("cat=");
    console.log(`[live] A1-09: after «Restablecer filtros» the pinned point is gone and the URL is ${new URL(page.url()).search || "clean"}`);
  });

  test("Board 3 and Board 2 in the page: panel 13 note, tile of professors, lead, note of the patents with the year of the bundle", async ({ page }) => {
    test.setTimeout(250000);
    await open(page, "/observatories/vri-udea/board-3");
    await expect(page.getByText("13 · Proyectos de los grupos")).toBeVisible({ timeout: 120000 });
    const t3 = await page.locator("body").innerText();
    expect(t3).toContain("(37 proyectos únicos; algunos tienen varios grupos)"); // F88 restores it with B142
    expect(t3).toMatch(/\d+ proyectos de \d+ grupos \(\d+ proyectos únicos; algunos tienen varios grupos\)\. No responde a los filtros\./);
    expect(t3).toContain("profesores con producción (con contrato vigente al 30 de mayo de 2026)");
    expect(t3).toContain("El filtro de documento delimita los productos que el panel de jueces asignó a alguno de sus ejes");
    await open(page, "/observatories/vri-udea/board-2");
    await expect(page.getByTestId("patents-last-year-note")).toBeVisible({ timeout: 120000 });
    await expect(page.getByTestId("patents-last-year-note")).toContainText("la última concesión es de 2023");
  });
});
