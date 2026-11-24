/*
 * F93 (Q-28 part B, D-207, D-208): the tooltip of the ranking of funders of Board 2 carries the cash and in-kind contributions
 * (B146: ext.funders_montos and ext.project_funders_montos). The first block needs no server; the second (E2E_LIVE=1) reads the
 * bundle of B146 and the page in one run. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { fundingDetails, funderRows, millions } from "../../lib/observatories/funderRows";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("F93 amounts of the funders (no server)", () => {
  test("millions of pesos with the separator of es-CO", () => {
    expect(millions(237500465826.34)).toBe("$237.500 millones");
    expect(millions(0)).toBe("$0 millones");
    expect(millions(300000)).toBe("menos de $1 millón");
    expect(millions(2526371748)).toBe("$2.526 millones");
  });

  test("lines of the tooltip: cash, in kind and projects with a declared amount; none about the currency", () => {
    const lines = fundingDetails({ cash: 237500465826.34, inKind: 2526371748, withAmount: 445 });
    expect(lines).toEqual([
      { name: "Aportes en dinero", value: "$237.500 millones" },
      { name: "Aportes en especie", value: "$2.526 millones" },
      { name: "Con monto en dinero o en especie declarado en COP", value: "445 proyectos" },
    ]);
    expect(JSON.stringify(lines)).not.toMatch(/moneda|USD|EUR|UdeA/i);
    expect(fundingDetails({ cash: 0, inKind: 0, withAmount: 1 })[2].value).toBe("1 proyecto");
  });

  test("F135: the tooltip adds «Total estimado (COP)» after the three lines when the funder carries a total, and the bar stays the number of projects", () => {
    const lines = fundingDetails({ cash: 504e6, inKind: 0, withAmount: 2, total: 22876e6 });
    expect(lines).toHaveLength(4);
    expect(lines[3]).toEqual({ name: "Total estimado (COP)", value: "$22.876 millones" });
    const rows = funderRows([{ nm: "NIH", fsector: "g", proyectos: 15, cash: 504e6, inKind: 0, withAmount: 2, total: 22876e6 }, { nm: "Solo total", fsector: "g", proyectos: 6, total: 2203e6 }], () => "S");
    expect(rows[0].segments[0].value).toBe(15);
    expect(rows[1].details).toEqual([{ name: "Total estimado (COP)", value: "$2.203 millones" }]);
    expect(JSON.stringify(lines)).not.toMatch(/USD|EUR|UdeA/i);
  });

  test("a row has details only when the funder carries amounts, and its value is still the number of projects", () => {
    const rows = funderRows([{ nm: "Minciencias ", fsector: "g", proyectos: 450, cash: 10e6, inKind: 0, withAmount: 4 }, { nm: "Otra", fsector: "g", proyectos: 3 }], () => "S");
    expect(rows[0].details).toHaveLength(3);
    expect(rows[0].segments[0].value).toBe(450);
    expect(rows[1].details).toBeUndefined();
  });
});

test.describe("F93 against the bundle of B146 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let bundle;
  let dataset;
  test.beforeAll(async () => {
    const res = await fetch(`${API}/observatories/atlas-udea/boards/2/bundle`);
    console.log(`[live] ETag T2 ${res.headers.get("etag")}`);
    expect(res.headers.get("etag")).toBe('"20261107-bec6b50fc071"');
    bundle = await res.json();
    bundle.funders = bundle.ext.funders;
    dataset = createCollaborationDataset(bundle);
  });

  test("with the filters of projects of the whole range, each funder reproduces ext.funders_montos exactly", () => {
    const all = computeCollaboration(dataset, { yearFrom: 2010, yearTo: 2026 }).funders;
    const fixed = bundle.ext.funders_montos;
    const names = bundle.ext.funders.map((f) => f.nm);
    let compared = 0;
    for (const f of all) {
      const k = names.indexOf(f.nm);
      expect(f.cash, f.nm).toBeCloseTo(fixed[k].efectivo_cop, 0);
      expect(f.inKind, f.nm).toBeCloseTo(fixed[k].especie_cop, 0);
      expect(f.withAmount, f.nm).toBe(fixed[k].proyectos_con_monto);
      compared++;
    }
    console.log(`[live] ${compared} funders compared against ext.funders_montos`);
    expect(compared).toBeGreaterThan(20);
  });

  test("a narrower range gives smaller amounts, summed pair by pair, and the UdeA is not in the ranking", () => {
    const wide = computeCollaboration(dataset, { yearFrom: 2010, yearTo: 2026 }).funders;
    const narrow = computeCollaboration(dataset, { yearFrom: 2020, yearTo: 2022 }).funders;
    const sum = (list, key) => list.reduce((a, f) => a + (f[key] || 0), 0);
    console.log(`[live] cash of the ranking: ${Math.round(sum(wide, "cash") / 1e6)} millones (2010–2026) and ${Math.round(sum(narrow, "cash") / 1e6)} millones (2020–2022); projects ${sum(wide, "proyectos")} and ${sum(narrow, "proyectos")}`);
    expect(sum(narrow, "cash")).toBeLessThan(sum(wide, "cash"));
    expect(sum(narrow, "proyectos")).toBeLessThan(sum(wide, "proyectos"));
    expect(wide.map((f) => f.nm).join("|")).not.toMatch(/Universidad de Antioquia|UdeA/);
    // the order of the ranking keeps being by projects
    for (let i = 1; i < wide.length; i++) expect(wide[i - 1].proyectos).toBeGreaterThanOrEqual(wide[i].proyectos);
  });

  test("none of the 30 funders has a doubtful line (B177 [real]: the six lines in foreign currency are converted; NIH had 1 in B176); the panel carries no note per line", () => {
    const doubtful = bundle.ext.funders_montos.map((m, i) => [bundle.ext.funders[i].nm, m.lineas_dudosas]).filter((x) => x[1] > 0);
    expect(doubtful).toEqual([]);
  });

  test("F135 (B176): the pair totals reproduce monto_total_cop of every funder over the whole range, and a narrower range gives less", () => {
    const pairs = bundle.ext.project_funders_total_cop;
    expect(pairs).toHaveLength(bundle.projects.length);
    bundle.ext.project_funders.forEach((l, p) => expect(pairs[p]).toHaveLength(l.length));
    const all = computeCollaboration(dataset, { yearFrom: 2000, yearTo: 2030 }).funders;
    const names = bundle.ext.funders.map((x) => x.nm);
    expect(all.length).toBeGreaterThan(20);
    let sum = 0;
    for (const f of all) {
      expect(f.total, f.nm).toBeCloseTo(bundle.ext.funders[names.indexOf(f.nm)].monto_total_cop, 0);
      sum += f.total;
    }
    const nih = all.find((f) => /NIH/.test(f.nm));
    console.log("[live] F135: NIH total " + Math.round(nih.total / 1e6) + " millones with " + nih.proyectos + " projects; shown funders sum " + Math.round(sum / 1e6) + " millones");
    const narrow = computeCollaboration(dataset, { yearFrom: 2020, yearTo: 2022 }).funders;
    expect(narrow.reduce((a, f) => a + f.total, 0)).toBeLessThan(sum);
  });

  test("F135: without the list per project the ranking of the bundle carries monto_total_cop as the total", () => {
    const fixed = createCollaborationDataset({ ...bundle, ext: { ...bundle.ext, project_funders: undefined } });
    const unfiltered = computeCollaboration(fixed, {}).funders;
    expect(unfiltered.every((f) => Number.isFinite(f.total))).toBe(true);
    const nih = unfiltered.find((f) => /NIH/.test(f.nm));
    expect(nih.total).toBeCloseTo(bundle.ext.funders.find((x) => /NIH/.test(x.nm)).monto_total_cop, 0);
  });

  test("the page: the ranking draws, the panel says nothing about the currency and no «Nombre original»", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/atlas-udea/board-2");
    const card = page.getByTestId("chart-card").filter({ hasText: "Entidades que financian" }).first();
    await card.waitFor({ timeout: 120000 });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    const text = await card.innerText();
    expect(text).not.toMatch(/Nombre original|moneda|USD|EUR\b/);
    await card.locator("canvas").first().waitFor({ timeout: 60000 }); // the chart is drawn after the page; wait for it
    expect(await card.locator("canvas").count()).toBeGreaterThan(0);
  });
});

test.describe("F97 the ranking of B150 against the tooltip (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("797 pairs project–funder (B176; 784 before), San Vicente as one row at the fifth place, the Municipio de Medellín at the sixth with its amounts, and the panel draws the first 25", async () => {
    const res = await fetch(`${API}/observatories/atlas-udea/boards/2/bundle`);
    expect(res.headers.get("etag")).toBe('"20261107-bec6b50fc071"');
    const b = await res.json();
    const pairs = b.ext.project_funders_montos.reduce((a, l) => a + l.length, 0);
    expect(pairs).toBe(797);
    b.funders = b.ext.funders;
    const ranking = computeCollaboration(createCollaborationDataset(b), { yearFrom: 2010, yearTo: 2026 }).funders;
    const sv = ranking.filter((f) => /san vicente/i.test(f.nm) && !/pa[uú]l/i.test(f.nm));
    expect(sv).toHaveLength(1);
    expect(ranking.indexOf(sv[0])).toBe(4);
    expect(sv[0].proyectos).toBe(21);
    const k = ranking.findIndex((f) => f.nm.trim() === "Municipio de Medellín");
    console.log(`[live] pairs ${pairs}; bundle funders ${b.ext.funders.length}; shown ${ranking.length}; Municipio de Medellín at place ${k + 1}: ${ranking[k]?.proyectos} projects, cash ${Math.round(ranking[k]?.cash / 1e6)} and in kind ${Math.round(ranking[k]?.inKind / 1e6)} millones`);
    expect(k).toBe(5);
    expect(ranking[k].proyectos).toBe(21);
    expect(Math.round(ranking[k].cash / 1e6)).toBe(1694);
    expect(Math.round(ranking[k].inKind / 1e6)).toBe(1931);
    expect(b.ext.funders).toHaveLength(30);
    expect(ranking).toHaveLength(25);
  });
});
