/*
 * F37: figures of the final bundles (B105 to B110) and texts of Board 1. It reads the real quyca and the dev
 * server of Luis (D-100) and only runs with E2E_LIVE=1. The soft expectations list every difference instead of
 * stopping at the first one.
 */
import { test, expect } from "@playwright/test";

import { createDataset } from "../../lib/observatories/capacity";
import { createCollaborationDataset } from "../../lib/observatories/collaboration";
import { createFoundationsDataset } from "../../lib/observatories/foundations";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n) => `/observatories/vri-udea/board-${n}`;
const get = async (n) => (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();

test.describe("figures of the final bundles (real quyca, read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test.describe.configure({ mode: "serial" });

  let b1;
  let b2;
  let b3;
  test.beforeAll(async () => {
    b1 = await get(1);
    b2 = await get(2);
    b3 = await get(3);
  });

  test("lists of units, subunits and centres", () => {
    for (const [name, raw] of [["T1", b1], ["T2", b2], ["T3", b3]]) expect.soft(raw.facs, `${name} units`).toHaveLength(24);
    expect.soft(b1.deps, "T1 subunits").toHaveLength(118);
    expect.soft(b2.deps, "T2 subunits").toHaveLength(121);
    expect.soft(b3.deps, "T3 subunits").toHaveLength(121);
    for (const [name, raw] of [["T1", b1], ["T2", b2], ["T3", b3]]) {
      const same = raw.deps.filter((d) => d.startsWith("Departamento de Formación Académica"));
      expect.soft(same, `${name} Departamento de Formación Académica`).toHaveLength(5);
      expect.soft(same.every((d) => /\(.+\)$/.test(d)), `${name} each with its unit in parentheses`).toBe(true);
      expect.soft(new Set(raw.deps).size, `${name} subunits without repeated names`).toBe(raw.deps.length);
    }
    expect.soft(b1.cens, "T1 centres").toHaveLength(25);
    expect.soft(b2.centros, "T2 centres").toHaveLength(25);
    expect.soft(b3.centros.filter((c) => c !== "Sin centro"), "T3 centres").toHaveLength(25);
    for (const centres of [b1.cens, b2.centros, b3.centros]) expect.soft(centres.filter((c) => c.includes("Académica")).length).toBe(2);
  });

  test("coverage of the centre filter and totals", () => {
    expect.soft(createDataset(b1).centerCoverage).toEqual({ withCenter: 27139, total: 49315 });
    expect.soft(createCollaborationDataset(b2).centerCoverage).toEqual({ withCenter: 27822, total: 50581 });
    const c3 = createFoundationsDataset(b3).centerCoverage;
    expect.soft(c3.total).toBe(82589); // rows of P of the real bundle (the 95.471 of an older figure does not match it: D-225, F102)
    console.log(`[live] T3 coverage ${c3.withCenter} of ${c3.total}`);
    expect.soft(b3.P).toHaveLength(82589);
  });

  test("T3 (figures of the bundle of the night, F103: 1.130 without year, no ondas): products without year, type ondas, sector government and health; the row of the Municipality of Medellín in T2 and T3", () => {
    expect.soft(b3.P.filter((p) => p[0] === null || p[0] === 0)).toHaveLength(1130);
    expect.soft(b3.P.filter((p) => p[1] === b3.tipos.indexOf("ondas"))).toHaveLength(0);
    expect.soft(b3.P.filter((p) => p[8] & 2)).toHaveLength(1350); // government
    expect.soft(b3.P.filter((p) => p[8] & 8)).toHaveLength(5428); // health
    const i2 = b2.insts.findIndex((x) => x.n === "Municipality of Medellín");
    expect.soft(b2.works.filter((w) => Array.isArray(w[9]) && w[9].includes(i2))).toHaveLength(14);
    const i3 = b3.inst.findIndex((x) => x[0] === "Municipality of Medellín");
    expect.soft(b3.P.filter((p) => Array.isArray(p[14]) && p[14].includes(i3))).toHaveLength(14);
    expect.soft(b3.inst[i3][2]).toBe("gobierno");
  });

  test("no institution without a name or with an id «derivada_…» in T2 and T3, and the card of the call 894", () => {
    expect.soft(JSON.stringify(b2.insts).includes("derivada_")).toBe(false);
    expect.soft(JSON.stringify(b3.inst).includes("derivada_")).toBe(false);
    expect.soft(b2.insts.filter((x) => !x.n)).toHaveLength(0);
    expect.soft(b3.inst.filter((x, i) => i > 0 && !x[0])).toHaveLength(0);
    expect.soft(b3.talent.inv_sheet.personas).toBe(2638);
  });

  for (const n of [1, 2, 3]) {
    test(`Board ${n}: the page shows no «undefined», «NaN» or «derivada_» and no tooltip text with them`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(BOARD(n));
      await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(2500);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/undefined|\bNaN\b|derivada_/);
      if (n === 3) expect(text).toContain("2.638");
    });
  }

  test("Board 1: the help text says that each category has its shape and its colour, and no longer the colours of F39", async ({ page }) => {
    await page.goto(BOARD(1));
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.getByText("¿Cómo usar este tablero?").click();
    await expect(page.getByText("Cada categoría tiene su forma y su color (véase la leyenda).", { exact: false })).toBeVisible();
    const main = await page.locator("main").innerText();
    expect(main).not.toMatch(/naranja = consolidado o líder|azul = en consolidación|blanco = el resto/);
  });
});
