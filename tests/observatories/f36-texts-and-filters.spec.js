/*
 * F36: labels of the unit filters, coverage note of the centre filter and texts with calculated
 * figures. The first block needs no server; the second reads the real quyca and the dev server of
 * Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { centerCoverageNote, CENTER_TOOLTIP } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { realNotice } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { getBoardBundle } from "../../lib/apis/observatory.api";

test.describe("download of the bundle that is cut halfway (no server)", () => {
  const realFetch = globalThis.fetch;
  test.afterEach(() => { globalThis.fetch = realFetch; });
  const answer = (json) => ({ ok: true, status: 200, json });

  test("a body cut halfway is tried once more and then it works", async () => {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return answer(calls === 1 ? async () => { throw new TypeError("network error"); } : async () => ({ ok: 1 })); };
    await expect(getBoardBundle("vri-udea", 1)).resolves.toEqual({ ok: 1 });
    expect(calls).toBe(2);
  });

  test("two cuts in a row are reported as a network failure, not as a server error", async () => {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return answer(async () => { throw new TypeError("network error"); }); };
    const error = await getBoardBundle("vri-udea", 1).catch((e) => e);
    expect(error.isNetwork).toBe(true);
    expect(calls).toBe(2);
  });

  test("an HTTP error is not retried and keeps its status and code", async () => {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return { ok: false, status: 503, json: async () => ({ error: "x", code: "observatory_not_loaded" }) }; };
    const error = await getBoardBundle("vri-udea", 1).catch((e) => e);
    expect(error.status).toBe(503);
    expect(error.code).toBe("observatory_not_loaded");
    expect(calls).toBe(1);
  });
});

test.describe("texts with calculated figures (no server)", () => {
  test("the coverage note of the centre filter takes both figures from the data", () => {
    expect(centerCoverageNote({ withCenter: 2100, total: 50000 })).toBe("2.100 de 50.000 productos (4,2 %) están en algún centro de investigación; el resto no tiene grupo asignado a un centro.");
    expect(centerCoverageNote({ withCenter: 27239, total: 49315 })).toContain("55,2 %");
    expect(centerCoverageNote({ withCenter: 0, total: 0 })).toBe("");
    expect(CENTER_TOOLTIP).toBe("Centro de investigación al que se adscriben los grupos que firman el producto");
  });

  test("the notice of Board 2 for the API is built from the figures it receives", () => {
    const text = realNotice({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 735, appropriation: 752 });
    expect(text).toContain("8 de los 12 documentos tienen ejes; los otros 4 solo aportan metas");
    expect(text).toContain("735 de 752 productos de apropiación social no tienen año");
    expect(text).not.toContain("Alcaldía de Medellín");
  });

  test("the coverage of the centres in a dataset counts the works with a group in a centre", () => {
    const facts = [[0, 2021, 1, 0, 0, 0, [], [], [0], []], [0, 2022, 1, 0, 0, 0, [], [], [], []], [0, 2023, 1, 0, 0, 0, [], [], [0, 1], []]];
    const dataset = createDataset({ meta: {}, topics: [{ id: "T1", t: "A", sf: "S", f: "F", d: "D", gm: 1, gw: 1, link: [] }], facts, ejes: [], groups: [], cens: ["C0", "C1"], facs: [], deps: [], subregiones: [], actores: [] });
    expect(dataset.centerCoverage).toEqual({ withCenter: 2, total: 3 });
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n) => `/observatories/vri-udea/board-${n}`;

test.describe("F36 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let raw1;
  test.beforeAll(async () => {
    raw1 = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
  });

  test("Board 1: «Unidad académica» and «Subunidad académica», the coverage note and the tooltip of the centre filter", async ({ page }) => {
    await page.goto(BOARD(1));
    await expect(page.getByText("6 · Unidad académica")).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("7 · Subunidad académica")).toBeVisible();
    const main = await page.locator("main").innerText();
    expect(main).not.toMatch(/Facultad|Departamento/);
    // The note of the centre filter is the one calculated from this bundle (no fixed figure).
    const cov = createDataset(raw1).centerCoverage;
    const expected = centerCoverageNote(cov);
    expect(expected).toContain(cov.withCenter.toLocaleString("es-CO"));
    // Since F48b the note is in the tooltip of the help icon of the filter (not under the control).
    const field = page.locator("label", { hasText: "3 · Centro de investigación" }).first().locator("xpath=../..");
    await expect(field.getByText(expected)).toHaveCount(0);
    await field.getByTestId("filter-help").hover();
    await expect(page.getByText(expected)).toBeVisible({ timeout: 5000 });
    await page.mouse.move(5, 5);
    // The tooltip of the control stays on the select of the filter.
    await field.locator(".ant-select").hover();
    await expect(page.getByText(CENTER_TOOLTIP).last()).toBeVisible({ timeout: 5000 });
  });

  test("the unit and the subunit filters stack (calculation and page)", async ({ page }) => {
    const dataset = createDataset(raw1);
    // A unit that has a subunit with production in it.
    const fact = raw1.facts.find((f) => f[6].length && f[7].length);
    const unit = fact[6][0];
    const sub = fact[7][0];
    const all = computeCapacity(dataset);
    const withUnit = computeCapacity(dataset, { facultyIndex: unit });
    const stacked = computeCapacity(dataset, { facultyIndex: unit, departmentIndex: sub });
    expect(withUnit.products).toBeLessThan(all.products);
    expect(stacked.products).toBeGreaterThan(0);
    expect(stacked.products).toBeLessThanOrEqual(withUnit.products);
    // Same figure on the page that opens with both filters in the URL.
    await page.goto(`${BOARD(1)}?faculty=${unit}&department=${sub}`);
    await expect(page.locator("main").getByText("Productos filtrados").first()).toContainText(stacked.products.toLocaleString("es-CO"), { timeout: 120000 });
  });

  test("Boards 2 and 3 use the same labels and no «Facultad» or «Departamento» filter", async ({ page }) => {
    for (const n of [2, 3]) {
      await page.goto(BOARD(n));
      await expect(page.getByText("Unidad académica").first()).toBeVisible({ timeout: 120000 });
      await expect(page.getByText("Subunidad académica").first()).toBeVisible();
      const text = await page.locator("main").innerText();
      expect(text, `board ${n}`).not.toMatch(/\bFacultad\b/);
    }
  });

  test("texts with figures: Board 1 lead and help say eight categories; Board 2 notice and Board 3 notes are calculated", async ({ page }) => {
    await page.goto(BOARD(1));
    await expect(page.getByText("medida en ocho categorías")).toBeVisible({ timeout: 120000 });
    expect(await page.locator("main").innerText()).not.toContain("seis categorías");

    await page.goto(BOARD(2));
    await expect(page.getByText("Ensayo con limitaciones de datos").first()).toBeVisible({ timeout: 120000 });
    const t2 = await page.locator("main").innerText();
    const raw2 = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    expect(t2).toContain(`${raw2.thesaurus.agendas.length} de los 12 documentos tienen ejes`);
    expect(t2).not.toContain("562 productos");
    expect(t2).not.toContain("6 de los 12 documentos");

    await page.goto(BOARD(3));
    await expect(page.getByText("Datos de ImpactU").first()).toBeVisible({ timeout: 120000 });
    const t3 = await page.locator("main").innerText();
    for (const stale of ["8.168", "472 empresas", "37 proyectos únicos", "18 registros sin código", "447 DOI", "corte 3 jul 2025", "42 de las 57"]) {
      expect(t3, stale).not.toContain(stale);
    }
    const raw3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const companies = raw3.inst.filter((i) => i[2] === "empresa").length;
    expect(t3).toContain(`${companies.toLocaleString("es-CO")} empresas entre`);
  });
});
