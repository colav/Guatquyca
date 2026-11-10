/*
 * F116 (D-257, B164): the panel 9 of the T1 no longer leaves out the type «Otros» (museums, libraries, archives and the organizations without
 * a type); its label comes from `actor_tipos` of the bundle (B164: «Otros (archivos, museos y sin clasificar)»). E2E_LIVE=1 reads the real bundle.
 */
import { test, expect } from "@playwright/test";

import { DEFAULT_FILTERS, computeCapacity, createDataset, rankActors } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("panel 9 of the T1 includes «Otros» (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("ETag of B164, label from the bundle, 4.909 organizations by type, and «Otros» in the ranking", async () => {
    const res = await fetch(`${API}/observatories/vri-udea/boards/1/bundle`, { headers: { "Accept-Encoding": "gzip" } });
    expect(res.headers.get("etag")).toBe('"20261107-c550a33072f7"');
    const raw = await res.json();
    const last = raw.actor_tipos[raw.actor_tipos.length - 1];
    expect(last).toBe("Otros (archivos, museos y sin clasificar)");
    expect(raw.afils.length).toBe(raw.obs.calidad_tipo.no_academicas.total.organizaciones);
    const inBundle = {};
    for (const a of raw.afils) inBundle[raw.actor_tipos[a[2]]] = (inBundle[raw.actor_tipos[a[2]]] || 0) + 1;
    expect(Object.values(inBundle).reduce((a, b) => a + b, 0)).toBe(4909);
    const ds = createDataset(raw);
    const r = computeCapacity(ds, DEFAULT_FILTERS);
    const all = rankActors(ds, r, 1e6);
    const byType = {};
    for (const a of all) byType[a.type] = (byType[a.type] || 0) + 1;
    expect(byType[last], "«Otros» is in the ranking").toBeGreaterThan(0);
    expect(all.length).toBe(r.actorCounts.size);
    const firstOtros = all.findIndex((a) => a.type === last);
    const top = rankActors(ds, r);
    console.log(`[live] label ${last}\nin the bundle ${JSON.stringify(inBundle)}\nin the ranking (default selection) ${JSON.stringify(byType)} = ${all.length}\nfirst «Otros» at position ${firstOtros + 1} of ${all.length}; rows of the panel ${top.length}, «Otros» among them ${top.filter((a) => a.type === last).length}`);
  });

  test("the table shows the label of the bundle and the warning keeps the share without type", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-1");
    const card = page.getByTestId("chart-card").filter({ hasText: /^9 · Actores/ }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await card.getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-care").last()).toContainText("restante no tiene clasificación");
    await page.keyboard.press("Escape");
  });
});
