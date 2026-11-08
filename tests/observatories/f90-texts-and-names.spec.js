/*
 * F90 (D-202): texts and names. The first block needs no server; the second (E2E_LIVE=1) reads the bundles of B144 and the pages.
 * No screenshots are saved. Q-15 names of the funders; Q-06, Q-07, Q-09, Q-11, Q-14: texts.
 */
import { test, expect } from "@playwright/test";

import { funderRows } from "../../lib/observatories/funderRows";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("Q-15 names of the funders (no server)", () => {
  const funders = [
    { nm: "Hospital Alma Mater de Antioquia ", fsector: 1, proyectos: 34 },
    { nm: "Minciencias", fsector: 2, proyectos: 20 },
  ];

  test("the normalised name is the label; the original of ext.nombres_originales goes in the tooltip, only when it differs", () => {
    const rows = funderRows(funders, { "Hospital Alma Mater de Antioquia": "HOSPITAL ALMA MATER DE ANTIOQUIA", Minciencias: "Minciencias" }, (f) => `S${f.fsector}`);
    expect(rows[0]).toEqual({ label: "Hospital Alma Mater de Antioquia", detail: "HOSPITAL ALMA MATER DE ANTIOQUIA", detailName: "Nombre original", segments: [{ series: "S1", value: 34 }] });
    expect(rows[1].detail).toBeUndefined();
  });

  test("a bundle without ext.nombres_originales still draws", () => {
    expect(funderRows(funders, undefined, () => "S")).toHaveLength(2);
  });
});

test.describe("B144 bundles (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("ETags of B144, original names of the funders and the label of Artes in the T3", async ({ request }) => {
    test.setTimeout(120000);
    const t = {};
    for (const n of [1, 2, 3]) {
      const r = await request.get(`${API}/observatories/vri-udea/boards/${n}/bundle`);
      t[n] = { etag: r.headers().etag, body: await r.json() };
    }
    console.log(`[live] ETags ${t[1].etag} ${t[2].etag} ${t[3].etag}`);
    expect(t[1].etag).toBe('"20261107-812ab23f70b7"');
    expect(t[2].etag).toBe('"20261107-ca007b23bb20"');
    expect(t[3].etag).toBe('"20261107-c97503a60029"');
    const b2 = t[2].body.data || t[2].body;
    const originals = b2.ext.nombres_originales;
    const shown = b2.ext.funders.map((f) => f.nm.trim());
    const withOriginal = shown.filter((n) => originals[n]);
    console.log(`[live] funders ${shown.length}; with an original name in the tooltip ${withOriginal.length}; entries of nombres_originales ${Object.keys(originals).length}`);
    expect(originals["Hospital Alma Mater de Antioquia"]).toBe("HOSPITAL ALMA MATER DE ANTIOQUIA");
    expect(withOriginal.length).toBeGreaterThan(5);
    const b3 = t[3].body.data || t[3].body;
    expect(Object.keys(b3.artes.fac_creacion)).toContain("Sin grupo registrado");
    expect(Object.keys(b3.artes.fac_creacion).join("|")).not.toContain("BD_Grupos");
  });
});
