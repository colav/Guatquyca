/*
 * F56 (D-153): the table of topics of the axis is 120 px lower (the scrolling body goes from 360 to 240 px, header and footer
 * stay) and the treemap of the Board 3 has no shadow (the card keeps the shadow of the cards, D-143). The tests of the tiles of the mosaics were removed in F80: the subregions and departments are maps now, and the ODS are a treemap since F77.
 * Reads the real quyca and the dev server of Luis (D-100): only with E2E_LIVE=1. Computed styles, no screenshots.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const BOARD = (n, q = "") => `/observatories/vri-udea/board-${n}${q ? `?${q}` : ""}`;
const BODY = ".ant-table-body:has([data-testid='axis-topics-other'])";

test.describe("F56 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const width of [1440, 1280]) {
    test(`table of topics of the axis: body of 240 px with many topics (axes 67, 98), no gap with few (axis 12), row and total visible (${width} px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const [axis, expected] of [[67, 240], [98, 240], [12, null]]) {
        await page.goto(BOARD(1, `axis=${axis}`));
        await page.getByTestId("axis-topics-total-products").waitFor({ timeout: 120000 });
        await page.waitForTimeout(400);
        const m = await page.evaluate((sel) => {
          const body = document.querySelector(sel);
          const rows = [...body.querySelectorAll("tr.ant-table-row")];
          return { body: Math.round(body.getBoundingClientRect().height), max: getComputedStyle(body).maxHeight, rows: rows.length, rowsHeight: Math.round(rows.reduce((a, r) => a + r.getBoundingClientRect().height, 0)), table: Math.round(body.closest(".ant-table-wrapper").getBoundingClientRect().height) };
        }, BODY);
        console.log(`[live] axis ${axis} @${width}: body ${m.body} px (max ${m.max}), ${m.rows} rows of ${m.rowsHeight} px, table ${m.table} px`);
        expect(m.max).toBe("240px");
        if (expected) expect(m.body).toBe(expected);
        else expect(Math.abs(m.body - m.rowsHeight)).toBeLessThan(2); // few topics: the body is as high as its rows, no gap
        // the row of reconciliation (last of the body) is reachable by scrolling, and the total of the footer stays visible
        await page.getByTestId("axis-topics-total-products").scrollIntoViewIfNeeded();
        await page.locator(BODY).evaluate((el) => { el.scrollTop = el.scrollHeight; });
        await expect(page.getByTestId("axis-topics-other-products")).toBeInViewport();
        await expect(page.getByTestId("axis-topics-total-products")).toBeInViewport();
        const other = await page.getByTestId("axis-topics-other").boundingBox();
        const body = await page.locator(BODY).boundingBox();
        expect(other.y + other.height).toBeLessThanOrEqual(body.y + body.height + 1); // not cut: inside the body
      }
    });
  }

  test("Board 3: the treemap of the OECD areas is drawn on a canvas and nothing in its panel has a shadow or a filter", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BOARD(3));
    const card = page.locator(".ant-card", { hasText: "por gran área OCDE" }).first();
    await card.locator("canvas").first().waitFor({ timeout: 120000 });
    const nodes = await card.evaluate((c) => [...c.querySelectorAll("*")].filter((n) => { const s = getComputedStyle(n); return s.boxShadow !== "none" || s.filter !== "none" || s.textShadow !== "none"; }).length);
    expect(nodes).toBe(0);
  });
});
