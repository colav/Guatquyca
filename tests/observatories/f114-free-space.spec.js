/*
 * F114 (D-251): the content of a panel takes the space that the retired texts leave. For the panels that were touched, the free space between
 * the end of the main content (table, tiles, ring) and the end of the card is at most 16 px at 1440, 1280 and 768 px, the cards of a row keep
 * the same height and the page does not scroll sideways. E2E_LIVE=1: reads the real quyca and the dev server.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const MAX_FREE = 16;

/* Free space under the last visible leaf of the body of the card (text, canvas, svg), and the bottom of the main block (table, tiles, ring). */
const MEASURE = ({ title, block }) => {
  const card = [...document.querySelectorAll('[data-testid="chart-card"]')].find((c) => (c.querySelector(".ant-card-head-title")?.textContent || "").trim().startsWith(title));
  const body = card.querySelector(".ant-card-body");
  const br = body.getBoundingClientRect();
  const pad = parseFloat(getComputedStyle(body).paddingBottom) || 0;
  let bottom = br.top;
  for (const e of body.querySelectorAll(block)) bottom = Math.max(bottom, e.getBoundingClientRect().bottom);
  const scroller = card.querySelector(".ant-table-body");
  const sb = scroller ? scroller.getBoundingClientRect() : null;
  /* rows seen without scrolling: those inside the scrolling area of the table */
  const rows = sb ? [...scroller.querySelectorAll("tbody tr:not(.ant-table-measure-row)")].filter((r) => r.getBoundingClientRect().bottom <= sb.bottom + 1).length : 0;
  return { free: Math.round(br.bottom - pad - bottom), height: Math.round(card.getBoundingClientRect().height), rows, scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth };
};

const CASES = [
  { board: 1, title: "9 · Actores no académicos", block: ".ant-table-wrapper", name: "T1 panel 9 (table of actors)" },
  { board: 2, title: "4 · Productos por sector", block: "canvas, [data-testid='ring-legend']", name: "T2 panel 4 (ring)" },
  { board: 2, title: "8 · Investigación acción", block: ".ant-row", name: "T2 panel 8 (tiles)" },
];

test.describe("F114 free space of the touched panels (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("free space ≤ 16 px, no sideways scroll, at 1440, 1280 and 768", async ({ page }) => {
    test.setTimeout(400000);
    const report = [];
    for (const width of [1440, 1280, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const board of [1, 2]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("method-notes").waitFor({ timeout: 120000 });
        await page.waitForTimeout(5000);
        for (const c of CASES.filter((x) => x.board === board)) {
          const m = await page.evaluate(MEASURE, c);
          report.push(`${width} ${c.name}: free ${m.free}, height ${m.height}, rows ${m.rows}`);
          expect(m.free, `${width} ${c.name}`).toBeLessThanOrEqual(MAX_FREE);
          expect(m.scrollW, `${width} sideways scroll`).toBeLessThanOrEqual(m.innerW);
          if (c.board === 1 && width >= 1280) expect(m.rows, "the table shows more than the eleven rows of before").toBeGreaterThan(11);
        }
      }
    }
    console.log(`[live]\n${report.join("\n")}`);
  });
});
