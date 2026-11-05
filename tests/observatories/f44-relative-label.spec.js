/*
 * F44 (D-136): the visible label «capacidad baja» becomes «capacidad relativa baja», with its definition in
 * the tooltip and in the row of the table of rules. The internal key and the key of the URL do not change.
 * The first block needs no server; the second reads the real quyca and the dev server of Luis (D-100) and
 * only runs with E2E_LIVE=1.
 */
import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

import { CATEGORY, CATEGORY_LABELS, CATEGORY_SLUGS } from "../../lib/observatories/capacity";
import { HELP_TEXT_REAL, RULES_TABLE, RULE_LINE, lowCapacityDefinition } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const DEFINITION_COLOMBIA =
  "Citas de la UdeA en 2021–2025 iguales o menores al 50 % de las del referente (la institución con más citas del país en ese tópico) y producción sin crecimiento, con 5 o más productos.";

test.describe("label and definition (no server)", () => {
  test("the label is «capacidad relativa baja»; the key and the key of the URL do not change", () => {
    expect(CATEGORY_LABELS[CATEGORY.LOW_CAPACITY]).toBe("capacidad relativa baja");
    expect(CATEGORY.LOW_CAPACITY).toBe("lowCapacity");
    expect(CATEGORY_SLUGS[CATEGORY.LOW_CAPACITY]).toBe("capacidad-baja");
    expect(RULES_TABLE.find((r) => r.key === "lowCapacity").category).toBe("Capacidad relativa baja");
    expect(RULE_LINE.lowCapacity).toContain("Capacidad relativa baja");
  });

  test("the definition says «del país» with Colombia as referent and «del mundo» with the world", () => {
    expect(lowCapacityDefinition()).toBe(DEFINITION_COLOMBIA);
    expect(lowCapacityDefinition("national")).toBe(DEFINITION_COLOMBIA);
    expect(lowCapacityDefinition("global")).toBe(DEFINITION_COLOMBIA.replace("del país", "del mundo"));
  });

  test("the help text says that the referent is the institution with the most citations of the chosen scope in 2021–2025, and keeps no «10 con más citas» caveat", () => {
    const text = HELP_TEXT_REAL.join(" ");
    expect(text).toContain("la institución con más citas del ámbito elegido (Colombia o el mundo) en 2021–2025");
    expect(text).toContain("capacidad relativa baja");
    expect(text).not.toMatch(/10 (instituciones|con más citas)|diez/i);
  });

  test("«capacidad baja» is not left as visible text in the code or in the tests of the observatories", () => {
    const roots = ["app/observatories", "lib/observatories", "tests/observatories"].map((r) => path.join(__dirname, "..", "..", r));
    const offenders = [];
    const walk = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) return walk(p);
        if (!p.endsWith(".js") || p.endsWith("f44-relative-label.spec.js")) return;
        if (/capacidad baja/i.test(fs.readFileSync(p, "utf8"))) offenders.push(path.relative(path.join(__dirname, "..", ".."), p));
      });
    roots.forEach(walk);
    expect(offenders).toEqual([]);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const PAGE = (query = "") => `/observatories/vri-udea/board-1${query ? `?${query}` : ""}`;

async function open(page, width, query) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(PAGE(query));
  await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
}

test.describe("label and definition in the page (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const width of [1280, 768]) {
    test(`at ${width}px the longest button keeps the legend in two lines and nothing is cut`, async ({ page }) => {
      await open(page, width);
      const button = page.locator('button[data-category="lowCapacity"]');
      await expect(button).toContainText("capacidad relativa baja");
      const report = await page.getByTestId("category-legend").evaluate((box) => {
        const outer = box.getBoundingClientRect();
        return {
          height: Math.round(outer.height),
          clipped: box.scrollHeight > box.clientHeight + 1,
          cut: [...box.querySelectorAll("button, [data-informative]")].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.innerText),
        };
      });
      expect(report.height).toBe(61);
      expect(report.clipped).toBe(false);
      expect(report.cut).toEqual([]);
    });
  }

  test("the label is complete in the table of rules and the visible text of the board has no «capacidad baja»", async ({ page }) => {
    await open(page, 1280);
    const table = page.getByLabel("Reglas de clasificación");
    await expect(table.getByText("Capacidad relativa baja")).toBeVisible();
    const cut = await table.evaluate((t) => [...t.querySelectorAll("th, td")].filter((c) => c.scrollWidth > c.clientWidth + 1).map((c) => c.innerText));
    expect(cut).toEqual([]);
    const visible = await page.locator("main").innerText();
    expect(visible).not.toMatch(/capacidad baja/i);
    expect(visible).toContain("capacidad relativa baja");
    // the label of the bar of the panel 2 is in the text summary of the chart
    await expect(page.getByTestId("calculator-bars")).toHaveAttribute("aria-label", /capacidad relativa baja: [\d.]+/);
  });

  test("the definition is in the tooltip of the legend and in the row of the table; with the world as referent it says «del mundo»", async ({ page }) => {
    await open(page, 1280);
    await page.locator('button[data-category="lowCapacity"]').hover();
    await expect(page.getByText(DEFINITION_COLOMBIA)).toBeVisible({ timeout: 5000 });
    await page.mouse.move(5, 5);
    await page.getByLabel("Reglas de clasificación").getByText("Capacidad relativa baja").hover();
    await expect(page.getByText(DEFINITION_COLOMBIA).last()).toBeVisible({ timeout: 5000 });

    await open(page, 1280, "basis=global");
    await page.locator('button[data-category="lowCapacity"]').hover();
    await expect(page.getByText(DEFINITION_COLOMBIA.replace("del país", "del mundo"))).toBeVisible({ timeout: 5000 });
  });

  test("the URL key does not change: isolating the category writes ?cat=capacidad-baja", async ({ page }) => {
    await open(page, 1280);
    await page.locator('button[data-category="lowCapacity"]').click();
    await expect(page).toHaveURL(/cat=capacidad-baja/);
  });
});
