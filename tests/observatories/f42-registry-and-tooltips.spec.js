/*
 * F42 (D-132, B105): Board 3 takes the totals of the registry of groups (359, 324, 35 and 9) from
 * `registro_grupos` of its bundle; the constant is only for the test data; without the key and with real
 * data no note is shown. The tooltips of the charts of Boards 2 and 3 and of the donuts now use
 * tooltipStyle.js and useTooltipInside of F39b; the survey of cut texts at the final width is done once in
 * F37 (D-146). The first block needs no server; the second reads the real quyca and the dev server of Luis
 * (D-100) and only runs with E2E_LIVE=1. No screenshots are saved (D-139 8).
 */
import { test, expect } from "@playwright/test";

import { OFFICIAL_GROUPS, groupRegistry, officialActiveGroupsNote, officialGroupsNote } from "../../lib/observatories/officialGroups";
import { tooltipInteraction } from "../../lib/observatories/tooltipStyle";

test.describe("registry of groups (no server)", () => {
  const groups = Array.from({ length: 350 }, (_, i) => [`COL${i}`]);

  test("the totals come from registro_grupos of the bundle, not from the constant", () => {
    const registry = groupRegistry({ groups, registro_grupos: { total: 400, activos: 330, inactivos: 70, sin_productos_impactu: 50 } }, false);
    expect(registry).toEqual({ total: 400, active: 330, inactive: 70, withoutProducts: 50 });
    expect(officialGroupsNote(350, registry)).toBe("350 de 400 grupos del registro oficial; 50 no tienen productos en ImpactU");
    expect(officialActiveGroupsNote(317, registry)).toBe("317 de 330 grupos activos del registro oficial; 13 no tienen productos en ImpactU");
    // the real values of B105
    expect(groupRegistry({ groups, registro_grupos: { total: 359, activos: 324, inactivos: 35, sin_productos_impactu: 9 } }, false)).toEqual({ total: 359, active: 324, inactive: 35, withoutProducts: 9 });
  });

  test("with real data and without the key there is no registry, so no note and no invented figure", () => {
    expect(groupRegistry({ groups }, false)).toBeNull();
    expect(groupRegistry({ groups, registro_grupos: { total: 359 } }, false)).toBeNull();
    expect(groupRegistry({ groups, registro_grupos: { total: "359", activos: 324, inactivos: 35, sin_productos_impactu: 9 } }, false)).toBeNull();
  });

  test("with the test data the constant is the stand-in, and the key wins when it is there", () => {
    expect(groupRegistry({ groups: groups.slice(0, 345) }, true)).toEqual({ total: OFFICIAL_GROUPS.total, active: OFFICIAL_GROUPS.active, inactive: OFFICIAL_GROUPS.inactive, withoutProducts: 14 });
    expect(groupRegistry({ groups, registro_grupos: { total: 1, activos: 1, inactivos: 0, sin_productos_impactu: 0 } }, true).total).toBe(1);
  });

  test("the tooltips of the charts wrap long values, are at most as wide as their longest line or the window and do not cut names", () => {
    const css = tooltipInteraction().tooltip.css;
    expect(css[".g2-tooltip"]["max-width"]).toBe("min(1000px, calc(100vw - 56px))");
    expect(css[".g2-tooltip-list-item"]["flex-wrap"]).toBe("wrap");
    expect(css[".g2-tooltip-list-item-value"]["text-overflow"]).toBe("clip");
    expect(css[".g2-tooltip-list-item-name-label"]["text-overflow"]).toBe("clip");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n, query = "") => `/observatories/vri-udea/board-${n}${query ? `?${query}` : ""}`;
const BUNDLE_3 = "**/observatories/vri-udea/boards/3/bundle";

test.describe("registry and tooltips against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the real bundle has registro_grupos 359, 324, 35 and 9, and the page says «350 de 359» and «317 de 324» from them", async ({ page }) => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    expect(raw.registro_grupos).toEqual({ total: 359, activos: 324, inactivos: 35, sin_productos_impactu: 9 });
    expect(raw.registro_grupos.activos + raw.registro_grupos.inactivos).toBe(raw.registro_grupos.total);
    expect(raw.groups.length + raw.registro_grupos.sin_productos_impactu).toBe(raw.registro_grupos.total);
    await page.goto(BOARD(3));
    await expect(page.getByTestId("official-groups-note")).toHaveText("350 de 359 grupos del registro oficial; 9 no tienen productos en ImpactU", { timeout: 120000 });
    await expect(page.getByText("317 de 324 grupos activos del registro oficial; 7 no tienen productos en ImpactU")).toBeVisible();
  });

  test("the notes follow the bundle: with other totals in the response the page shows those, not the constant", async ({ page }) => {
    await page.route(BUNDLE_3, async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      body.registro_grupos = { total: 400, activos: 330, inactivos: 70, sin_productos_impactu: 50 };
      await route.fulfill({ response, json: body });
    });
    await page.goto(BOARD(3));
    await expect(page.getByTestId("official-groups-note")).toHaveText("350 de 400 grupos del registro oficial; 50 no tienen productos en ImpactU", { timeout: 120000 });
    await expect(page.getByText("de 330 grupos activos del registro oficial")).toBeVisible();
    expect(await page.locator("main").innerText()).not.toContain("359");
  });

  test("without registro_grupos in the bundle the note is not shown and no figure of the registry appears", async ({ page }) => {
    await page.route(BUNDLE_3, async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      delete body.registro_grupos;
      await route.fulfill({ response, json: body });
    });
    await page.goto(BOARD(3));
    await expect(page.getByLabel("Filtros").first()).toBeVisible({ timeout: 120000 });
    await expect(page.getByTestId("official-groups-note")).toHaveCount(0);
    const text = await page.locator("main").innerText();
    expect(text).not.toContain("del registro oficial");
    expect(text).not.toContain("359");
  });

  test("the groups per subregion of proj.subregion are of the list of 350 and the board does not show them (nothing to change)", async () => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const counts = Object.fromEntries(Object.entries(raw.proj.subregion).map(([name, s]) => [name, s.grupos]));
    for (const [name, n] of Object.entries(counts)) expect(n, name).toBeLessThanOrEqual(raw.groups.length);
    expect(counts).toEqual({ "Bajo Cauca": 28, "Magdalena Medio": 10, Nordeste: 13, Norte: 4, Occidente: 20, Oriente: 73, Suroeste: 31, Urabá: 64, "Valle de Aburrá": 307 });
  });
});
