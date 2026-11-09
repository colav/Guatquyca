/*
 * F105 (D-232, B154 variant c, B156): the FWCI normalized by topic and year, from `facts[15]` (world mean citations per work of the topic in
 * the year of the work). The first block needs no server; the second (E2E_LIVE=1) reads the real bundle of B156 and compares the KPI with the
 * report of B154/B156 and the eleven samples of B154.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const base = (facts) => ({
  meta: {},
  topics: [{ id: "T1", t: "Topic 1", sf: "S", f: "F", d: "D", gm: 10, gw: 100, link: [] }],
  facts,
  ejes: [], groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [], ref_nacional: [0], inst_lider: ["Inst A"],
  ref_1025: [[0, 0, 0, 10, 120], [0, 1, 0, 10, 240]],
});
/* [topic, year, citations, type, quartile, access, [], [], [centre], [group], [], [], [], [], record, expected] */
const fact = (year, citations, record, expected) => [0, year, citations, 0, 0, 0, [0], [], [0], [0], [], [], [], [], record, ...(expected === undefined ? [] : [expected])];

test.describe("F105 FWCI normalized by topic and year (no server)", () => {
  test("with facts[15]: Σ citations ÷ Σ expected citations of the works with a record; the works without a record do not enter", () => {
    const facts = [fact(2012, 10, 1, 5), fact(2013, 6, 1, 2), fact(2014, 100, 0, 50), fact(2015, 0, 1, 3)];
    const ds = createDataset(base(facts));
    expect(ds.hasExpectedCitations).toBe(true);
    const r = computeCapacity(ds);
    expect(r.setFwci).toBeCloseTo(16 / 10, 9);
    expect(r.units[0].fwci).toBeCloseTo(16 / 10, 9);
  });

  test("without facts[15] the FWCI keeps the formula with the world mean of the topic (gm = 10)", () => {
    const facts = [fact(2012, 10, 1), fact(2013, 30, 1)];
    const ds = createDataset(base(facts));
    expect(ds.hasExpectedCitations).toBe(false);
    const r = computeCapacity(ds);
    expect(r.setFwci).toBeCloseTo(20 / 10, 9); // 20 citations per work over gm = 10
  });

  test("a topic whose expected citations add up to 0 has no FWCI (NaN), not Infinity", () => {
    const ds = createDataset(base([fact(2012, 5, 1, 0)]));
    const r = computeCapacity(ds);
    expect(Number.isNaN(r.units[0].fwci)).toBe(true);
    expect(r.setFwci).toBe(0);
  });
});

/* Column (c) of B154, 2010–2025, Colombia, products with a record. facts[15] has two decimals, so a tolerance of 0,03. */
const SAMPLES = {
  "Graph theory and applications": 1.84,
  "SARS-CoV-2 and COVID-19 Research": 2.64,
  "Particle physics theoretical and experimental studies": 3.12,
  "Latin American Literature Analysis": 1.54,
  "Advanced oxidation water treatment": 1.02,
  "Mathematics Education and Teaching Techniques": 2.25,
  "Fungal Infections and Studies": 2.49,
  "Venomous Animal Envenomation and Studies": 1.67,
  "COVID-19 Clinical Research Studies": 2.44,
  "Wind Energy Research and Development": 0.98,
  "Education during COVID-19 pandemic": 0.56,
};

test.describe("F105 against the bundle of B156 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("ETag of B156, KPI of 1,56 (default years) and 1,62 (2021–2025) and the eleven samples of B154 (c)", async () => {
    test.setTimeout(200000);
    const res = await fetch(`${API}/observatories/vri-udea/boards/1/bundle`, { headers: { "Accept-Encoding": "gzip" } });
    expect(res.headers.get("etag")).toBe('"20261107-5139c8508acb"');
    const raw = await res.json();
    expect(raw.facts[0]).toHaveLength(16);
    const ds = createDataset(raw);
    expect(ds.hasExpectedCitations).toBe(true);
    const all = computeCapacity(ds, { dimension: "topic" });
    const recent = computeCapacity(ds, { dimension: "topic", yearFrom: 2021, yearTo: 2025 });
    const wide = computeCapacity(ds, { dimension: "topic", yearFrom: 2010, yearTo: 2025 });
    console.log(`[live] KPI default years ${all.setFwci.toFixed(3)} (${all.filters.yearFrom}–${all.filters.yearTo}), 2010–2025 ${wide.setFwci.toFixed(3)}, 2021–2025 ${recent.setFwci.toFixed(3)}`);
    expect(wide.setFwci).toBeGreaterThan(1.53);
    expect(wide.setFwci).toBeLessThan(1.59);
    expect(recent.setFwci).toBeGreaterThan(1.59);
    expect(recent.setFwci).toBeLessThan(1.65);
    const rows = [];
    for (const [name, expected] of Object.entries(SAMPLES)) {
      const unit = wide.units.find((u) => u.label === name);
      expect(unit, name).toBeTruthy();
      rows.push(`${name}: ${unit.fwci.toFixed(2)} (B154 c: ${expected.toFixed(2)})`);
      expect(Math.abs(unit.fwci - expected), name).toBeLessThanOrEqual(0.03);
    }
    console.log(`[live] samples\n${rows.join("\n")}`);
  });
});
