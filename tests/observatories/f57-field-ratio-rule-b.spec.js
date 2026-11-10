/*
 * F57 (D-153): ratio of capacity of a field or subfield with the rule (b): only the topics where the UdeA has
 * MIN_PRODUCTS_CLASSIFY or more products (2021–2025, with the active filters) add their citations (numerator) and their
 * referent (denominator); the cap of 1 is on the ratio; a field or subfield without any such topic has no ratio and
 * is «presencia puntual». The first block needs no server; the second reads the real quyca and the dev server of
 * Luis (D-100) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { CATEGORY, MIN_PRODUCTS_CLASSIFY, computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { NO_RATIO_TEXT, FIELD_RATIO_RULE, ratioTopicsText, withoutRatioNote } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

// facts: [topic, year, citations, type, quartile, access, facs, deps, centres, groups, subregions, ods, pairs, actors, record]
const fact = (topic, year, citations, facs = [0]) => [topic, year, citations, 0, 0, 0, facs, [], [0], [0], [], [], [], [], 1];
const topic = (id, f, sf) => ({ id, t: `Topic ${id}`, sf, f, d: "D", gm: 10, gw: 100, link: [] });
const times = (n, make) => Array.from({ length: n }, (_, i) => make(i));

/* Field F: TA (6 products, 10 citations each, 3 of them in unit 1), TB (3 products, 30 each), TC (1 product, 50). Field G: TD (2 products). */
const raw = {
  meta: {},
  topics: [topic("TA", "F", "S1"), topic("TB", "F", "S1"), topic("TC", "F", "S2"), topic("TD", "G", "S3")],
  facts: [
    ...times(6, (i) => fact(0, 2021 + (i % 5), 10, i < 3 ? [0] : [1])),
    ...times(3, (i) => fact(1, 2022 + i, 30)),
    fact(2, 2024, 50),
    ...times(2, (i) => fact(3, 2023 + i, 20)),
  ],
  ejes: [], groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0", "F1"], deps: [], subregiones: [], actores: [],
  inst_lider: ["Inst"],
  ref_nacional: [0, 1, 2, 3],
  // [topic, scope (0 world, 1 Colombia), institution, works, citations]
  ref_2125: [[0, 1, 0, 9, 120], [1, 1, 0, 9, 100], [2, 1, 0, 9, 100], [3, 1, 0, 9, 40], [0, 0, 0, 9, 200], [1, 0, 0, 9, 200], [2, 0, 0, 9, 200], [3, 0, 0, 9, 200]],
};
const ds = createDataset(raw);
const unit = (r, id) => r.units.find((u) => u.id === id);

