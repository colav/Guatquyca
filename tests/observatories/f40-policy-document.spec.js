/*
 * F40: filter «Documento de política» according to D-129. The filter lists only the documents with
 * curated axes (the 4 documents that only have goals do not appear, and no filter acts on goals);
 * the names come from the bundle; no listed document is disabled or gives 0 results. The first block
 * needs no server; the second reads the real quyca and the dev server of Luis (D-100) and only runs
 * with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { createDataset, documentsWithAxes } from "../../lib/observatories/capacity";
import { computeCapacity } from "../../lib/observatories/capacity";
import { DEFAULT_COLLAB_FILTERS, computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";
import { DEFAULT_FOUNDATIONS_FILTERS, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";

test.describe("documents of the filter (no server)", () => {
  test("only the documents with axes are listed, in the order of the bundle", () => {
    const raw = {
      ejes: [{ agenda: "B" }, { agenda: "A" }, { agenda: "B" }],
      documentos: [["A", 1], ["Z", 0], ["B", 1]],
    };
    expect(documentsWithAxes(raw)).toEqual(["A", "B"]);
  });

  test("without the list of documents of the bundle (test data) the documents of the axes are used", () => {
    expect(documentsWithAxes({ ejes: [{ agenda: "B" }, { agenda: "A" }, { agenda: "B" }] })).toEqual(["B", "A"]);
  });

  test("a document of the list that has no axes is never listed", () => {
    const raw = { ejes: [{ agenda: "A" }], documentos: [["A", 1], ["Z", 0]] };
    expect(documentsWithAxes(raw)).not.toContain("Z");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n) => `/observatories/vri-udea/board-${n}`;
const bundle = async (n) => (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();

async function listedDocuments(page, labelText) {
  const field = page.locator("label", { hasText: labelText }).first().locator("xpath=../..");
  await field.locator(".ant-select").click();
  const dropdown = page.locator(".ant-select-dropdown:visible").last();
  await dropdown.locator(".ant-select-item-option").first().waitFor();
  const options = await dropdown.locator(".ant-select-item-option").evaluateAll((nodes) =>
    nodes.map((n) => ({ text: n.getAttribute("title") || n.innerText, disabled: n.classList.contains("ant-select-item-option-disabled") })),
  );
  await page.keyboard.press("Escape");
  return options;
}

test.describe("filter «Documento de política» against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 1 lists the 8 documents with axes of the bundle, none disabled, none with 0 results", async ({ page }) => {
    const raw = await bundle(1);
    const names = documentsWithAxes(raw);
    expect(names).toHaveLength(8);
    const dataset = createDataset(raw);
    for (const name of names) expect(computeCapacity(dataset, { policyDoc: name }).products, name).toBeGreaterThan(0);
    // The documents without axes are in the bundle, with the flag 0, and are not offered.
    const withoutAxes = raw.documentos.filter((d) => d[1] === 0).map((d) => d[0]);
    expect(withoutAxes).toHaveLength(4);
    await page.goto(BOARD(1));
    await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
    const options = await listedDocuments(page, "Documento de política");
    expect(options.map((o) => o.text).sort()).toEqual([...names].sort());
    expect(options.filter((o) => o.disabled)).toEqual([]);
    for (const name of withoutAxes) expect(options.map((o) => o.text)).not.toContain(name);
  });

  test("Board 2 lists the 8 documents with terms of the thesaurus; the filter acts on works, not on goals; the 24 goals of the other 4 stay", async ({ page }) => {
    const raw = await bundle(2);
    const names = raw.thesaurus.agendas.map((a) => a.name);
    expect(names).toHaveLength(8);
    const dataset = createCollaborationDataset(raw);
    for (const name of names) expect(computeCollaboration(dataset, { ...DEFAULT_COLLAB_FILTERS, policyDoc: name }).kpis.works, name).toBeGreaterThan(0);
    // The goals (55) do not depend on the filter; the 4 documents without terms have 24 of them.
    const goalsOfOthers = raw.metas.filter((m) => !names.includes(m.Agenda));
    expect(goalsOfOthers).toHaveLength(24);
    await page.goto(BOARD(2));
    await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
    const options = await listedDocuments(page, "Documento de política");
    expect(options.map((o) => o.text).sort()).toEqual([...names].sort());
    expect(options.filter((o) => o.disabled)).toEqual([]);
    await expect(page.getByText(`Ver las ${raw.metas.length} metas`, { exact: false })).toBeVisible();
    // A document filter does not change the number of goals offered.
    await page.goto(`${BOARD(2)}?doc=${encodeURIComponent(names[0])}`);
    await expect(page.getByText(`Ver las ${raw.metas.length} metas`, { exact: false })).toBeVisible({ timeout: 120000 });
  });

  test("Board 3 lists the 8 documents with axes; the filter acts on products through the agenda mask, not on goals; the 54 goals of the other 4 stay", async ({ page }) => {
    const raw = await bundle(3);
    expect(raw.agendas).toHaveLength(8);
    expect(raw.agendas_all).toHaveLength(12);
    const dataset = createFoundationsDataset(raw);
    for (const name of raw.agendas) {
      const index = raw.agendas_all.indexOf(name);
      expect(computeFoundations(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, policyIndex: index }).status.products, name).toBeGreaterThan(0);
    }
    // The 4 documents without axes do not mark any product.
    for (const name of raw.agendas_all.filter((n) => !raw.agendas.includes(n))) {
      const index = raw.agendas_all.indexOf(name);
      expect(computeFoundations(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, policyIndex: index }).status.products, `${name} has no axes`).toBe(0);
    }
    expect(raw.metas.filter((m) => !raw.agendas.includes(m.agenda))).toHaveLength(54);
    await page.goto(BOARD(3));
    await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
    const options = await listedDocuments(page, "Documento de política");
    expect(options.map((o) => o.text).sort()).toEqual([...raw.agendas].sort());
    expect(options.filter((o) => o.disabled)).toEqual([]);
    // The count of the page for one document is the one of the bundle.
    const name = raw.agendas[0];
    const index = raw.agendas_all.indexOf(name);
    const expected = computeFoundations(dataset, { ...DEFAULT_FOUNDATIONS_FILTERS, policyIndex: index }).status.products;
    await page.goto(`${BOARD(3)}?doc=${index}`);
    await expect(page.getByText(`${expected.toLocaleString("es-CO")} productos`, { exact: false }).first()).toBeVisible({ timeout: 120000 });
  });
});
