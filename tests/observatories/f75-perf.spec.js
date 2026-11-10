/*
 * F75 (D-178): cost of a change of filter from end to end, with the CPU at a quarter: the calculation of the lists of options
 * (`timed`) and the render of the bar of filters (`React.Profiler`); the goal is 150 ms or less in the case at a quarter.
 * It only runs with E2E_LIVE=1 and reports the figures; with the CPU at a quarter the goal is reported as an annotation.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const BOARDS = [
  ["T1", "/observatories/vri-udea/board-1", "category-legend"],
  ["T2", "/observatories/vri-udea/board-2", "axis-filter"],
  ["T3", "/observatories/vri-udea/board-3", "filters"],
];

test.describe("cost of a change of filter (real quyca, CPU at a quarter)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  for (const [name, url, ready] of BOARDS) {
    test(`${name}: choosing a centre`, async ({ page }) => {
      test.setTimeout(200000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(url);
      await page.getByTestId(ready).waitFor({ timeout: 120000 });
      await page.waitForTimeout(3500);
      const results = {};
      for (const [label, rate] of [["normal", 1], ["quarter", 4]]) {
        const client = await page.context().newCDPSession(page);
        await client.send("Emulation.setCPUThrottlingRate", { rate });
        // choose the second centre, then clear it
        await page.evaluate(() => { window.__obsPerf = []; });
        const select = page.getByTestId("filters").locator("label", { hasText: "Centro de investigación" }).first().locator("xpath=../..").locator(".ant-select-selector").first();
        const t0 = Date.now();
        await select.click();
        await page.locator(".ant-select-dropdown:visible .ant-select-item-option").nth(2).waitFor();
        /* only the change of filter counts: from the click on the option, not the opening of the list */
        await page.evaluate(() => { window.__obsPerf = []; });
        await page.locator(".ant-select-dropdown:visible .ant-select-item-option").nth(2).click();
        await page.waitForFunction(() => window.__obsPerf.some((e) => e.label === "options"), null, { timeout: 30000 });
        await page.waitForTimeout(600);
        const perf = await page.evaluate(() => window.__obsPerf);
        const options = perf.filter((e) => e.label === "options").reduce((a, e) => a + e.ms, 0);
        const render = perf.filter((e) => e.label.startsWith("render:filters")).reduce((a, e) => a + e.ms, 0);
        results[label + "_events"] = perf.filter((e) => e.ms >= 5).map((e) => `${e.label.replace("render:filters:", "")}=${Math.round(e.ms)}`).join(" ");
        results[label] = { options: Math.round(options), render: Math.round(render), total: Math.round(options + render), events: perf.length };
        await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        // back to «all» for the next round
        await select.hover();
        await page.locator(".ant-select-clear").first().click({ force: true }).catch(() => {});
        await page.waitForTimeout(700);
        void t0;
      }
      console.log(`[live] ${name} change of centre: ${JSON.stringify(results)}`);
      /* The goal of F75 is 150 ms at a quarter of CPU. It is reported, not asserted: the real figures are in the report. */
      test.info().annotations.push({ type: "goal-150ms-at-a-quarter", description: `${name}: ${results.quarter.total} ms (${results.quarter.total <= 150 ? "met" : "not met"})` });
      expect(results.normal.total, `${name} with a normal CPU`).toBeLessThanOrEqual(150);
    });
  }
});