test.describe("ratio of a field or subfield, rule (b) (no server)", () => {
  test("only the topics with 5 or more products add up, and the cap of 1 is on the ratio", () => {
    expect(MIN_PRODUCTS_CLASSIFY).toBe(5);
    const r = computeCapacity(ds, { dimension: "field" });
    const f = unit(r, "F");
    expect(f.products).toBe(10);
    expect(f.citations).toBe(60 + 90 + 50); // all the citations stay in the unit
    expect(f.ratioTopics).toBe(1); // only TA has 5 or more
    expect(f.ratioCitations).toBe(60);
    expect(f.leaderCitations).toBe(120);
    expect(f.ratio).toBeCloseTo(60 / 120, 6); // (a) would give (60 + 90 + 50) / (120 + 100 + 100) = 0.625
    expect(f.noRatio).toBe(false);
    // the cap is on the ratio, not on each topic: with a smaller referent it caps at 1
    const capped = createDataset({ ...raw, ref_2125: raw.ref_2125.map((x) => (x[0] === 0 && x[1] === 1 ? [0, 1, 0, 9, 40] : x)) });
    expect(unit(computeCapacity(capped, { dimension: "field" }), "F").ratio).toBe(1);
  });

  test("a subfield follows the same rule; the world referent too", () => {
    const r = computeCapacity(ds, { dimension: "subfield" });
    expect(unit(r, "S1").ratio).toBeCloseTo(60 / 120, 6); // TA yes, TB (3 products) no
    expect(unit(r, "S1").ratioTopics).toBe(1);
    const world = computeCapacity(ds, { dimension: "subfield", ratioBasis: "global" });
    expect(unit(world, "S1").ratio).toBeCloseTo(60 / 200, 6);
  });

  test("a field or subfield without any topic of 5 or more products has no ratio, says so and is «presencia puntual»", () => {
    for (const dimension of ["field", "subfield"]) {
      const r = computeCapacity(ds, { dimension });
      const none = r.units.filter((u) => u.noRatio);
      expect(none.map((u) => u.id).sort()).toEqual(dimension === "field" ? ["G"] : ["S2", "S3"]);
      for (const u of none) {
        expect(u.ratio).toBeNull();
        expect(u.ratioTopics).toBe(0);
        expect(u.category).toBe(CATEGORY.PUNCTUAL);
      }
      expect(r.unitsWithoutRatio).toBe(none.length);
      expect(Object.values(r.categoryCounts).reduce((a, b) => a + b, 0)).toBe(r.units.length);
    }
    expect(NO_RATIO_TEXT).toBe("Sin tópicos con 5 o más productos: no se calcula la razón");
  });

  test("the threshold is the constant (it can be overridden) and the active filters decide which topics count", () => {
    // threshold 3: TB enters too -> (60 + 90) / (120 + 100)
    const low = computeCapacity(ds, { dimension: "field" }, { thresholds: { minProducts: 3 } });
    expect(unit(low, "F").ratio).toBeCloseTo(150 / 220, 6);
    expect(unit(low, "F").ratioTopics).toBe(2);
    // each unit only has 3 of the 6 products of TA: with either filter no topic of F reaches 5
    for (const facultyIndex of [0, 1]) {
      const filtered = computeCapacity(ds, { dimension: "field", facultyIndex });
      expect(unit(filtered, "F").noRatio).toBe(true);
      expect(unit(filtered, "F").ratio).toBeNull();
    }
  });

  test("the topic level does not change", () => {
    const r = computeCapacity(ds);
    expect(r.unitsWithoutRatio).toBe(0);
    expect(unit(r, "TB").ratio).toBeCloseTo(90 / 100, 6);
    expect(unit(r, "TB").category).toBe(CATEGORY.PUNCTUAL);
    expect(unit(r, "TB").noRatio).toBe(false);
  });

  test("the texts take the threshold from the constant", () => {
    expect(FIELD_RATIO_RULE).toContain("5 o más productos");
    expect(ratioTopicsText(67)).toBe("en 67 tópicos con 5 o más productos");
    expect(ratioTopicsText(1)).toBe("en 1 tópico con 5 o más productos");
    expect(withoutRatioNote(43, "subcampos")).toContain("43 subcampos sin ningún tópico con 5 o más productos");
  });
});

