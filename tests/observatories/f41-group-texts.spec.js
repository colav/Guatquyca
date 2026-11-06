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
  test("the note of the list says «350 de 359» and the 9 that have no products", () => {
    const registry = { total: 359, active: 324, inactive: 35, withoutProducts: 9 };
    expect(officialGroupsNote(350, registry)).toBe("350 de 359 grupos del registro oficial; 9 no tienen productos en ImpactU");
    expect(officialActiveGroupsNote(317, registry)).toBe("317 de 324 grupos activos del registro oficial; 7 no tienen productos en ImpactU");
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

  test("Board 3: the list of groups of the bundle has 350 (317 active, 33 inactive) and the notes say so", async ({ page }) => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const active = raw.groups.filter((g) => g[6] === "Activo").length;
    const inactive = raw.groups.filter((g) => g[6] !== "Activo").length;
    expect(raw.groups).toHaveLength(350);
    expect(active).toBe(317);
    expect(inactive).toBe(33);
    expect(active + inactive).toBe(OFFICIAL_GROUPS.total - 9);
    await page.goto(BOARD(3));
    const registry = groupRegistry(raw, false);
    await expect(page.getByTestId("official-groups-note")).toHaveText(officialGroupsNote(raw.groups.length, registry), { timeout: 120000 });
    await expect(page.getByText(officialActiveGroupsNote(active, registry))).toBeVisible();
    // With a filter the count of active groups changes with the data and the official note of the active ones is not repeated.
    await page.goto(BOARD(3, "center=1"));
    await expect(page.getByText("grupos activos del centro", { exact: false }).first()).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("del registro oficial; ", { exact: false })).toHaveCount(1);
  });

  test("Board 2: the note of the graph says the number of groups that the calculation uses", async ({ page }) => {
    await page.goto(BOARD(2));
    await expect(page.getByText(`Se muestran los ${LIMITS.graphNodes} grupos con mayor grado ponderado`, { exact: false })).toBeVisible({ timeout: 120000 });
  });
});
