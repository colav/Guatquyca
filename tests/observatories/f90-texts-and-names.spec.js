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

import { pieNote } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

test.describe("Q-06 and Q-07 texts (no server)", () => {
  test("the note of the pie of classes has no working phrase", () => {
    const note = pieNote(1234);
    expect(note).toContain("1.234 preprints");
    expect(note).not.toContain("Gabriel");
    expect(note).not.toContain("composición final");
  });
});

import * as texts1 from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import * as texts2 from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import * as texts3 from "../../app/observatories/vri-udea/board-3/components/boardTexts";

/* Q-09 and Q-14: nothing the reader sees names a file, a sheet, a table, a column or says «thesaurus». */
const FORBIDDEN = /BD_Grupos|\.xlsx|\.csv|\bCSV\b|work_authors|work_groups|work_topics|instituciones_coautoras|ListadoProyectos|Tablero\d?_data|consultasol|\bworks\b|Res-Finales|ClickHouse|\bhojas?\b|obs_|topicos_openalex/i;

function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

test.describe("Q-09: no file, sheet, table or column in the texts (no server)", () => {
  for (const [name, mod] of [["Board 1", texts1], ["Board 2", texts2], ["Board 3", texts3]]) {
    test(`${name}: the exported texts`, () => {
      const found = strings(Object.values(mod)).filter((s) => !s.startsWith("http") && FORBIDDEN.test(s));
      expect(found.map((s) => s.slice(0, 90))).toEqual([]);
    });
  }

  test("functions that build texts", () => {
    const built = [
      texts3.linkageNote({ personas: 100, por_vinculacion: { Regular: 10, Ocasional: 5 } }),
      texts3.pieNote(5),
      texts2.smallSampleNote ? texts2.smallSampleNote(3) : "",
    ];
    expect(built.filter((s) => FORBIDDEN.test(s))).toEqual([]);
    expect(texts3.linkageNote({ personas: 100, por_vinculacion: { Regular: 10 } })).toContain("El registro de grupos de la convocatoria 894 incluye 100 personas");
  });

  test("the sources are explained once in the method text: SIIU and SCIENTI in one sentence each (provisional)", () => {
    const method = [texts2.FOOTER_TEXT, texts2.REAL_FOOTER_TEXT, texts3.FOOTER_TEXT, texts3.REAL_FOOTER_TEXT].filter(Boolean);
    expect(method.length).toBeGreaterThan(0);
    for (const m of method) {
      expect(m).toContain("SIIU: sistema donde la Universidad registra oficialmente sus proyectos.");
      expect(m.split("SIIU: sistema").length - 1).toBe(1);
    }
  });
});

test.describe("Q-11 note of the panel 16 (page, one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the note says that the topic is the main one of OpenAlex v2 and why it does not match the artifact", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const card = page.getByTestId("chart-card").filter({ hasText: "16 · Conjuntos de datos abiertos por tópico" }).first();
    await card.waitFor({ timeout: 120000 });
    await expect(card).toContainText("El tópico de cada conjunto es el principal de OpenAlex v2; por eso no coincide con el del artefacto de Gabriel.");
    await expect(card).toContainText("119 de los 406 conjuntos de datos tienen año 2026");
  });
});
