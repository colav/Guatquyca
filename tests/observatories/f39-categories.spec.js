/*
 * F39: shape and colour per category, own legend that isolates a category in the scatter, click on
 * the bars of the calculator and table of rules without cuts. The first block needs no server; the
 * second uses the dev server of Luis (D-100): with the local test data (?source=mock) and, with
 * E2E_LIVE=1, with the real quyca.
 */
import { test, expect } from "@playwright/test";

import { CATEGORY_PALETTE } from "../../lib/constants";
import {
  CATEGORY_COLORS,
  CATEGORY_ORDER,
  CATEGORY_SLUGS,
  calculatorBarsConfig,
  CATEGORY_PARAM,
  parseCategories,
  serializeCategories,
  toggleCategory,
} from "../../lib/observatories/capacity";
import { CATEGORY_MARKS, darken } from "../../lib/observatories/palette";
import { shapePath } from "../../lib/observatories/shapes";
import { sizeFor } from "../../lib/observatories/scatterSize";

test.describe("marks and selection of categories (no server)", () => {
  test("the eight categories have a different shape and a different colour, and the colour is the one of their bar", () => {
    const marks = CATEGORY_ORDER.map((c) => CATEGORY_MARKS[c]);
    expect(new Set(marks.map((m) => m.shape)).size).toBe(8);
    expect(new Set(marks.map((m) => m.color)).size).toBe(8);
    for (const c of CATEGORY_ORDER) {
      expect(CATEGORY_MARKS[c].color).toBe(CATEGORY_COLORS[c]);
      expect(CATEGORY_MARKS[c].color).toBe(CATEGORY_PALETTE[c]);
    }
    expect(CATEGORY_ORDER.map((c) => CATEGORY_MARKS[c].shape)).toEqual(["star", "square", "hexagon", "triangle", "triangleDown", "point", "x", "diamond"]);
  });

  test("every shape has an outline, the border is a darker tone and the size grows with the FWCI", () => {
    for (const m of Object.values(CATEGORY_MARKS)) expect(shapePath(m.shape, 6).length).toBeGreaterThan(10);
    expect(darken("#ffffff", 0.3)).toBe("#b3b3b3");
    expect(sizeFor(0)).toBeGreaterThanOrEqual(5);
    expect(sizeFor(0.5)).toBeLessThan(sizeFor(2));
    expect(sizeFor(2)).toBeLessThan(sizeFor(8));
    expect(sizeFor(50)).toBe(sizeFor(8));
  });

  test("a click isolates, another click changes, the active one shows all, Ctrl adds", () => {
    expect(toggleCategory([], "leader")).toEqual(["leader"]);
    expect(toggleCategory(["leader"], "emerging")).toEqual(["emerging"]);
    expect(toggleCategory(["leader"], "leader")).toEqual([]);
    expect(toggleCategory(["leader"], "emerging", true)).toEqual(["leader", "emerging"]);
    expect(toggleCategory(["leader", "emerging"], "leader", true)).toEqual(["emerging"]);
  });

  test("the selection goes in the URL as ?cat= and unknown values are ignored", () => {
    expect(CATEGORY_PARAM).toBe("cat");
    expect(serializeCategories(["leader", "emerging"])).toBe("lider,emergente");
    expect(parseCategories("lider,emergente,nada")).toEqual(["leader", "emerging"]);
    expect(parseCategories(null)).toEqual([]);
    expect(Object.keys(CATEGORY_SLUGS).length).toBeGreaterThanOrEqual(7);
  });

  test("the bars of the categories that are not isolated are dimmed; without a selection none is", () => {
    const items = CATEGORY_ORDER.map((c, i) => ({ category: c, label: c, value: i, color: "#000", pctText: "", rule: "" }));
    const config = calculatorBarsConfig(items, "tópicos", ["leader"]);
    expect(config.style.fillOpacity({ category: "leader" })).toBe(1);
    expect(config.style.fillOpacity({ category: "emerging" })).toBeLessThan(1);
    expect(calculatorBarsConfig(items, "tópicos").style.fillOpacity({ category: "emerging" })).toBe(1);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const PAGE = (query = "") => `/observatories/vri-udea/board-1?${[LIVE ? "" : "source=mock", query].filter(Boolean).join("&")}`;
const WIDTHS = [1280, 768];

/* F100 (D-223): the note of the header of the panel 1 moved into its information window. */
const noteText = async (page) => {
  await page.getByTestId("chart-card").first().getByTestId("panel-info").click();
  const text = (await page.getByTestId("panel-info-note").last().innerText()).replace(/^Nota del panel\s*/, "");
  await page.keyboard.press("Escape");
  return text;
};
const legendCounts = (page) =>
  page.getByTestId("category-legend").locator("[data-category]").evaluateAll((nodes) => Object.fromEntries(nodes.map((n) => [n.dataset.category, +n.dataset.count])));
const shownPoints = async (page) => +(((await noteText(page)).match(/^([\d.]+) puntos/) || [])[1] || "0").replace(/\./g, "");

async function open(page, width, query) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(PAGE(query));
  await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
}

test.describe(`legend, isolation and rules (${LIVE ? "real quyca" : "local test data"})`, () => {
  for (const width of WIDTHS) {
    test(`at ${width}px the legend is not cut and has a fixed height`, async ({ page }) => {
      await open(page, width);
      const legend = page.getByTestId("category-legend");
      const report = await legend.evaluate((box) => {
        const outer = box.getBoundingClientRect();
        return {
          height: Math.round(outer.height),
          clipped: box.scrollHeight > box.clientHeight + 1,
          entries: [...box.querySelectorAll("button, [data-informative]")].map((b) => {
            const r = b.getBoundingClientRect();
            return { cutX: b.scrollWidth > b.clientWidth + 1, inside: r.left >= outer.left - 1 && r.right <= outer.right + 1 && r.top >= outer.top - 1 && r.bottom <= outer.bottom + 1, text: b.innerText };
          }),
        };
      });
      expect(report.clipped, JSON.stringify(report)).toBe(false);
      expect(report.height).toBe(61);
      for (const entry of report.entries) {
        expect(entry.cutX, entry.text).toBe(false);
        expect(entry.inside, entry.text).toBe(true);
      }
      expect(report.entries.length).toBe(LIVE ? 8 : 7); // the buttons and the informative «sin producción» (the test data have the old seven categories)
      await expect(page.getByText("Tamaño = FWCI").first()).toBeVisible();
    });

    test(`at ${width}px the rules table is not cut, the caption is on the left and the headers are short`, async ({ page }) => {
      // The rules of the old model (test data) are long texts of the artifact: only the real table is checked.
      test.skip(!LIVE, "Set E2E_LIVE=1: the table of the old model is not part of F39.");
      await open(page, width);
      const table = page.getByLabel("Reglas de clasificación");
      const cut = await table.evaluate((t) => [...t.querySelectorAll("th, td")].filter((c) => c.scrollWidth > c.clientWidth + 1).map((c) => c.innerText));
      expect(cut, `cut cells: ${cut}`).toEqual([]);
      const heads = await table.locator("th").allInnerTexts();
      expect(heads.map((h) => h.trim())).toEqual(["Categoría", "Razón", "Tendencia"]);
      await expect(table.locator("th span[title='Razón de capacidad']")).toHaveCount(1);
      expect(await table.locator("svg").count()).toBe(8); // the shape of every category in the first column
    });
  }

  test("without a selection all the points are drawn and no button is off; a click isolates, another changes; the active one and Ver todas show all; Ctrl adds; the rest of the board does not change", async ({ page }) => {
    test.skip(!LIVE, "Set E2E_LIVE=1: these checks are about the snapshot of the real model; the test data (old model) draw the units without production.");
    await open(page, 1280);
    const counts = await legendCounts(page);
    const drawable = Object.keys(counts).filter((c) => c !== "none");
    const total = drawable.reduce((a, c) => a + counts[c], 0);
    const button = (category) => page.locator(`button[data-category="${category}"]`);
    for (const c of drawable) await expect(button(c)).toHaveAttribute("aria-pressed", "false");
    expect(await shownPoints(page)).toBe(total);
    const kpiBefore = await page.locator(".obs-kpi").allInnerTexts();
    const panelBefore = await page.getByTestId("chart-card").nth(2).innerText();

    await button("leader").click();
    await expect(button("leader")).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/cat=lider/);
    expect(await shownPoints(page)).toBe(counts.leader);
    await expect.poll(() => noteText(page)).toContain("solo líder");
    expect((await legendCounts(page)).emerging).toBe(counts.emerging); // the numbers do not change
    expect(await page.locator(".obs-kpi").allInnerTexts()).toEqual(kpiBefore);
    expect(await page.getByTestId("chart-card").nth(2).innerText()).toBe(panelBefore);

    await button("emerging").click();
    await expect(button("leader")).toHaveAttribute("aria-pressed", "false");
    expect(await shownPoints(page)).toBe(counts.emerging);
    await expect(page).toHaveURL(/cat=emergente/);

    await button("emerging").click(); // the active one: all again
    expect(await shownPoints(page)).toBe(total);
    await expect(page).not.toHaveURL(/cat=/);

    await button("leader").click();
    await button("atRisk").click({ modifiers: ["Control"] });
    expect(await shownPoints(page)).toBe(counts.leader + counts.atRisk);
    await expect(page).toHaveURL(/cat=lider(%2C|,)riesgo/);
    await expect.poll(() => noteText(page)).toContain("solo líder y riesgo de desaparecer");
    await page.getByRole("button", { name: "Ver todas" }).click();
    expect(await shownPoints(page)).toBe(total);
    for (const c of drawable) await expect(button(c)).toHaveAttribute("aria-pressed", "false");
  });

  test("«sin producción» is informative: it does not respond to the click and has no selected state; its number is the one of the panel 2", async ({ page }) => {
    await open(page, 1280);
    const none = page.locator('[data-category="none"]');
    await expect(none).toHaveAttribute("data-informative", "true");
    await expect(none).not.toHaveAttribute("aria-pressed", /.*/);
    const before = await shownPoints(page);
    await none.click();
    await none.click({ modifiers: ["Control"] });
    await page.waitForTimeout(500);
    expect(await shownPoints(page)).toBe(before);
    await expect(page).not.toHaveURL(/cat=/);
    expect(await page.locator("button[data-category='none']").count()).toBe(0);
  });

  test("the years filter does not move the legend or the points; ?cat= is read and the old ?ocultas= is ignored", async ({ page }) => {
    test.setTimeout(120000);
    test.skip(!LIVE, "Set E2E_LIVE=1: these checks are about the snapshot of the real model; the test data (old model) draw the units without production.");
    await open(page, 1280);
    const base = await legendCounts(page);
    const basePoints = await shownPoints(page);
    await open(page, 1280, "from=2012&to=2014");
    expect(await legendCounts(page)).toEqual(base);
    expect(await shownPoints(page)).toBe(basePoints);
    await open(page, 1280, "ocultas=lider,consolidado");
    for (const c of ["leader", "consolidated"]) await expect(page.locator(`button[data-category="${c}"]`)).toHaveAttribute("aria-pressed", "false");
    expect(await shownPoints(page)).toBe(basePoints);
    await open(page, 1280, "cat=lider,consolidado");
    for (const c of ["leader", "consolidated"]) await expect(page.locator(`button[data-category="${c}"]`)).toHaveAttribute("aria-pressed", "true");
    expect(await shownPoints(page)).toBe(base.leader + base.consolidated);
  });

  test("the legend is operable with the keyboard", async ({ page }) => {
    await open(page, 1280);
    const counts = await legendCounts(page);
    const emerging = page.locator('button[data-category="emerging"]');
    await emerging.focus();
    await page.keyboard.press("Enter");
    await expect(emerging).toHaveAttribute("aria-pressed", "true");
    expect(await shownPoints(page)).toBe(counts.emerging);
    await emerging.focus(); /* reading the points opened and closed the window (i), which took the focus */
    await page.keyboard.press("Space");
    await expect(emerging).toHaveAttribute("aria-pressed", "false");
  });

  test("a click on a bar of the calculator isolates the same category as the legend; the bar of «sin producción» does not answer", async ({ page }) => {
    test.skip(!LIVE, "Set E2E_LIVE=1: the bars of the old model (test data) are tiny.");
    await open(page, 1280);
    const counts = await legendCounts(page);
    const drawable = Object.keys(counts).filter((c) => c !== "none");
    const total = drawable.reduce((a, c) => a + counts[c], 0);
    await page.getByTestId("calculator-bars").scrollIntoViewIfNeeded();
    const box = await page.getByTestId("calculator-bars").boundingBox();
    expect(box).not.toBeNull();
    let hit = "";
    // The bars of the drawable categories come first; the last bar is «sin producción» and must not answer.
    for (let y = box.y + 14; y < box.y + box.height - 90 && !hit; y += 10) {
      await page.mouse.click(box.x + 225, y);
      await page.waitForTimeout(150);
      hit = new URL(page.url()).searchParams.get("cat") || "";
    }
    expect(hit, "a bar must answer to the click").not.toBe("");
    const category = Object.keys(counts).find((c) => hit.split(",").includes(CATEGORY_SLUGS[c]));
    expect(category).toBeTruthy();
    expect(category).not.toBe("none");
    expect(await shownPoints(page)).toBe(counts[category]);
    await expect(page.locator(`button[data-category="${category}"]`)).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("calculator-bars")).toHaveCSS("cursor", "pointer");
    await page.locator(`button[data-category="${category}"]`).click();
    expect(await shownPoints(page)).toBe(total);
    // The last bar («sin producción», the widest) never changes the URL.
    await page.mouse.click(box.x + 225, box.y + box.height - 75);
    await page.waitForTimeout(300);
    await expect(page).not.toHaveURL(/cat=/);
  });

  for (const dimension of ["subfield", "field"]) {
    test(`with the dimension ${dimension} the legend counts what the dimension shows`, async ({ page }) => {
      test.skip(!LIVE, "Set E2E_LIVE=1: these checks are about the snapshot of the real model; the test data (old model) draw the units without production.");
      await open(page, 1280, `dimension=${dimension}`);
      const counts = await legendCounts(page);
      const { none, ...drawable } = counts;
      expect(await shownPoints(page)).toBe(Object.values(drawable).reduce((a, n) => a + n, 0));
      expect(Object.keys(counts).length).toBe(8);
    });
  }
});

test.describe("tooltip of the scatter: referent of the topic (real quyca)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the tooltip data of a topic: snapshot figures, the referent and a ratio between 0 and 1", async () => {
    const { computeCapacity, createDataset } = await import("../../lib/observatories/capacity");
    const raw = await (await fetch(`${process.env.E2E_API_URL || "http://localhost:8080"}/observatories/vri-udea/boards/1/bundle`)).json();
    const result = computeCapacity(createDataset(raw));
    const unit = result.units.find((u) => u.label === "Particle physics theoretical and experimental studies");
    expect(unit, "topic found").toBeTruthy();
    expect(unit.referent.length).toBeGreaterThan(0);
    expect(unit.ratio).toBeGreaterThan(0);
    expect(unit.ratio).toBeLessThanOrEqual(1);
    expect(unit.leaderCitations).toBeGreaterThan(0);
    // Products and citations of the tooltip are the ones of 2021–2025: the yearly counts add up to the products.
    expect(unit.yearCounts.reduce((a, b) => a + b, 0)).toBe(unit.products);
    // At subfield level the referent is shown only when it is the same one for all the topics.
    const sub = computeCapacity(createDataset(raw), { dimension: "subfield" });
    for (const u of sub.units) expect(typeof u.referent).toBe("string");
  });
});
