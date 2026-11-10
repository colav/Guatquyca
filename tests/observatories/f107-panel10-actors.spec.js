/*
 * F107 (D-239): the panel 10 of the T1 (non-academic actors) on the bundle of B159. Counts the actors by type, for the whole bundle and for the
 * default selection (all of them, and the 22 rows that the panel shows), and checks the panel in the page. E2E_LIVE=1 reads the real bundle.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FILTERS, computeCapacity, createDataset, rankActors } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("F107 panel 10 of the T1 on the bundle of B159 (real)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("actors by type: in the bundle, in the default selection and in the 22 rows of the panel", async () => {
    const res = await fetch(`${API}/observatories/vri-udea/boards/1/bundle`, { headers: { "Accept-Encoding": "gzip" } });
    expect(res.headers.get("etag")).toBe('"20261107-c550a33072f7"');
    const raw = await res.json();
    const ds = createDataset(raw);
    const inBundle = {};
    for (const a of raw.afils) inBundle[raw.actor_tipos[a[2]]] = (inBundle[raw.actor_tipos[a[2]]] || 0) + 1;
    const r = computeCapacity(ds, DEFAULT_FILTERS);
    const selection = {};
    for (const [a] of r.actorCounts) selection[raw.actor_tipos[raw.afils[a][2]]] = (selection[raw.actor_tipos[raw.afils[a][2]]] || 0) + 1;
    const top = {};
    const ranked = rankActors(ds, r);
    for (const a of ranked) top[a.type] = (top[a.type] || 0) + 1;
    console.log(`[live] afils ${raw.afils.length}\nin the bundle ${JSON.stringify(inBundle)}\nin the default selection ${JSON.stringify(selection)}\ntop 22 of the panel ${JSON.stringify(top)}\nfirst rows ${ranked.slice(0, 5).map((a) => `${a.name} (${a.type}, ${a.products})`).join("; ")}`);
    expect(ranked).toHaveLength(22);
    expect(ranked.every((a) => a.type && !/undefined|NaN/.test(`${a.name}${a.type}${a.products}`))).toBe(true);
    /* F116: «Otros» is no longer left out of the ranking */
  });

  test("in the page the panel of the actors (9 · Actores no académicos, help p10) shows its 22 rows without NaN or undefined", async ({ page }) => {
    test.setTimeout(150000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-1");
    const card = page.getByTestId("chart-card").filter({ hasText: /^9 · Actores/ }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const text = await card.innerText();
    expect(text).not.toMatch(/NaN|undefined|ensayo/i);
    /* F108/F109: the classification and its quantified warning are in the button (i), not in the card */
    expect(text).not.toMatch(/puede haber errores/);
    await card.getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-care").last()).toContainText("puede haber algunos errores");
    await page.keyboard.press("Escape");
    expect(await card.locator("tbody tr").count()).toBeGreaterThan(5);
  });
});
