/*
 * F41: texts that quote a number of groups (D-131). The figures of the lists come from the data; the
 * totals of the official registry (359 groups, 324 active, 35 inactive) are kept in one constant with
 * its source. The first block needs no server; the second reads the real quyca and the dev server of
 * Luis (D-100) and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { GRAPH_MIN_EDGE, LIMITS } from "../../lib/observatories/collaboration";
import { OFFICIAL_GROUPS, groupRegistry, officialActiveGroupsNote, officialGroupsNote } from "../../lib/observatories/officialGroups";
import { NOTES } from "../../app/observatories/vri-udea/board-2/components/boardTexts";

test.describe("texts about groups (no server)", () => {
  test("the note of the list says «346 de 359» and the 13 that have no products (F54)", () => {
    const registry = { total: 359, active: 324, inactive: 35, withoutProducts: 13 };
    expect(officialGroupsNote(346, registry)).toBe("346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.");
    expect(officialActiveGroupsNote(317, registry)).toBe("317 de 324 grupos activos tienen productos en ImpactU; 7 no.");
    expect(OFFICIAL_GROUPS).toEqual({ total: 359, active: 324, inactive: 35 });
  });

  test("the note of the graph of Board 2 takes the number of groups and of products from the constants of the calculation", () => {
    expect(NOTES.v2).toContain(`${LIMITS.graphNodes} grupos con mayor grado ponderado`);
    expect(NOTES.v2).toContain(`aristas con ${GRAPH_MIN_EDGE} o más productos`);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n, query = "") => `/observatories/vri-udea/board-${n}${query ? `?${query}` : ""}`;

test.describe("groups against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 3: the list of groups of the bundle has 346 (from the registry of the bundle) and the notes say so", async ({ page }) => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const active = raw.groups.filter((g) => g[6] === "Activo").length;
    const inactive = raw.groups.filter((g) => g[6] !== "Activo").length;
    expect(raw.groups).toHaveLength(346);
    expect(active + inactive).toBe(raw.registro_grupos.total - raw.registro_grupos.sin_productos_impactu);
    await page.goto(BOARD(3));
    const registry = groupRegistry(raw, false);
    await expect(page.getByTestId("official-groups-note")).toHaveText(officialGroupsNote(raw.groups.length, registry), { timeout: 120000 });
    await expect(page.getByText(officialActiveGroupsNote(active, registry))).toBeVisible();
    // With a filter the count of active groups changes with the data and the official note of the active ones is not repeated.
    await page.goto(BOARD(3, "center=1"));
    await expect(page.getByText("grupos activos del centro", { exact: false }).first()).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("tienen productos en ImpactU", { exact: false })).toHaveCount(1);
  });

  test("Board 2: the note of the graph says the number of groups that the calculation uses", async ({ page }) => {
    await page.goto(BOARD(2));
    await expect(page.getByText(`Se muestran los ${LIMITS.graphNodes} grupos con mayor grado ponderado`, { exact: false })).toBeVisible({ timeout: 120000 });
  });
});
