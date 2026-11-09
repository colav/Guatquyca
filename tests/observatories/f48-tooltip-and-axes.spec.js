/*
 * F48 (D-142): (1) the tooltip of the point is as wide as its longest line (the ratio line is not broken at
 * 1280 px or more) and does not leave the window; (2) in the list «Ejes Temáticos asociados» only the final
 * number of each line is bold; (3) the detail of a topic says its trend («creciente», «estable» or
 * «decreciente»), as the tooltip does, and no longer «tendencia ;». The first block needs no server; the
 * second reads the real quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1. No
 * screenshots are saved (D-139 8).
 */
import { test, expect } from "@playwright/test";

import { WIDE_TOOLTIP, tooltipInteraction } from "../../lib/observatories/tooltipStyle";
import { TREND_LABELS } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

test.describe("width of the tooltip (no server)", () => {
  test("the maximum is the width of the longest line (1.000 px) or of the window, in the content", () => {
    expect(WIDE_TOOLTIP.min).toBe(460);
    expect(WIDE_TOOLTIP.max).toBe("min(1000px, calc(100vw - 56px))");
    expect(tooltipInteraction(WIDE_TOOLTIP).tooltip.css[".g2-tooltip"]["max-width"]).toBe(WIDE_TOOLTIP.max);
    expect(tooltipInteraction({ min: 100, max: 300 }).tooltip.css[".g2-tooltip"]["max-width"]).toBe("300px"); // a number still means pixels
  });

  test("the three trends have a label for the detail", () => {
    for (const trend of ["increasing", "stable", "decreasing"]) expect(TREND_LABELS[trend]).toMatch(/^(creciente|estable|decreciente)$/);
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

/**
 * Hovers the scatter until a tooltip shows and returns its text and where it is; the mouse stays on the point. F104: the points of some
 * categories (e.g. «emergente») are small, so when the grid asked for finds nothing it tries once a denser one (70 x 40) before giving up.
 */
async function findPoint(page, { name = "", columns = 16, rows = 10, dense = false } = {}) {
  const card = page.getByTestId("chart-card").first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.locator("canvas").first().boundingBox();
  for (let gy = 1; gy <= rows; gy++) {
    for (let gx = 1; gx <= columns; gx++) {
      const x = box.x + (box.width * gx) / (columns + 1);
      const y = box.y + (box.height * gy) / (rows + 1);
      await page.mouse.move(x, y);
      await page.waitForTimeout(60);
      const tip = page.locator(".g2-tooltip:visible").first();
      if (await tip.count()) {
        const text = (await tip.innerText().catch(() => "")) || "";
        if (/Categoría/.test(text) && (!name || text.includes(name))) return { text, x, y };
      }
    }
  }
  return dense ? null : findPoint(page, { name, columns: 70, rows: 40, dense: true });
}

test.describe("tooltip, bold number and trend against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const [query, label] of [["", "topic Colombia"], ["dimension=subfield&basis=global", "subfield Mundo"], ["dimension=subfield", "subfield Colombia"]]) {
    test(`at 1280 px the ratio line of the tooltip (${label}) is not broken and the tooltip stays inside the window`, async ({ page }) => {
      test.setTimeout(120000);
      await open(page, 1280, query);
      const card = page.getByTestId("chart-card").first();
      await card.scrollIntoViewIfNeeded();
      const box = await card.locator("canvas").first().boundingBox();
      let seen = 0;
      const problems = [];
      for (let gy = 1; gy <= 5; gy++) {
        for (let gx = 1; gx <= 8; gx++) {
          await page.mouse.move(box.x + (box.width * gx) / 9, box.y + (box.height * gy) / 6);
          await page.waitForTimeout(300);
          const report = await page.evaluate(() => {
            const tip = [...document.querySelectorAll(".g2-tooltip")].find((el) => getComputedStyle(el).visibility !== "hidden" && /Razón de capacidad/.test(el.innerText));
            if (!tip) return null;
            const item = [...tip.querySelectorAll(".g2-tooltip-list-item")].find((li) => /Razón de capacidad/.test(li.innerText));
            const r = tip.getBoundingClientRect();
            return { lineHeight: Math.round(item.getBoundingClientRect().height), left: Math.round(r.left), right: Math.round(r.right), vw: innerWidth, width: Math.round(r.width), text: item.innerText.replace(/\s+/g, " ").slice(0, 160) };
          });
          if (!report) continue;
          seen++;
          // one line is about 19 px; the line that does not fit the 1.000 px of the maximum would be the only one allowed to break
          if (report.lineHeight > 30 && report.width < 1000) problems.push(`broken at ${report.width} px: ${report.text}`);
          if (report.left < -1 || report.right > report.vw + 1) problems.push(`outside ${report.left}-${report.right}`);
        }
      }
      expect(seen, "tooltips with the ratio line").toBeGreaterThan(0);
      expect(problems.slice(0, 3), JSON.stringify(problems.slice(0, 3))).toEqual([]);
    });
  }

  test("only the final number of each line of the list of linked axes is bold, not the document", async ({ page }) => {
    test.setTimeout(120000);
    await open(page, 1280, "cat=lider,consolidado");
    const card = page.getByTestId("chart-card").first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.locator("canvas").first().boundingBox();
    let rows = [];
    // Click the points until one has linked axes (some topics have none).
    for (let gy = 1; gy <= 14 && !rows.length; gy++) {
      for (let gx = 1; gx <= 24 && !rows.length; gx++) {
        const x = box.x + (box.width * gx) / 25;
        const y = box.y + (box.height * gy) / 15;
        await page.mouse.move(x, y);
        await page.waitForTimeout(60);
        if (!(await page.locator(".g2-tooltip:visible").count())) continue;
        await page.mouse.click(x, y);
        await page.waitForTimeout(250);
        rows = await page.getByText("Ejes Temáticos asociados según nuestra metodología").locator("xpath=..").locator("ul li").evaluateAll((items) =>
          items.map((li) => ({ text: li.innerText.replace(/\s+/g, " ").trim(), bold: [...li.querySelectorAll("b, strong")].map((b) => b.innerText.trim()) })).filter((r) => /·/.test(r.text)),
        );
      }
    }
    expect(rows.length, "a topic with linked axes").toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.bold, row.text).toHaveLength(1);
      expect(row.text.endsWith(row.bold[0]), row.text).toBe(true); // the final number
      expect(row.bold[0]).toMatch(/^[\d.]+$/);
    }
  });

  test("the detail of a topic says its trend, as the tooltip does, for one point of each category that is drawn", async ({ page }) => {
    test.setTimeout(560000); // F104: the dense second pass of findPoint (small points) makes a slow category take minutes
    const slugs = { leader: "lider", consolidated: "consolidado", consolidating: "en-consolidacion", emerging: "emergente", atRisk: "riesgo", lowCapacity: "capacidad-baja", punctual: "presencia-puntual" };
    for (const [category, slug] of Object.entries(slugs)) {
      await open(page, 1280, `cat=${slug}`);
      const point = await findPoint(page, { columns: 36, rows: 20 }); // some categories have few points
      expect(point, `a point of ${category}`).not.toBeNull();
      const tooltipTrend = (point.text.split("\n").map((s) => s.trim()).filter(Boolean)).find((_, i, lines) => lines[i - 1] === "Tendencia");
      await page.mouse.click(point.x, point.y);
      const detail = page.getByText(/ · categoría /).first();
      await expect(detail).toBeVisible({ timeout: 10000 });
      const text = (await detail.innerText()).replace(/\s+/g, " ");
      expect(text, category).not.toContain("tendencia ;");
      expect(text, category).toMatch(/tendencia (creciente|estable|decreciente)/);
      // the same trend as the tooltip of that point
      expect(tooltipTrend, category).toMatch(/^(creciente|estable|decreciente)/);
      expect(text, category).toContain(`tendencia ${tooltipTrend.split(" ")[0]}`);
    }
  });

  test("the topic «Conflict, Peace, and Violence in Colombia» shows its trend in the detail", async ({ page }) => {
    test.setTimeout(150000);
    await open(page, 1280, "cat=capacidad-baja");
    const point = await findPoint(page, { name: "Conflict, Peace, and Violence in Colombia", columns: 40, rows: 24 });
    test.skip(!point, "The point of that topic is too small to find by hovering; the check by category above covers the defect.");
    const tooltipTrend = point.text.split("\n").map((s) => s.trim()).filter(Boolean).find((_, i, lines) => lines[i - 1] === "Tendencia");
    await page.mouse.click(point.x, point.y);
    const text = ((await page.getByText(/ · categoría /).first().innerText()) || "").replace(/\s+/g, " ");
    expect(text).toContain("categoría capacidad relativa baja");
    expect(text).not.toContain("tendencia ;");
    expect(text).toContain(`tendencia ${tooltipTrend.split(" ")[0]}`);
  });
});
