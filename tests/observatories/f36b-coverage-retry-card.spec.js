/*
 * F36b: coverage note of the centre filter in Boards 2 and 3, "Reintentar" button, notice of
 * Board 2 and the card of the call 894. The first block needs no server; the second reads the real
 * quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { createCollaborationDataset } from "../../lib/observatories/collaboration";
import { createFoundationsDataset } from "../../lib/observatories/foundations";
import { centerCoverageNote, CENTER_TOOLTIP } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { linkageNote } from "../../app/observatories/vri-udea/board-3/components/boardTexts";
import { realNotice } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { LOAD_ERROR_SUBTITLES } from "../../lib/observatories/data/loadError";

test.describe("F36b texts and coverage (no server)", () => {
  test("Board 2: coverage counts the works with a group that belongs to a centre", () => {
    const raw = {
      sectors: [], thesaurus: { agendas: [] }, depts: [], insts: [], centros: ["C0"],
      groups: [{ c: 0 }, { c: -1 }],
      works: [[0, 0, 0, 0, [], [], [], [], [0]], [0, 0, 0, 0, [], [], [], [], [1]], [0, 0, 0, 0, [], [], [], [], []], [0, 0, 0, 0, [], [], [], [], [1, 0]]],
      projects: [],
    };
    expect(createCollaborationDataset(raw).centerCoverage).toEqual({ withCenter: 2, total: 4 });
  });

  test("Board 3: coverage counts the products with a group in a centre and ignores «Sin centro»", () => {
    const P = [[], [], [], []].map((_, i) => Array.from({ length: 16 }, (_, k) => (k === 12 ? [[0], [1], [], [1, 0]][i] : 0)));
    const dataset = createFoundationsDataset({
      tops: [], top_meta: {}, centros: ["C0", "Sin centro"],
      groups: [["g0", 0, 0, 0, "C0"], ["g1", 0, 0, 0, "Sin centro"]],
      P, A: [],
    });
    expect(dataset.centerCoverage.total).toBe(4);
    expect(dataset.centerCoverage.withCenter).toBeLessThanOrEqual(4);
    expect(centerCoverageNote(dataset.centerCoverage)).toContain("productos");
    expect(CENTER_TOOLTIP.length).toBeGreaterThan(10);
  });

  test("the notice of Board 2 says there are no patents, and nothing about abstracts", () => {
    const text = realNotice({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 735, appropriation: 752 });
    expect(text).toContain("La base no contiene patentes;");
    expect(text).not.toMatch(/resúmenes|resumenes/);
  });

  test("the sentence of the call 894 shows the people without linkage so the breakdown is not read as a sum", () => {
    const text = linkageNote({ personas: 2638, por_vinculacion: { Regular: 262, "Cátedra": 248, "Ocasional": 148 } });
    expect(text).toContain("2.638 personas; 658 declaran vinculación (regular 262, cátedra 248, ocasional 148) y 1.980 no la declaran.");
    expect(linkageNote({ personas: 0, por_vinculacion: {} })).toBe("");
  });

  test("the error text keeps its subtitle for a network failure", () => {
    expect(LOAD_ERROR_SUBTITLES.network).toContain("inténtelo de nuevo");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n) => `/observatories/vri-udea/board-${n}`;
const bundle = async (n) => (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();

test.describe("F36b against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Boards 2 and 3 show the coverage note calculated from their own bundle, and the tooltip", async ({ page }) => {
    const cases = [[2, createCollaborationDataset], [3, createFoundationsDataset]];
    for (const [n, create] of cases) {
      const cov = create(await bundle(n)).centerCoverage;
      console.log(`[live] board ${n} coverage: ${cov.withCenter} of ${cov.total}`);
      expect(cov.withCenter).toBeGreaterThan(0);
      expect(cov.withCenter).toBeLessThan(cov.total);
      await page.goto(BOARD(n));
      // Since F48b the note is in the tooltip of the help icon of the filter.
      const field = page.locator("label", { hasText: "Centro de investigación" }).first().locator("xpath=../..");
      await expect(field.getByTestId("filter-help")).toBeVisible({ timeout: 120000 });
      await expect(field.getByText(centerCoverageNote(cov))).toHaveCount(0);
      await field.getByTestId("filter-help").hover();
      await expect(page.getByText(centerCoverageNote(cov))).toBeVisible({ timeout: 5000 });
      await page.mouse.move(5, 5);
      await field.locator(".ant-select").hover();
      await expect(page.getByText(CENTER_TOOLTIP).last()).toBeVisible({ timeout: 5000 });
    }
  });

  test("«Reintentar» asks for the bundle again without reloading the page (three boards)", async ({ page }) => {
    for (const n of [1, 2, 3]) {
      let calls = 0;
      await page.route(`**/observatories/vri-udea/boards/${n}/bundle`, (route) => {
        calls += 1;
        return calls === 1 ? route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "x", code: "observatory_not_loaded" }) }) : route.continue();
      });
      await page.goto(BOARD(n));
      await expect(page.getByText("No se pudieron cargar los datos del tablero.")).toBeVisible({ timeout: 120000 });
      await expect(page.getByText(LOAD_ERROR_SUBTITLES.observatory_not_loaded)).toBeVisible();
      let reloaded = false;
      page.once("load", () => { reloaded = true; });
      await page.getByRole("button", { name: "Reintentar" }).click();
      await expect(page.getByText("No se pudieron cargar los datos del tablero.")).toHaveCount(0, { timeout: 120000 });
      await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
      expect(calls).toBe(2);
      expect(reloaded).toBe(false);
      await page.unroute(`**/observatories/vri-udea/boards/${n}/bundle`);
    }
  });

  test("Board 2: the notice no longer says the base has no abstracts", async ({ page }) => {
    await page.goto(BOARD(2));
    await expect(page.getByText("Ensayo con limitaciones de datos").first()).toBeVisible({ timeout: 120000 });
    const text = await page.locator("main").innerText();
    expect(text).toContain("La base no contiene patentes;");
    expect(text).not.toMatch(/patentes ni resúmenes/);
  });

  test("Board 3: the card and the sentence of the call 894 appear and the breakdown is not shown as a sum", async ({ page }) => {
    const { talent } = await bundle(3);
    const sheet = talent.inv_sheet;
    expect(sheet.personas).toBeGreaterThan(0);
    const declared = Object.values(sheet.por_vinculacion).reduce((a, n) => a + n, 0);
    expect(declared).toBeLessThan(sheet.personas);
    await page.goto(BOARD(3));
    await expect(page.getByText("investigadores en grupos (conv. 894)", { exact: false }).first()).toBeVisible({ timeout: 120000 });
    await expect(page.getByText(linkageNote(sheet).trim(), { exact: false })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).toContain(`${(sheet.personas - declared).toLocaleString("es-CO")} no la declaran`);
  });
});
