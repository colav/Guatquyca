/*
 * F60 (D-160): note of the groups in Board 2 («346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.»)
 * with the figures of `registro_grupos` of the bundle of Board 2, the same mechanism as Board 3 (F54); and the bundles
 * with the ETags of D-160. The first block needs no server; the second reads the real quyca and the dev server of Luis
 * and only runs with E2E_LIVE=1. One run, no screenshots.
 */
import { test, expect } from "@playwright/test";

import { groupRegistry, officialGroupsNote } from "../../lib/observatories/officialGroups";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const bundle = async (n) => (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();

test.describe("F60 note of the groups (no server)", () => {
  test("the note of Board 2 takes every figure from registro_grupos and says nothing without it", () => {
    const raw = { groups: new Array(346), registro_grupos: { total: 359, activos: 324, inactivos: 35, sin_productos_impactu: 13 } };
    expect(officialGroupsNote(raw.groups.length, groupRegistry(raw, false))).toBe("346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.");
    expect(groupRegistry({ groups: raw.groups }, false)).toBeNull();
  });
});

test.describe("F60 against the bundles of D-160 (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the three bundles carry the ETags of D-160", async () => {
    const etags = [];
    for (const n of [1, 2, 3]) etags.push((await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).headers.get("etag").replace(/"/g, ""));
    console.log(`[live] ETags: ${etags.join(" ")}`);
    expect(etags).toEqual(["20261107-5139c8508acb", "20261107-c7efe30b89e2", "20261107-72d119b00b79"]);
  });

  test("Board 2 shows the note with the figures of its bundle; Board 3 keeps its own", async ({ page }) => {
    const raw = await bundle(2);
    expect(raw.registro_grupos).toEqual({ total: 359, activos: 324, inactivos: 35, sin_productos_impactu: 13 });
    expect(raw.groups).toHaveLength(346);
    await page.goto("/observatories/vri-udea/board-2");
    await expect(page.getByTestId("official-groups-note")).toHaveText("346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.", { timeout: 120000 });
    await page.goto("/observatories/vri-udea/board-3");
    await expect(page.getByTestId("official-groups-note")).toHaveText("346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.", { timeout: 120000 });
  });

  test("Board 3 does not depend on the labels of PI states: 7 states, none read by name", async () => {
    const raw = await bundle(3);
    expect(raw.pi.estados).toEqual(["Concedido", "No aplica", "Patente en Dominio público", "Registrado", "Renovada", "Secreto transferido", "Vencida"]);
  });
});
