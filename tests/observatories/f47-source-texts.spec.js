/*
 * F47 (D-140, D-141, D-145), rewritten by F112 (D-249): sources, dates of cut and types of product are said once, in the notes of the foot of
 * the Board 1 (the dates come from GET /cut, never written by hand); no card, no KPI note and no block of help repeats them, and no text gives
 * the citations to ImpactU. The first block needs no server; the second (E2E_LIVE=1) reads the real quyca and the dev server of Luis.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { TYPES_HELP, realDataWarnings } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

test.describe("texts of the foot (no server)", () => {
  test("the text of the types says what each source does and is a note of the foot", () => {
    expect(TYPES_HELP).toContain("artículos, libros y capítulos");
    expect(TYPES_HELP).toContain("normalizado de ImpactU");
    expect(TYPES_HELP).toContain("article, book, book-chapter");
    expect(TYPES_HELP).toContain("las reseñas");
    expect(realDataWarnings({ n_sel: 100, n_topic: 90 })).toContain(TYPES_HELP);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("texts of the sources against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  const open = async (page) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1200);
  };

  test("the sources and their dates are only in the foot, with the dates of /cut; the cards, the KPI and the block of help carry none", async ({ page }) => {
    const cut = await (await fetch(`${API}/observatories/vri-udea/cut`)).json();
    const openalex = cut.data.fuentes.find((f) => f.clave === "openalex_citas");
    expect(openalex.fecha_corte).toBe("2026-11-06");
    await open(page);
    await expect(page.getByTestId("source-note")).toHaveCount(0);
    const foot = page.getByTestId("method-notes");
    await expect(foot).toContainText("Fuentes y fechas de corte");
    await expect(foot).toContainText("OpenAlex (citas y datos bibliométricos de los productos): 6 de noviembre de 2026");
    await expect(foot).toContainText(TYPES_HELP);
    await page.getByText("¿Cómo usar este tablero?").click();
    const main = await page.locator("main").innerText();
    expect(main).not.toMatch(/consultados el \d+ de noviembre/);
    expect(main.split(TYPES_HELP).length - 1).toBe(1);
    expect(main.split("Productos: ImpactU (extracción").length - 1).toBe(0);
  });

  test("no text gives the citations to ImpactU, and the notes of the records come from facts[14] with no figure written by hand", async ({ page }) => {
    await open(page);
    const main = await page.locator("main").innerText();
    expect(main).not.toMatch(/citas de ImpactU|Citas ImpactU|citas \(ImpactU\)/i);
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const withRecord = raw.facts.filter((f) => f[14] === 1).length;
    const without = raw.facts.length - withRecord;
    const result = computeCapacity(createDataset(raw));
    expect(result.fwciBasis).toEqual({ withRecord, withoutRecord: without });
    await expect(page.getByText(`FWCI calculado sobre ${withRecord.toLocaleString("es-CO")} productos con registro en OpenAlex; ${without.toLocaleString("es-CO")} productos`, { exact: false })).toBeVisible();
    console.log(`[live] with record ${withRecord}, without ${without}, total ${raw.facts.length}`);
  });
});
