/*
 * F118 (D-260): the panel 13 of the T2 shows all the groups of each domain (it showed the first 12), so the rows add the 20 books, 102 chapters
 * and 122 with a non-academic actor of B162 (D-255), and 713 with any external co-author. The table of each domain scrolls inside the card.
 * E2E_LIVE=1 reads the real bundle and the dev server.
 */
import { test, expect } from "@playwright/test";

import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("F118 panel 13 of the T2 with all the groups (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the rows add books 20, chapters 102, total 122 and external 713; the page scrolls the table inside the card", async ({ page }) => {
    test.setTimeout(250000);
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    const result = computeCollaboration(createCollaborationDataset(raw));
    const perTab = raw.doms.map((_, tab) => result.domainRows(tab));
    const rows = perTab.flat();
    const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
    const got = { books: sum("books"), chapters: sum("chapters"), total: sum("total"), external: sum("external") };
    console.log(`[live] rows per domain ${JSON.stringify(perTab.map((r) => r.length))}; books ${got.books}, chapters ${got.chapters}, total ${got.total}, external ${got.external}`);
    expect([got.books, got.chapters, got.total]).toEqual([20, 102, 122]);
    expect(got.external).toBe(713);
    expect(Math.max(...perTab.map((r) => r.length))).toBeGreaterThan(12);

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    const card = page.getByTestId("chart-card").filter({ hasText: /^13 ·/ }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const m = await card.evaluate((c) => {
      const sc = c.querySelector(".ant-table-body");
      return { rows: c.querySelectorAll("tbody tr:not(.ant-table-measure-row)").length, scrolls: sc.scrollHeight > sc.clientHeight + 1, sideways: document.documentElement.scrollWidth - window.innerWidth, text: c.innerText };
    });
    console.log(`[live] first tab: rows in the page ${m.rows}, scrolls ${m.scrolls}`);
    expect(m.rows).toBe(perTab[0].length);
    expect(m.scrolls).toBe(perTab[0].length > 12);
    expect(m.sideways).toBeLessThanOrEqual(0);
    expect(m.text).not.toMatch(/NaN|undefined/);
  });
});
