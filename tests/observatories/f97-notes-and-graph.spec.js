/*
 * F97 (D-216): the notes of the three boards say each datum once (the list «Fuentes y fechas de corte» keeps the sources and dates; the
 * prose keeps only the definitions), a source with an empty `detalle` shows only its name and date, and the graph D has faint hulls.
 */
import { test, expect } from "@playwright/test";

import { sourceLines } from "../../lib/observatories/cutSources";
import { REAL_FOOTER_TEXT as FOOT2, realNotes } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { REAL_FOOTER_TEXT as FOOT3, methodNotes, REAL_STAFF_LABEL } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

test.describe("F97 notes without duplicates (no server)", () => {
  test("a source with empty detail and no date shows only its name; with a date, the date; without a date, its detail", () => {
    const lines = sourceLines(
      [
        { nombre: "Productos de creación", fecha_corte: "", detalle: "", tableros: [3] },
        { nombre: "Propiedad intelectual", fecha_corte: "", detalle: "Cubre 2011-2025.", tableros: [3] },
        { nombre: "Planta", fecha_corte: "2026-05-30", detalle: "Planta con fecha de referencia 30 de mayo de 2026.", tableros: [3] },
      ],
      3,
    );
    expect(lines).toEqual(["Productos de creación", "Propiedad intelectual: Cubre 2011-2025.", "Planta: 30 de mayo de 2026"]);
    expect(lines.some((l) => /:\s*$/.test(l))).toBe(false);
  });

  test("the prose of T2 and T3 no longer lists the sources, and keeps only definitions", () => {
    for (const foot of [FOOT2, FOOT3]) {
      expect(foot).not.toMatch(/^Fuentes:/);
      expect(foot).not.toMatch(/ImpactU|OpenAlex|3 de julio|30 de mayo/);
      expect(foot).toContain("SIIU:");
    }
    expect(FOOT3).toContain("ScienTI:");
    expect(FOOT3).toContain("Población de Antioquia");
  });

  test("the definition of «profesores» is said once in T3 and the sector rule once in T2 and T3", () => {
    const t3 = [FOOT3, ...methodNotes(REAL_STAFF_LABEL)].join(" ");
    expect(t3.match(/profesores son/gi)).toHaveLength(1);
    expect(t3.match(/incluye estudiantes/g)).toHaveLength(1);
    expect(t3.match(/3 de julio de 2025/g)).toBeNull();
    const t2 = [FOOT2, ...realNotes({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 1, appropriation: 2 })].join(" ");
    expect(t2.match(/reglas sobre el nombre/g)).toHaveLength(1);
    expect(t2.match(/no tienen año/g)).toHaveLength(1);
    expect(t3.match(/reglas sobre su nombre/g)).toHaveLength(1);
  });
});

test.describe("F97 live (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real servers.");

  for (const board of [1, 2, 3]) {
    test(`T${board}: the footer prose does not repeat the list of sources`, async ({ page }) => {
      await page.goto(`${BASE}/observatories/vri-udea/board-${board}`, { waitUntil: "domcontentloaded" });
      const notes = page.getByTestId("method-notes");
      await expect(notes).toBeVisible({ timeout: 90000 });
      await expect(page.getByTestId("cut-sources")).toBeVisible({ timeout: 30000 });
      const body = await page.locator("body").innerText();
      expect(body.match(/Fuentes:/g) ?? []).toHaveLength(0);
      expect(body.match(/Fuentes y fechas de corte/g)).toHaveLength(1);
      const sources = await page.getByTestId("cut-sources").innerText();
      expect(sources).not.toMatch(/encabezado|propiedades|no declara|nombre del archivo|nombre de la hoja/i);
      expect(sources.split("\n").slice(1).some((l) => /:\s*$/.test(l))).toBe(false);
    });
  }
});
