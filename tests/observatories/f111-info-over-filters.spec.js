/*
 * F111 (D-248): the window of the button (i) is above the panel of filters (z-index 1040) and below the menus of Ant (1050). With a short
 * window the window flips upwards and overlaps the panel of filters: the point of the overlap belongs to the window, not to the filters,
 * in the three boards and at 1440, 1280 and 768 px; the menu of a filter stays above the window. E2E_LIVE=1: real quyca and dev server.
 */
import { test, expect } from "@playwright/test";

import { POPUP_Z_INDEX } from "../../app/observatories/components/PanelInfo";

const LIVE = !!process.env.E2E_LIVE;

test("the z-index of the window is between the filters and the menus of Ant", () => {
  expect(POPUP_Z_INDEX).toBeGreaterThan(1040);
  expect(POPUP_Z_INDEX).toBeLessThan(1050);
});

test.describe("window (i) over the panel of filters (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("at each board and width the overlapped point belongs to the window; a menu of a filter is above the window", async ({ page }) => {
    test.setTimeout(500000);
    const report = [];
    for (const width of [1440, 1280, 768]) {
      await page.setViewportSize({ width, height: 520 });
      for (const board of [1, 2, 3]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("filters").waitFor({ timeout: 120000 });
        await page.getByTestId("chart-card").first().waitFor({ timeout: 120000 });
        await page.waitForTimeout(3000);
        const filters = page.getByTestId("filters");
        const card = page.getByTestId("chart-card").first();
        /* put the first card so that its button (i) is near the bottom of the window: the window flips upwards over the filters */
        await card.scrollIntoViewIfNeeded();
        await page.evaluate(() => {
          const btn = document.querySelector('[data-testid="chart-card"] [data-testid="panel-info"]');
          const r = btn.getBoundingClientRect();
          window.scrollBy(0, r.top - (window.innerHeight - 90));
        });
        await page.waitForTimeout(400);
        await card.getByTestId("panel-info").click();
        await page.waitForTimeout(500);
        const popup = page.locator(".ant-popover:not(.ant-popover-hidden)").last();
        const pb = await popup.boundingBox();
        const fb = await filters.boundingBox(); /* sticky: measured with the window open */
        const info = await page.evaluate(({ pb, fb }) => {
          const ox = Math.max(pb.x, fb.x), oy = Math.max(pb.y, fb.y);
          const ox2 = Math.min(pb.x + pb.width, fb.x + fb.width), oy2 = Math.min(pb.y + pb.height, fb.y + fb.height);
          if (ox2 <= ox || oy2 <= oy) return { overlap: false };
          const el = document.elementFromPoint((ox + ox2) / 2, (oy + oy2) / 2);
          return { overlap: true, inPopup: !!(el && el.closest(".ant-popover")), cut: pb.x < -1 || pb.x + pb.width > window.innerWidth + 1 };
        }, { pb, fb });
        report.push(`${width} T${board}: ${JSON.stringify(info)}`);
        if (info.overlap) {
          expect(info.inPopup, `${width} T${board}: the overlapped point belongs to the window`).toBe(true);
        }
        expect(info.cut ?? false, `${width} T${board}: the window is not cut`).toBe(false);
        await page.keyboard.press("Escape");
      }
    }
    /* the menu of a filter (Ant, 1050) is above the window (1045): a click outside closes the window, so they never coexist; the numbers are compared */
    await page.goto("/observatories/vri-udea/board-1");
    await page.getByTestId("filters").waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await page.getByTestId("filters").locator(".ant-select").first().click();
    const menuZ = await page.evaluate(() => +getComputedStyle(document.querySelector(".ant-select-dropdown")).zIndex);
    report.push(`menu of a filter: z-index ${menuZ}; window: ${POPUP_Z_INDEX}`);
    expect(menuZ).toBeGreaterThan(POPUP_Z_INDEX);
    console.log(`[live]\n${report.join("\n")}`);
  });
});
