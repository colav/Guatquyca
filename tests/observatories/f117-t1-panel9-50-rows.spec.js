/*
 * F117 (D-260): the table of the actors of the T1 (panel 9) shows 50 rows (it were 22) and, with the default selection, at least one organization
 * of «Otros» (label of the bundle) is among them. The table scrolls inside the card, without sideways scroll, at 1440, 1280 and 768 px.
 * E2E_LIVE=1 reads the real quyca and the dev server.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FILTERS, computeCapacity, createDataset, rankActors } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("F117 panel 9 of the T1 with 50 rows (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the ranking has 50 rows and «Otros» is among them", async () => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`, { headers: { "Accept-Encoding": "gzip" } })).json();
    const last = raw.actor_tipos[raw.actor_tipos.length - 1];
    const ds = createDataset(raw);
    const r = computeCapacity(ds, DEFAULT_FILTERS);
    const all = rankActors(ds, r, 1e6);
    const top = rankActors(ds, r);
    expect(top).toHaveLength(50);
    const firstOtros = all.findIndex((a) => a.type === last) + 1;
    const inTop = top.filter((a) => a.type === last);
    console.log(`[live] first «Otros» at position ${firstOtros}; «Otros» in the 50: ${inTop.length} (${inTop.map((a) => a.name).join("; ")})`);
    expect(firstOtros).toBeGreaterThan(0);
    expect(inTop.length, `first «Otros» at position ${firstOtros}`).toBeGreaterThan(0);
  });

  test("the page shows 50 rows, the label of «Otros», scrolls inside the card and does not scroll sideways", async ({ page }) => {
    test.setTimeout(300000);
    const lines = [];
    for (const width of [1440, 1280, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-1");
      const card = page.getByTestId("chart-card").filter({ hasText: /^9 · Actores/ }).first();
      await card.waitFor({ timeout: 120000 });
      await page.waitForTimeout(4000);
      const m = await card.evaluate((c) => {
        const sc = c.querySelector(".ant-table-body");
        return {
          rows: c.querySelectorAll("tbody tr:not(.ant-table-measure-row)").length,
          scrolls: sc.scrollHeight > sc.clientHeight + 1,
          otros: [...c.querySelectorAll("tbody tr")].filter((r) => /Otros/.test(r.textContent)).length,
          sideways: document.documentElement.scrollWidth - window.innerWidth,
          text: c.innerText,
        };
      });
      lines.push(`${width}: rows ${m.rows}, scrolls ${m.scrolls}, otros ${m.otros}, sideways ${m.sideways}`);
      expect(m.rows, `${width} rows`).toBe(50);
      expect(m.scrolls, `${width} scrolls inside`).toBe(true);
      expect(m.otros, `${width} «Otros» rows`).toBeGreaterThan(0);
      expect(m.sideways, `${width} sideways`).toBeLessThanOrEqual(0);
      expect(m.text).not.toMatch(/NaN|undefined/);
    }
    console.log(`[live]\n${lines.join("\n")}`);
  });
});
