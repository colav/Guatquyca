/*
 * F128 (D-271): the window is resized AFTER the board has loaded (the tests that load at one width cannot see this). Before the fix, panel 2
 * of the Tablero 1 (calculator) went to a new row when the window was narrowed: its column is a flex item with min-width:auto and the
 * canvas of its chart kept the fixed width in px of the last layout, so the pair did not fit and wrapped. E2E_LIVE=1 reads the real quyca.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const BOARDS = [1, 2, 3];

const layout = (page) =>
  page.evaluate(() => ({
    sideways: document.documentElement.scrollWidth - window.innerWidth,
    cards: [...document.querySelectorAll('[data-testid="chart-card"]')].map((c) => {
      const b = c.getBoundingClientRect();
      return { title: (c.querySelector(".ant-card-head-title")?.textContent || "").trim().split(" ")[0], left: Math.round(b.left), width: Math.round(b.width), top: Math.round(b.top + window.scrollY) };
    }),
  }));
const card = (m, n) => m.cards.find((c) => c.title === String(n));
const load = async (page, board) => {
  await page.goto(`/observatories/vri-udea/board-${board}`);
  await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
  await page.waitForTimeout(3500);
};

test.describe("F128 resize after load (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("T1: panels 1 and 2 keep the 60/40 in one row from 992 px up and stack below it, resizing after load, both ways", async ({ page }) => {
    test.setTimeout(300000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await load(page, 1);
    for (const width of [1280, 1100, 1024, 900, 768, 1100, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(1800);
      const m = await layout(page);
      const p1 = card(m, 1);
      const p2 = card(m, 2);
      expect(m.sideways, `${width} sideways scroll`).toBeLessThanOrEqual(0);
      if (width >= 992) {
        expect(Math.abs(p1.top - p2.top), `${width} same row`).toBeLessThan(6);
        const share = p1.width / (p1.width + p2.width);
        expect(share, `${width} 60/40`).toBeGreaterThan(0.58);
        expect(share, `${width} 60/40`).toBeLessThan(0.62);
        expect(p2.left, `${width} p2 beside p1`).toBeGreaterThan(p1.left + p1.width - 2);
      } else {
        expect(p2.top, `${width} stacked`).toBeGreaterThan(p1.top + 100);
        expect(p2.width, `${width} full width`).toBeGreaterThanOrEqual(p1.width - 2);
      }
    }
  });

  for (const board of BOARDS) {
    test(`T${board}: after narrowing the window the layout is the one of a fresh load at that width`, async ({ page, context }) => {
      test.setTimeout(300000);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await load(page, board);
      for (const width of [1100, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.waitForTimeout(1800);
        const resized = await layout(page);
        const fresh = await context.newPage();
        await fresh.setViewportSize({ width, height: 1000 });
        await load(fresh, board);
        const reference = await layout(fresh);
        await fresh.close();
        expect(resized.sideways, `${width} sideways scroll`).toBeLessThanOrEqual(0);
        expect(resized.cards.length).toBe(reference.cards.length);
        const rowSize = (m, c) => m.cards.filter((x) => Math.abs(x.top - c.top) < 6).length;
        const diffs = resized.cards
          .map((c, i) => {
            const r = reference.cards[i];
            return c.left !== r.left || Math.abs(c.width - r.width) > 2 || rowSize(resized, c) !== rowSize(reference, r) ? `${c.title}: ${c.left}/${c.width} vs ${r.left}/${r.width}` : null;
          })
          .filter(Boolean);
        expect(diffs, `${width} cards that differ from a fresh load`).toEqual([]);
      }
    });
  }
});
