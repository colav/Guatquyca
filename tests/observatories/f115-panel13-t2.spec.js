/*
 * F115 (D-252, D-255): the panel 13 of the T2 no longer has the column of social appropriation (B162: the zero is real, the source has no
 * co-author of another sector for those products) and its button (i) says why. The totals do not change. E2E_LIVE=1 reads the real bundle.
 */
import { test, expect } from "@playwright/test";

import { PANEL_HELP } from "../../app/observatories/vri-udea/board-2/components/panelHelp";
import { computeCollaboration, createCollaborationDataset } from "../../lib/observatories/collaboration";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test("the help of the panel 13 has the new subtitle and the reason, with no figure", () => {
  const text = Object.values(PANEL_HELP.p13).flat().join(" ");
  expect(PANEL_HELP.p13.how).toContain("Libros y capítulos de libro (sin artículos) realizados con coautores de empresa, gobierno, sin ánimo de lucro o salud");
  expect(text).toContain("Los productos de apropiación social no se incluyen porque la fuente no registra, para ellos, coautores de otro sector");
  expect(text).not.toMatch(/\d/);
  expect(PANEL_HELP.p13.how).not.toMatch(/productos de apropiación social hechos/);
});

test.describe("panel 13 against the real bundle (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("no column of social appropriation; the totals of the rows shown do not change", async ({ page }) => {
    test.setTimeout(200000);
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    const result = computeCollaboration(createCollaborationDataset(raw));
    const rows = raw.doms.flatMap((_, tab) => result.domainRows(tab));
    expect(rows.every((r) => !("appropriation" in r))).toBe(true);
    const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
    console.log(`[live] books ${sum("books")}, chapters ${sum("chapters")}, total ${sum("total")}, external ${sum("external")}`);
    /* the panel shows the first groups of each tab: 14 books, 90 chapters and 104 in total (the 20, 102 and 122 of B162 are over all the groups); total = books + chapters, so nothing is lost by dropping the column */
    expect([sum("books"), sum("chapters"), sum("total")]).toEqual([14, 90, 104]);
    expect(sum("books") + sum("chapters")).toBe(sum("total"));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    const card = page.getByTestId("chart-card").filter({ hasText: /^13 ·/ }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(card).not.toContainText("Apropiación social");
    await expect(card.locator("th").filter({ hasText: "Libros" }).first()).toBeVisible();
    await card.getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-care").last()).toContainText("Los productos de apropiación social no se incluyen");
    await page.keyboard.press("Escape");
  });
});
