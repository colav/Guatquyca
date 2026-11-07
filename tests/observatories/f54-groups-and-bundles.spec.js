/*
 * F54 (D-150, D-152): figures of groups from the bundle, tooltip of the tag «Por productos» and reload with the final
 * bundles (T1 20261106-88204812c595, T2 20261106-2afc9ab53e0d, T3 20261106-e028d9fadea2). The first block needs no
 * server; the second reads the real quyca and the dev server of Luis and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { groupRegistry, officialActiveGroupsNote, officialGroupsNote } from "../../lib/observatories/officialGroups";
import { AXIS_LINK_BY_PRODUCTS_HELP } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n, query = "") => `/observatories/vri-udea/board-${n}${query ? `?${query}` : ""}`;
const bundle = async (n) => (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();

test.describe("F54 texts (no server)", () => {
  test("the note of the groups takes every figure from the registry of the bundle", () => {
    const registry = groupRegistry({ groups: new Array(346), registro_grupos: { total: 359, activos: 324, inactivos: 35, sin_productos_impactu: 13 } }, false);
    expect(officialGroupsNote(346, registry)).toBe("346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.");
  });

  test("the tooltip of «Por productos» is the text of the order", () => {
    expect(AXIS_LINK_BY_PRODUCTS_HELP).toBe(
      "Estos productos no tienen como tópico principal ninguno de los tópicos del eje, pero alguno de sus tópicos secundarios sí pertenece al eje. Nuestra metodología, leyendo su título y resumen, los asignó al eje. Solo se cuentan los de confianza alta y media (los de confianza baja no se muestran por defecto). Por eso aparecen en las tarjetas del eje y no en los tópicos de arriba, y su suma con la tabla coincide con las tarjetas. Siguen los filtros activos, incluido el de años.",
    );
    expect(AXIS_LINK_BY_PRODUCTS_HELP).not.toMatch(/\bIA\b/);
  });
});

test.describe("F54 against the final bundles (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the three bundles carry the final ETags", async () => {
    const etags = [];
    for (const n of [1, 2, 3]) etags.push((await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).headers.get("etag"));
    console.log(`[live] ETags: ${etags.join(" ")}`);
    expect(etags.map((e) => e.replace(/"/g, ""))).toEqual(["20261107-812ab23f70b7", "20261107-78ed7ef6b631", "20261107-1d2cef7970ed"]); // B128 (D-180)
  });

  test("Board 3: the note says 346 de 359 and 13 from the bundle, and the centres add up", async ({ page }) => {
    const raw = await bundle(3);
    expect(raw.registro_grupos).toEqual({ total: 359, activos: 324, inactivos: 35, sin_productos_impactu: 13 });
    expect(raw.groups).toHaveLength(346);
    await page.goto(BOARD(3));
    await expect(page.getByTestId("official-groups-note")).toHaveText("346 de 359 grupos de investigación tienen productos en ImpactU; 13 no.", { timeout: 120000 });
    const perCenter = {};
    for (const g of raw.groups) perCenter[g[4]] = (perCenter[g[4]] || 0) + 1;
    expect([perCenter.Exactas, perCenter["Educación"], perCenter.Sociales, perCenter["Ingeniería"]]).toEqual([53, 20, 21, 35]);
    expect(Object.values(perCenter).reduce((a, b) => a + b, 0)).toBe(346);
    // A chosen centre shows its active groups (the grid counts the active ones of the list), read by name.
    for (const name of ["Exactas", "Educación", "Sociales", "Ingeniería"]) {
      const active = raw.groups.filter((g) => g[4] === name && g[6] === "Activo").length;
      await page.goto(BOARD(3, `center=${raw.centros.indexOf(name)}`));
      const note = page.getByText(`grupos activos del centro ${name}`, { exact: false }).first();
      // The panel settles after the first paint: wait for the expected figure instead of reading once.
      await expect(note).toHaveText(new RegExp(`^${active} grupos activos del centro ${name}`), { timeout: 120000 });
      console.log(`[live] centre ${name}: ${active} active groups in the panel (${perCenter[name]} in the list)`);
    }
  });

  test("Board 3: panel 8 shows the breakdown of theses by subtype, read by name", async ({ page }) => {
    const raw = await bundle(3);
    expect(raw.tesis_sub).toEqual(["", "doctorado", "maestria", "maestria_esp_clinica", "especializacion", "pregrado", "otra"]);
    await page.goto(BOARD(3));
    const note = page.getByText(/tesis de doctorado, .* de maestría o especialidad clínica y .* monografías de especialización/);
    await expect(note).toBeVisible({ timeout: 120000 });
    const text = await note.innerText();
    console.log(`[live] panel 8: ${text.slice(0, 140)}`);
    expect(text).toContain("2.360 tesis de doctorado");
    expect(text).toContain("9.102 de maestría o especialidad clínica"); // 6.313 + 2.789
    expect(text).toContain("940 monografías");
  });

  test("Board 2: 170 of 170 countries have coordinates and «Instituto de Filosofía» is chosen by name, not by position", async ({ page }) => {
    const raw = await bundle(2);
    const withCoordinates = raw.countries.filter((c) => c.ll).length;
    console.log(`[live] countries: ${withCoordinates} of ${raw.countries.length} with coordinates`);
    expect(raw.countries).toHaveLength(170);
    expect(withCoordinates).toBe(170);
    const at = raw.facs.indexOf("Instituto de Filosofía");
    console.log(`[live] «Instituto de Filosofía» is at index ${at} (position ${at + 1}) of ${raw.facs.length} units`);
    expect(at).toBeGreaterThanOrEqual(0);
    await page.goto(BOARD(2, `faculty=${at}`));
    await expect(page.getByTestId("filters-toggle")).toBeVisible({ timeout: 120000 });
    await page.getByTestId("filters-toggle").click();
    await expect(page.getByTestId("filters-folded-tags")).toContainText("Unidad: Instituto de Filosofía", { timeout: 60000 });
    await expect(page.getByText("en el mapa porque no tienen coordenadas", { exact: false })).toHaveCount(0);
  });
});
