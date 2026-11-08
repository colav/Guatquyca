/*
 * F38: equal sizes inside every group of a board (KPI cards, tiles of a mosaic, rows of a table and
 * panels of a row), at 1280 and 768 px, also with an artificially long label. Uses the local test
 * data (?source=mock) and the dev server of Luis (D-100), so it does not depend on quyca.
 */
import { test, expect } from "@playwright/test";

const BOARDS = [1, 2, 3];
const WIDTHS = [1280, 768];
const TOLERANCE = 1;
// With E2E_LIVE=1 the boards read the real quyca; otherwise they read the local test data.

const sizes = async (locator) => locator.evaluateAll((nodes) => nodes.map((n) => Math.round(n.getBoundingClientRect().height * 10) / 10));
const allEqual = (list) => list.length === 0 || Math.max(...list) - Math.min(...list) <= TOLERANCE;

for (const width of WIDTHS) {
  for (const n of BOARDS) {
    test(`board ${n} at ${width}px: groups of equal size`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/observatories/vri-udea/board-${n}${process.env.E2E_LIVE ? "" : "?source=mock"}`);
      await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1500);

      // KPI cards: one block per board (Board 2 also has the tiles of helices, with detail).
      const kpi = page.locator(".obs-kpi");
      expect(await kpi.count()).toBeGreaterThan(0);
      const kpiBlocks = await page.locator(".ant-row:has(> div > .obs-kpi)").evaluateAll((rows) =>
        rows.map((r) => [...r.querySelectorAll(".obs-kpi")].map((k) => Math.round(k.getBoundingClientRect().height * 10) / 10)),
      );
      for (const block of kpiBlocks) expect(allEqual(block), `KPI block ${block}`).toBe(true);

      // Same block with a very long label in the first card: heights stay equal and the label is cut.
      const first = page.locator(".obs-kpi").first();
      await first.locator("div[title]").first().evaluate((el) => { el.textContent = "etiqueta muy larga ".repeat(40); });
      const after = await first.evaluate((el) => [...el.closest(".ant-row").querySelectorAll(".obs-kpi")].map((k) => Math.round(k.getBoundingClientRect().height * 10) / 10));
      expect(allEqual(after), `long label ${after}`).toBe(true);

      // Tiles of a mosaic: the same height in the whole mosaic.
      for (const testid of ["mosaic-tile"]) {
        // Each mosaic (its own container) has one height for all its tiles.
        const groups = await page.getByTestId(testid).evaluateAll((nodes) => {
          const map = new Map();
          for (const node of nodes) {
            const box = node.closest(".ant-card-body");
            map.set(box, [...(map.get(box) || []), Math.round(node.getBoundingClientRect().height * 10) / 10]);
          }
          return [...map.values()];
        });
        for (const heights of groups) expect(allEqual(heights), testid + " " + heights).toBe(true);
      }

      // Rows of each table.
      const tables = page.locator(".ant-table");
      for (let i = 0; i < (await tables.count()); i++) {
        // Q-13 (F89): the table of the groups of the panel 13 of Board 2 lets the name of the group go to two lines, so its rows are not equal
        if (await tables.nth(i).locator("xpath=ancestor::*[@data-testid='chart-card']").getByText("13 · Grupos de investigación con actores").count()) continue;
        const rows = tables.nth(i).locator("tbody tr.ant-table-row");
        if (await rows.count()) expect(allEqual(await sizes(rows)), `table ${i}`).toBe(true);
      }

      // Panels of a row: same top, same height.
      const panels = await page.getByTestId("chart-card").evaluateAll((nodes) => nodes.map((p) => {
        const box = p.getBoundingClientRect();
        return { top: Math.round(box.top + window.scrollY), height: Math.round(box.height), left: Math.round(box.left) };
      }));
      const byTop = new Map();
      for (const p of panels) byTop.set(p.top, [...(byTop.get(p.top) || []), p.height]);
      for (const [top, heights] of byTop) expect(allEqual(heights), `panels at ${top}: ${heights}`).toBe(true);
    });
  }
}
