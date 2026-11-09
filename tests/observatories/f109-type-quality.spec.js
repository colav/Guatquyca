/*
 * F109 (D-244): the open warning «puede haber errores» about the type of the organizations is replaced by the share of each origin,
 * computed from `calidad_tipo` of the bundle (B161). The first block needs no server; the second (E2E_LIVE=1) reads the real bundles and
 * the three boards: the sentence of the button (i) of the panel 9 of the T1, 3 of the T2 and 11 of the T3, and no open «errores» anywhere.
 */
import { test, expect } from "@playwright/test";

import { QUALITY_FALLBACK, typeQualityText, withQuality } from "../../lib/observatories/typeQuality";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const q = (a, r, s, n, t) => ({ institucional: { organizaciones: a }, revision_asistida: { organizaciones: r }, solo_nombre: { organizaciones: s }, sin_clasificar: { organizaciones: n }, total: { organizaciones: t } });

test.describe("F109 quality of the type (no server)", () => {
  test("the sentence gives first the reliable share and then the rest; whole numbers when they add 100, one decimal otherwise", () => {
    expect(typeQualityText(q(3551, 236, 1020, 102, 4909), "organizaciones no académicas")).toBe(
      "El 77 % de las 4.909 organizaciones no académicas se clasificó con ROR, OpenAlex, el catálogo revisado de la Universidad o revisión manual; el 21 %, con reglas de detección sobre el nombre, y en ese grupo puede haber algunos errores. El 2 % restante no tiene clasificación.",
    );
    expect(typeQualityText(q(6595, 294, 1085, 102, 8076), "instituciones coautoras")).toContain("El 85,3 % de las 8.076 instituciones coautoras");
    expect(typeQualityText(q(6595, 294, 1085, 0, 7974), "instituciones")).not.toContain("restante");
  });

  test("without the key the text has no figure and no open «errores»", () => {
    expect(typeQualityText(null, "x")).toBeNull();
    expect(typeQualityText({ total: { organizaciones: 0 } }, "x")).toBeNull();
    expect(QUALITY_FALLBACK).not.toMatch(/errores|\d/);
    const entry = withQuality({ what: "a", care: ["{calidad} Resto.", "b"] }, null);
    expect(entry.care[0]).toBe(`${QUALITY_FALLBACK} Resto.`);
    expect(withQuality({ care: "{calidad}" }, "Frase.").care).toBe("Frase.");
  });
});

test.describe("F109 quality of the type against the real bundles (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the three bundles carry calidad_tipo and the shares add 100 %", async () => {
    const get = async (n) => (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`, { headers: { "Accept-Encoding": "gzip" } })).json();
    const [b1, b2, b3] = await Promise.all([get(1), get(2), get(3)]);
    const rows = [["T1 panel de actores", b1.obs.calidad_tipo.no_academicas, "organizaciones no académicas"], ["T2", b2.ext.calidad_tipo, "instituciones coautoras"], ["T3", b3.ext.calidad_tipo, "instituciones coautoras"]];
    const lines = [];
    for (const [name, quality, noun] of rows) {
      const parts = ["institucional", "revision_asistida", "solo_nombre", "sin_clasificar"].map((k) => quality[k].organizaciones);
      expect(parts.reduce((a, b) => a + b, 0), name).toBe(quality.total.organizaciones);
      const text = typeQualityText(quality, noun);
      expect(text, name).toMatch(/^El \d+(,\d)? % de las /);
      lines.push(`${name}: ${text}`);
    }
    console.log(`[live]\n${lines.join("\n")}`);
  });

  test("the buttons (i) of the panels 9 (T1), 3 (T2) and 11 (T3) carry the quantified sentence; no board writes an open «puede haber errores»", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const targets = [[1, /^9 · Actores/, "organizaciones no académicas"], [2, /^3 · Organizaciones/, "instituciones coautoras"], [3, /^11 · Profesores con productos compartidos con empresas/, "instituciones coautoras"]];
    for (const [board, title, noun] of targets) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      const card = page.getByTestId("chart-card").filter({ hasText: title }).first();
      await card.waitFor({ timeout: 120000 });
      await page.waitForTimeout(2500);
      await expect(card).not.toContainText(/puede haber errores|puede tener errores/);
      await card.getByTestId("panel-info").click();
      const care = page.getByTestId("panel-info-care").last();
      await expect(care).toContainText("se clasificó con ROR, OpenAlex, el catálogo revisado de la Universidad o revisión manual");
      await expect(care).toContainText("con reglas de detección sobre el nombre, y en ese grupo puede haber algunos errores");
      await expect(care).toContainText(noun);
      await expect(care).not.toContainText(/NaN|undefined/);
      await page.keyboard.press("Escape");
      const body = await page.locator("body").innerText();
      expect(body, `T${board} page`).not.toMatch(/puede haber errores|puede tener errores|puede equivocarse|es heurística/);
    }
  });
});
