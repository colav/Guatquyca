/*
 * F67 (D-168): outdated texts of Board 2 corrected, the twelve documents named in the lead, and the list of «Documento de
 * política» in two lines (Boards 1 and 2). The first block needs no server; the second measures the lists in the page
 * (one run) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { BOARD_LEAD, FOOTER_TEXT, NOTES, NOTICE, realNotice } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { POLICY_DOCUMENTS } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;

test.describe("texts of Board 2 (no server)", () => {
  test("the lead names the twelve documents, in the order of Gabriel", () => {
    expect(POLICY_DOCUMENTS).toHaveLength(12);
    for (const name of POLICY_DOCUMENTS) expect(BOARD_LEAD).toContain(name);
    expect(BOARD_LEAD.indexOf("PDD mpal Medellín")).toBeLessThan(BOARD_LEAD.indexOf("Global Sustainable Development Report 2023 (ONU)"));
    expect(BOARD_LEAD).toContain("en doce documentos de política (PDD mpal Medellín; PDD dptal Antioquia; CONPES 4069; Misión de sabios 2019; CONPES 4144;");
  });

  test("the notice: curated axes of the thesaurus 6 and topics v2, 8 of 12 documents, the abstracts said as they are", () => {
    for (const text of [NOTICE, realNotice({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 735, appropriation: 752 })]) {
      expect(text).toContain("ejes curados del catálogo de Ejes Temáticos"); // Q-14 (F90): «thesaurus» is not said
      expect(text).toContain("tópicos de OpenAlex v2");
      expect(text).toContain("8 de los 12 documentos tienen ejes; los otros 4 solo aportan metas de colaboración");
      expect(text).not.toMatch(/términos Núcleo|coincidencia de términos|6 de los 12/);
      if (text !== NOTICE) expect(text).toContain("Las patentes salen del portafolio de propiedad intelectual"); // F66 changed this sentence in the notice of the API
    }
    expect(NOTICE).toContain("la mayoría de los productos tiene resumen");
    expect(NOTICE).not.toMatch(/patentes ni resúmenes|no incluye resúmenes/);
  });

  test("the footer cites the thesaurus 6, and the note of the IAP says that only the title is searched", () => {
    // Q-09 and Q-14 (F90): the footer names the catalogue of Ejes Temáticos in words, no file
    expect(FOOTER_TEXT).toContain("catálogo de Ejes Temáticos");
    expect(FOOTER_TEXT).not.toMatch(/thesaurus|\.xlsx/);
    expect(NOTES.v8).not.toContain("La base no incluye resúmenes");
    expect(NOTES.v8).toContain("En los productos se busca solo en el título; los resúmenes no se usan.");
  });
});

test.describe("list of documents in two lines (real quyca, one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  for (const board of ["board-1", "board-2"]) {
    test(`${board}: no name of document is cut`, async ({ page }) => {
      test.setTimeout(150000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/observatories/vri-udea/${board}`);
      await expect(page.getByTestId("filters")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1000);
      await page.getByTestId("filters").locator("label", { hasText: "Documento de política" }).locator("xpath=../..").locator(".ant-select-selector").first().click();
      await page.waitForTimeout(500);
      const d = page.locator(".ant-select-dropdown:visible").first();
      const cut = await d.locator(".ant-select-item-option-content").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length);
      const items = await d.locator(".ant-select-item-option").count();
      // scroll to the end so that the long names at the bottom are drawn too
      await d.locator(".rc-virtual-list-holder").first().evaluate((el) => { el.scrollTop = el.scrollHeight; });
      await page.waitForTimeout(300);
      const cutEnd = await d.locator(".ant-select-item-option-content").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length);
      const tall = await d.locator(".ant-select-item-option").evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().height > 40).length);
      console.log(`[live] ${board}: options drawn ${items}, cut ${cut} / at the end ${cutEnd}, options in two lines at the end ${tall}`);
      expect(cut).toBe(0);
      expect(cutEnd).toBe(0);
      expect(tall).toBeGreaterThan(0);
      await expect(page.getByText("Marco UNESCO de Educación Cultural y Artística 2025").first()).toBeVisible();
    });
  }
});
