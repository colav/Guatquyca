/*
 * Panels 1 and 2 of the T1 (scatter and calculator) share the row 60/40, have the same height, the texts of the panel 2 were
 * shortened and the height of the pair does not need to scroll away from the scatter. E2E_LIVE=1 reads the real quyca and the dev server.
 */
import { test, expect } from "@playwright/test";

import { CALCULATOR_EXPLANATION } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;

test("the explanation of the panel 2 keeps its four parts and is short", () => {
  expect(CALCULATOR_EXPLANATION.map((p) => p.key)).toEqual(["ratio", "trend", "category"]);
  const words = CALCULATOR_EXPLANATION.map((p) => p.text).join(" ").split(/\s+/).length;
  expect(words).toBeLessThanOrEqual(150);
});

test.describe("panels 1 and 2 in the page (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("60/40 of the row, same height, no sideways scroll", async ({ page }) => {
    test.setTimeout(250000);
    const lines = [];
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-1");
      await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
      await page.waitForTimeout(4000);
      const m = await page.evaluate(() => {
        const box = (t) => { const c = [...document.querySelectorAll('[data-testid="chart-card"]')].find((e) => (e.querySelector(".ant-card-head-title")?.textContent || "").trim().startsWith(t)); const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left) }; };
        return { p1: box("1 ·"), p2: box("2 ·"), sideways: document.documentElement.scrollWidth - window.innerWidth, vh: window.innerHeight };
      });
      lines.push(`${width}: P1 ${JSON.stringify(m.p1)}, P2 ${JSON.stringify(m.p2)}, sideways ${m.sideways}`);
      const share = m.p1.w / (m.p1.w + m.p2.w);
      expect(share, `${width} 60/40`).toBeGreaterThan(0.58);
      expect(share, `${width} 60/40`).toBeLessThan(0.62);
      expect(Math.abs(m.p1.h - m.p2.h), `${width} same height`).toBeLessThanOrEqual(2);
      expect(m.sideways).toBeLessThanOrEqual(0);
    }
    console.log(`[real]\n${lines.join("\n")}`);
  });
});
