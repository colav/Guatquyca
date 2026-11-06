/*
 * F47 (D-140, D-141, D-145): the texts of the sources of Board 1 show the date of the readings of OpenAlex in
 * Bogotá time, read from meta.corte_openalex (never written by hand), the types of product, and no text gives
 * the citations to ImpactU. The first block needs no server; the second reads the real quyca and the dev
 * server of Luis (D-100) and only runs with E2E_LIVE=1. No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { monthYear, rangeDate, sourceSentences } from "../../lib/observatories/cutDate";
import { TYPES_FOOT, TYPES_HELP } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const CUT = { citas: "2026-11-06T03:31:54Z/2026-11-06T04:16:36Z", referente: "2026-11-06T04:01:13Z/2026-11-06T04:18:49Z" };

test.describe("dates and sentences (no server)", () => {
  test("a reading of 6 Nov 03:31 to 04:18 UTC is of 5 November in Bogotá time, in Spanish", () => {
    expect(rangeDate(CUT.citas)).toBe("5 de noviembre de 2026");
    expect(rangeDate(CUT.referente)).toBe("5 de noviembre de 2026");
  });

  test("a range of several days says «del 5 al 6», also across months or years", () => {
    expect(rangeDate("2026-11-05T20:00:00Z/2026-11-06T06:00:00Z")).toBe("del 5 al 6 de noviembre de 2026");
    expect(rangeDate("2026-11-30T20:00:00Z/2026-12-01T20:00:00Z")).toBe("del 30 de noviembre de 2026 al 1 de diciembre de 2026");
    expect(rangeDate("2026-01-01T02:00:00Z/2026-01-01T03:00:00Z")).toBe("31 de diciembre de 2025"); // 21:00 and 22:00 in Bogotá
  });

  test("invalid or missing ranges give no date", () => {
    expect(rangeDate(undefined)).toBe("");
    expect(rangeDate("2026-11-06")).toBe("");
    expect(rangeDate("x/y")).toBe("");
    expect(monthYear("2026-10-16")).toBe("octubre de 2026");
    expect(monthYear("")).toBe("");
  });

  test("the dates of the citations and of the referent are the same: one sentence", () => {
    const s = sourceSentences({ corte_openalex: CUT }, { etl_hasta: "2026-10-16" });
    expect(s.full).toBe("Productos: ImpactU (extracción de octubre de 2026). Citas, FWCI y referente: OpenAlex, consultados el 5 de noviembre de 2026.");
    expect(s.citations).toBe("Citas y FWCI: OpenAlex, consultados el 5 de noviembre de 2026.");
  });

  test("the dates are different: each one has its own", () => {
    const s = sourceSentences({ corte_openalex: { citas: CUT.citas, referente: "2026-11-08T15:00:00Z/2026-11-08T16:00:00Z" } }, { etl_hasta: "2026-10-16" });
    expect(s.openalex).toBe("Citas y FWCI: OpenAlex, consultados el 5 de noviembre de 2026. Referente: OpenAlex, consultado el 8 de noviembre de 2026.");
  });

  test("without the key no date is shown and nothing breaks", () => {
    for (const meta of [{}, undefined, { corte_openalex: null }, { corte_openalex: {} }, { corte_openalex: { citas: "mal", referente: "mal" } }]) {
      const s = sourceSentences(meta, undefined);
      expect(s.full).toBe("Productos: ImpactU. Citas, FWCI y referente: OpenAlex.");
      expect(s.full).not.toMatch(/consultad/);
    }
  });

  test("the text of the types says what each source does", () => {
    expect(TYPES_HELP).toContain("artículos, libros y capítulos");
    expect(TYPES_HELP).toContain("normalizado de ImpactU");
    expect(TYPES_HELP).toContain("article, book, book-chapter");
    expect(TYPES_HELP).toContain("las reseñas");
    expect(TYPES_FOOT).toBe("Tipos según cada fuente; ver ayuda.");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BUNDLE_1 = "**/observatories/vri-udea/boards/1/bundle";

test.describe("texts of the sources against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  const open = async (page) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1200);
  };

  test("the date comes from the bundle and is in the help, in the foot of the panels 1 and 2 and in the note of the KPI", async ({ page }) => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const s = sourceSentences(raw.meta, raw.obs && raw.obs.corte);
    expect(raw.meta.corte_openalex).toBeTruthy();
    expect(s.full).toMatch(/consultados el 5 de noviembre de 2026\.$/);
    await open(page);
    await expect(page.getByTestId("source-note")).toHaveCount(2); // panels 1 and 2
    for (const text of await page.getByTestId("source-note").allInnerTexts()) expect(text).toContain(s.full);
    await expect(page.getByText(`${TYPES_FOOT}`, { exact: false })).toBeVisible();
    await expect(page.getByText(s.citations, { exact: false }).first()).toBeVisible(); // note of the KPI of citations and FWCI
    await page.getByText("¿Cómo usar este tablero?").click();
    await expect(page.getByText(TYPES_HELP)).toBeVisible();
    expect((await page.locator("main").innerText()).split(s.full).length - 1).toBeGreaterThanOrEqual(3); // help and two feet
  });

  test("the global text of /cut for ImpactU stays", async ({ page }) => {
    await open(page);
    await expect(page.getByText(/Datos consultados en octubre de 2026/).first()).toBeVisible({ timeout: 20000 });
  });

  test("with the two dates different the page shows each one, and without the key it shows no date and does not break", async ({ page }) => {
    await page.route(BUNDLE_1, async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      body.meta.corte_openalex = { citas: CUT.citas, referente: "2026-11-08T15:00:00Z/2026-11-08T16:00:00Z" };
      await route.fulfill({ response, json: body });
    });
    await open(page);
    await expect(page.getByTestId("source-note").first()).toContainText("Referente: OpenAlex, consultado el 8 de noviembre de 2026.");
    await page.unroute(BUNDLE_1);
    await page.route(BUNDLE_1, async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      delete body.meta.corte_openalex;
      await route.fulfill({ response, json: body });
    });
    await open(page);
    const text = await page.getByTestId("source-note").first().innerText();
    expect(text).toContain("Citas, FWCI y referente: OpenAlex.");
    expect(text).not.toMatch(/consultad/);
    await expect(page.getByLabel("Filtros")).toBeVisible();
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