test.describe("rule (b) against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let dataset;
  test.beforeAll(async () => {
    dataset = createDataset(await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json());
  });

  test("case Engineering (Colombia): rule (a) 2.970 products, 37.029 citations, 129.756, 0,285; rule (b) 130 topics, 33.894 over 100.072, 0,339", () => {
    const r = computeCapacity(dataset, { dimension: "field" });
    const eng = unit(r, "Engineering");
    const topics = r.topicUnits.filter((u) => u.field === "Engineering" && u.products > 0);
    const a = { products: topics.reduce((s, u) => s + u.products, 0), citations: topics.reduce((s, u) => s + u.citations, 0), leader: topics.reduce((s, u) => s + u.leaderCitations, 0), topics: topics.length };
    console.log(`[live] Engineering (a): ${a.products} products, ${a.citations} citations, ${a.topics} topics, denominator ${a.leader}, ratio ${(a.citations / a.leader).toFixed(3)}`);
    console.log(`[live] Engineering (b): ${eng.ratioTopics} topics, numerator ${eng.ratioCitations}, denominator ${eng.leaderCitations}, ratio ${eng.ratio.toFixed(3)}, category ${eng.category}`);
    expect(a).toEqual({ products: 2970, citations: 37029, leader: 129756, topics: 324 });
    expect(a.citations / a.leader).toBeCloseTo(0.285, 3);
    expect(eng.ratioTopics).toBe(130);
    expect(eng.ratioCitations).toBe(33894);
    expect(eng.leaderCitations).toBe(100072);
    expect(eng.ratio).toBeCloseTo(0.339, 3);
  });

  test("topic level (unchanged): tranches of the topics with 5 or more products, Colombia, no filters", () => {
    const r = computeCapacity(dataset);
    const big = r.units.filter((u) => u.windowTotal >= MIN_PRODUCTS_CLASSIFY);
    const t = [big.filter((u) => u.ratio > 0.75).length, big.filter((u) => u.ratio > 0.5 && u.ratio <= 0.75).length, big.filter((u) => u.ratio <= 0.5).length];
    console.log(`[live] topics with 5 or more products: ${big.length}; tranches >0,75 / 0,50–0,75 / ≤0,50: ${t.join(" / ")}`);
    expect(t.reduce((a, b) => a + b, 0)).toBe(big.length);
  });

  test("how many fields and subfields end up without ratio, Colombia and World, with and without a filter of unit", () => {
    const tranche = (r) => {
      const t = { high: 0, mid: 0, low: 0, none: 0 };
      for (const u of r.units) {
        if (u.windowTotal === 0) continue;
        else if (u.noRatio) t.none++;
        else if (u.ratio > 0.75) t.high++;
        else if (u.ratio > 0.5) t.mid++;
        else t.low++;
      }
      return t;
    };
    for (const ratioBasis of ["national", "global"]) {
      for (const [label, extra] of [["sin filtros", {}], ["unidad 0", { facultyIndex: 0 }]]) {
        for (const dimension of ["field", "subfield"]) {
          const r = computeCapacity(dataset, { dimension, ratioBasis, ...extra });
          const counts = Object.fromEntries(Object.entries(r.categoryCounts).filter(([, n]) => n));
          console.log(`[live] ${ratioBasis} · ${label} · ${dimension}: ${r.units.length} unidades, ${r.unitsWithoutRatio} sin razón, tramos ${JSON.stringify(tranche(r))}, categorías ${JSON.stringify(counts)}`);
          expect(r.unitsWithoutRatio).toBe(r.units.filter((u) => u.noRatio && u.windowTotal > 0).length);
          expect(r.unitsWithoutRatio).toBe(r.categoryCounts[CATEGORY.PUNCTUAL] - r.units.filter((u) => u.category === CATEGORY.PUNCTUAL && !u.noRatio).length);
          expect(r.units.filter((u) => u.windowTotal >= MIN_PRODUCTS_CLASSIFY && u.noRatio).every((u) => u.category === CATEGORY.PUNCTUAL)).toBe(true);
        }
      }
    }
  });

  test("the page explains the rule for fields and subfields and says how many have no ratio; topics show no such note", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1?dimension=subfield");
    const note = page.getByTestId("field-ratio-note");
    await expect(note).toBeVisible({ timeout: 120000 });
    const text = await note.innerText();
    console.log(`[live] note: ${text}`);
    expect(text).toContain("tiene 5 o más productos");
    expect(text).toContain("16 subcampos sin ningún tópico con 5 o más productos");
    await page.goto("/observatories/vri-udea/board-1?dimension=field");
    await expect(page.getByTestId("field-ratio-note")).not.toContainText("sin ningún tópico", { timeout: 120000 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("snapshot-note").first()).toBeVisible({ timeout: 120000 });
    await expect(page.getByTestId("field-ratio-note")).toHaveCount(0);
  });
});
