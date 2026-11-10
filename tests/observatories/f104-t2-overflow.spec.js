/*
 * F104 (D-230, point 3): the T2 page must be as wide as the window at 1.440, 1.280 and 768 px (the tabs of the panel 14 scroll inside their
 * own container) and the tile «Artículos con hospitales/clínicas» must not be cut at 1.280 px. Needs E2E_LIVE=1 (reads quyca).
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

async function measure(page, width) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("/observatories/vri-udea/board-2", { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="chart-card"]').first().waitFor({ timeout: 120000 });
  await page.waitForTimeout(3500);
  return page.evaluate(() => {
    const cut = (els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2).map((el) => (el.innerText || el.textContent || "").trim().slice(0, 60));
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && !el.closest(".ant-segmented-group, .ant-segmented, .ant-table-content, .ant-table-body"))
      .slice(0, 5)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 50)} ${Math.round(el.getBoundingClientRect().right)}`);
    return {
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      tilesCut: cut([...document.querySelectorAll('[data-testid="panel-tile"], .obs-tile')]),
      wide,
    };
  });
}

test.describe("F104 T2 overflow", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real servers.");
  for (const width of [1440, 1280, 768]) {
    test(`the document is as wide as the window at ${width} px and no tile is cut`, async ({ page }) => {
      test.setTimeout(150000);
      const m = await measure(page, width);
      console.log(`T2 ${width}: ${JSON.stringify(m)}`);
      expect(m.scrollW, "document width").toBeLessThanOrEqual(m.innerW);
      expect(m.tilesCut, "cut tiles").toEqual([]);
    });
  }
});

test.describe("F104 antd warnings of PanelInfo", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real servers.");
  for (const board of [1, 2, 3]) {
    test(`T${board}: opening the button (i) writes no deprecation of antd in the console`, async ({ page }) => {
      test.setTimeout(150000);
      const warnings = [];
      page.on("console", (m) => { if (/antd/i.test(m.text()) && /deprecated/i.test(m.text())) warnings.push(m.text().slice(0, 160)); });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`/observatories/vri-udea/board-${board}`, { waitUntil: "domcontentloaded" });
      await page.locator('[data-testid="chart-card"]').first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(3000);
      const button = page.getByTestId("panel-info").first();
      await button.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await button.click();
      await expect(page.getByTestId("panel-info-content").last()).toBeVisible();
      const width = await page.getByTestId("panel-info-content").last().evaluate((el) => el.closest(".ant-popover")?.getBoundingClientRect().width ?? 0);
      await page.keyboard.press("Escape");
      expect(warnings).toEqual([]);
      expect(width, "the window keeps its width (styles.root)").toBeGreaterThan(200);
    });
  }
});
