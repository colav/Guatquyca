/*
 * F106 (D-234) point 2: the panel 1 of the Board 3 answers to the filters. Without a filter it is the staff table of the Universidad; with
 * one it counts the staff authors of the products of the selection (the unit and the subunit also keep the people whose main unit or subunit
 * is the chosen one). The first block needs no server; the second (E2E_LIVE=1) goes filter by filter with the real bundle and in the page.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FOUNDATIONS_FILTERS, computeFoundations, createFoundationsDataset } from "../../lib/observatories/foundations";
import { PANEL_HELP } from "../../app/observatories/vri-udea/board-3/components/panelHelp";
import { talentSelectionNote } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("F106 panel 1 of the T3 (no server)", () => {
  test("the help says that the panel answers to the filters and no text says that it does not", () => {
    const text = Object.values(PANEL_HELP.p1).flat().join(" ");
    expect(text).not.toMatch(/no responde a los filtros/);
    expect(PANEL_HELP.p1.care).toMatch(/con filtros/);
    expect(talentSelectionNote("level", "10", "1,0 %", "2.621")).not.toMatch(/no responde/);
  });
});

test.describe("F106 panel 1 of the T3, filter by filter, against the real bundle (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("each filter changes the staff of the panel 1; without a filter nothing changes; the table of the report", async () => {
    test.setTimeout(200000);
    const res = await fetch(`${API}/observatories/vri-udea/boards/3/bundle`, { headers: { "Accept-Encoding": "gzip" } });
    const raw = await res.json();
    const ds = createFoundationsDataset(raw);
    const base = computeFoundations(ds, DEFAULT_FOUNDATIONS_FILTERS);
    expect(base.talentSelection.active).toBe(false);
    expect(base.talent.staff_total).toBe(2621);
    const perDepartment = {};
    for (const a of raw.A) if (a[0] === 1 && a[7] >= 0) perDepartment[a[7]] = (perDepartment[a[7]] || 0) + 1;
    const biggestDepartment = Number(Object.entries(perDepartment).sort((x, y) => y[1] - x[1])[0][0]);
    const plan = [
      ["centro de investigación", { centerIndex: 5 }],
      ["unidad académica (Facultad de Ingeniería)", { facultyIndex: raw.facs.findIndex((f) => /Ingenier/.test(f)) }],
      ["subunidad académica (la de más profesores)", { departmentIndex: biggestDepartment }],
      ["ámbito", { scopeIndex: 0 }],
      ["documento de política", { policyIndex: 0 }],
      ["años (2022–2024)", { yearFrom: 2022, yearTo: 2024 }],
      ["campo", { fieldIndex: 1 }],
      ["subcampo", { subfieldIndex: 3 }],
    ];
    const rows = [];
    for (const [name, change] of plan) {
      const r = computeFoundations(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, ...change });
      const t = r.talentSelection;
      const sumMc = Object.values(t.byMinciencias).reduce((a, b) => a + b, 0);
      const sumLv = Object.values(t.byLevel).reduce((a, b) => a + b, 0);
      rows.push(`${name}: ${t.active ? "responde" : "NO responde"}; profesores ${t.staff}; productos ${r.status.products}`);
      expect(t.active, name).toBe(true);
      expect(t.staff, name).toBeLessThan(2621);
      expect(sumMc, name).toBe(t.staff);
      expect(sumLv, name).toBe(t.staff);
    }
    console.log(`[live]\n${rows.join("\n")}`);
    const unit = computeFoundations(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, facultyIndex: raw.facs.findIndex((f) => /Ingenier/.test(f)) }).talentSelection;
    const unitProducts = computeFoundations(ds, { ...DEFAULT_FOUNDATIONS_FILTERS, facultyIndex: raw.facs.findIndex((f) => /Ingenier/.test(f)) });
    expect(unit.staff, "the unit keeps only the staff whose main unit it is, not every co-author").toBeLessThan(unitProducts.status.staff);
  });

  test("in the page: with a unit chosen the tiles and the note say the selection, without density; without a filter the tiles are the planta", async ({ page }) => {
    test.setTimeout(150000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const card = page.getByTestId("chart-card").filter({ hasText: /^1 ·|Talento|profesores/ }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(card).toContainText("2.621");
    await expect(card).toContainText("por 100.000 hab.");
    await page.goto("/observatories/vri-udea/board-3?faculty=17");
    await page.getByTestId("chart-card").first().waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const filtered = page.getByTestId("chart-card").first();
    await expect(filtered).toContainText("con productos en la selección");
    await expect(filtered).not.toContainText("por 100.000 hab.");
    await expect(filtered).toContainText(/de la planta vigente/i);
    await expect(filtered).not.toContainText("no responde a los filtros");
  });
});
