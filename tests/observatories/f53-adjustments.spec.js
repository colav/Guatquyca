/*
 * F53 (D-151): same width and centre for every tag of the link column (row of reconciliation included), no note
 * «Los filtros se aplican al instante…», «Restablecer filtros» (dashed, right) in the row of «Filtros (n)», and no
 * word «IA» in the visible text of the three boards. Reads the real quyca and the dev server of Luis (D-100):
 * only with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const BOARD = (n, q = "") => `/observatories/vri-udea/board-${n}${q ? `?${q}` : ""}`;
const AI = /\bIA\b|inteligencia artificial|modelo de lenguaje|panel de IA/;

test.describe("F53 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const width of [1440, 1280]) {
    for (const axis of [67, 98]) {
      test(`all the tags of the link column, the last row included, have the same width and centre (axis ${axis}, ${width} px)`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(BOARD(1, `axis=${axis}`));
        await page.getByTestId("axis-topics-other-link").waitFor({ timeout: 120000 });
        await page.waitForTimeout(800);
        const tags = await page.evaluate(() => [...document.querySelectorAll(".ant-table-tbody .ant-tag, [data-testid='axis-topics-other-link']")].map((t) => { const b = t.getBoundingClientRect(); return [Math.round(b.width * 10) / 10, Math.round((b.x + b.width / 2) * 10) / 10]; }));
        expect(tags.length).toBeGreaterThan(1);
        expect(new Set(tags.map((t) => t[0])).size).toBe(1);
        expect(Math.max(...tags.map((t) => t[1])) - Math.min(...tags.map((t) => t[1]))).toBeLessThan(1);
        const header = await page.locator("th.ant-table-cell", { hasText: "Vínculo con el eje" }).boundingBox();
        expect(Math.abs(tags[0][1] - (header.x + header.width / 2))).toBeLessThan(2);
      });
    }
  }

  for (const n of [1, 2, 3]) {
    test(`Board ${n}: no note of «se aplican al instante», the reset button (dashed) is in the row of «Filtros (n)» open and folded, and heights`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(BOARD(n));
      const box = page.getByTestId("filters");
      await expect(box).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1000);
      expect(await box.innerText()).not.toContain("se aplican al instante");
      const toggle = page.getByTestId("filters-toggle");
      const reset = page.getByTestId("filters-reset");
      await expect(reset).toHaveText(n === 1 ? "Restablecer filtros" : "Limpiar filtros");
      expect(await reset.evaluate((el) => el.className)).toContain("ant-btn-dashed");
      const check = async () => {
        const t = await toggle.boundingBox();
        const r = await reset.boundingBox();
        expect(Math.abs(t.y - r.y)).toBeLessThan(2); // same row
        expect(t.x).toBeLessThan(r.x); // «Filtros (n)» left, reset right
        const b = await box.boundingBox();
        expect(r.x + r.width).toBeGreaterThan(b.x + b.width - 40); // reset at the right end
        return Math.round(b.height);
      };
      const open = await check();
      await toggle.click();
      const folded = await check();
      expect(folded).toBeLessThanOrEqual(48);
      console.log(`[live] Board ${n} 1440 px: open ${open} px, folded ${folded} px`);
    });
  }

  test("the reset button restores the filters from the row of the toggle, also folded", async ({ page }) => {
    await page.goto(BOARD(1, "from=2015"));
    await expect(page.getByTestId("filters")).toBeVisible({ timeout: 120000 });
    await expect(page.getByTestId("filters-toggle")).toContainText("Filtros (1)");
    await page.getByTestId("filters-toggle").click();
    await page.getByTestId("filters-reset").click();
    await expect(page.getByTestId("filters-toggle")).toContainText("Filtros (0)");
  });

  test("no word «IA» in the visible text of the three boards (one survey, with an axis, tooltips of the link included)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const n of [1, 2, 3]) {
      await page.goto(BOARD(n, n === 1 ? "axis=98" : ""));
      await expect(page.getByTestId("filters")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1500);
      if (n === 1) {
        await page.getByText("¿Cómo usar este tablero?").click().catch(() => {});
        await page.getByTestId("axis-topics-other-link").hover();
        await page.waitForTimeout(300);
        expect(await page.locator(".ant-tooltip:visible").first().innerText()).not.toMatch(AI);
        await page.locator("th", { hasText: "Vínculo con el eje" }).locator("span").first().hover();
        await page.waitForTimeout(300);
        const headerTip = page.locator(".ant-tooltip:visible", { hasText: "según nuestra metodología" });
        await expect(headerTip).toBeVisible();
        expect(await headerTip.innerText()).not.toMatch(AI);
      }
      const text = await page.locator("main").innerText();
      expect(text, `Board ${n}`).not.toMatch(AI);
      // the titles of the elements (native tooltips) too
      const titles = await page.locator("main [title]").evaluateAll((els) => els.map((e) => e.getAttribute("title")));
      expect(titles.filter((t) => AI.test(t || ""))).toEqual([]);
    }
  });
});
