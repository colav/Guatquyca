/*
 * F95 (Q-31, D-211): the last note of «Notas metodológicas» lists the sources of each board with the real date of `fuentes` of GET /cut
 * (B148), and the ETags of B147. The first block needs no server; the second (E2E_LIVE=1) reads the API and the pages in one run.
 */
import { test, expect } from "@playwright/test";

import { longDate, sourceLines } from "../../lib/observatories/cutSources";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const SOURCES = [
  { clave: "impactu", nombre: "ImpactU", fecha_corte: "2026-10-16", detalle: "Extraído del 4 al 16 de octubre de 2026.", tableros: [1, 2, 3] },
  { clave: "ods", nombre: "ODS", fecha_corte: "2026-11-04", detalle: "x", tableros: [1] },
  { clave: "registro_grupos", nombre: "Registro de grupos", fecha_corte: "", detalle: "Categoría de la convocatoria 957 de 2023; el archivo no declara día de corte.", tableros: [1, 2, 3] },
  { clave: "planta", nombre: "Planta de personal", fecha_corte: "2026-05-30", detalle: "y", tableros: [3] },
];

test.describe("F95 sources of the last note (no server)", () => {
  test("long date from the ISO text, with no time zone", () => {
    expect(longDate("2026-11-06")).toBe("6 de noviembre de 2026");
    expect(longDate("2025-07-03")).toBe("3 de julio de 2025");
    expect(longDate("")).toBe("");
    expect(longDate("2026-13-01")).toBe("");
    expect(longDate(undefined)).toBe("");
  });

  test("a board lists only its sources, in the order of the API; the one without a date says its detail and no date is made up", () => {
    expect(sourceLines(SOURCES, 1)).toEqual([
      "ImpactU: 16 de octubre de 2026",
      "ODS: 4 de noviembre de 2026",
      "Registro de grupos: Categoría de la convocatoria 957 de 2023; el archivo no declara día de corte.",
    ]);
    expect(sourceLines(SOURCES, 3).join(" ")).toContain("Planta de personal: 30 de mayo de 2026");
    expect(sourceLines(SOURCES, 2).join(" ")).not.toContain("ODS");
  });

  test("without `fuentes` there is nothing to list (the fixed text stays)", () => {
    expect(sourceLines(undefined, 1)).toEqual([]);
    expect(sourceLines([], 1)).toEqual([]);
    expect(sourceLines(null, 2)).toEqual([]);
  });
});

test.describe("F95 against the API and the pages (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("ETags of B147 and the sources of /cut", async ({ request }) => {
    const etags = [];
    for (const n of [1, 2, 3]) etags.push((await request.get(`${API}/observatories/vri-udea/boards/${n}/bundle`)).headers().etag);
    console.log(`[live] ETags ${etags.join(" ")}`);
    expect(etags).toEqual(['"20261107-812ab23f70b7"', '"20261107-bc9607aca85c"', '"20261107-c97503a60029"']);
    const cut = (await (await request.get(`${API}/observatories/vri-udea/cut`)).json()).data;
    expect(cut.fuentes).toHaveLength(11);
    expect(cut.texto).toBe("Datos consultados en octubre de 2026.");
  });

  test("each board shows the sources of its list with the dates of the API, and no date of loading", async ({ page, request }) => {
    test.setTimeout(250000);
    const cut = (await (await request.get(`${API}/observatories/vri-udea/cut`)).json()).data;
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const board of [1, 2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      const box = page.getByTestId("cut-sources");
      await box.waitFor({ timeout: 120000 });
      const shown = await box.locator("ul > li").allInnerTexts();
      const expected = sourceLines(cut.fuentes, board);
      console.log(`[live] Board ${board}: ${shown.length} sources; first «${shown[0]}»; without date: ${shown.filter((s) => !/\d{4}$/.test(s)).length}`);
      expect(shown.map((s) => s.replace(/\s+/g, " ").trim())).toEqual(expected);
      const all = await page.getByTestId("method-notes").innerText();
      expect(all).not.toContain("7 de noviembre");
      expect(all).not.toContain("Datos consultados en octubre de 2026.");
    }
  });
});
