/* Unit tests of the capacity model of D-121 and D-122 (pure functions; no browser, no server). */
import { test, expect } from "@playwright/test";

import {
  CATEGORY,
  CATEGORY_ORDER,
  MIN_PRODUCTS_CLASSIFY,
  MIN_TREND_VOLUME,
  TREND,
  TREND_BAND,
  categoryByCapacity,
  computeCapacity,
  createDataset,
  trendByBand,
} from "../../lib/observatories/capacity";
import { parseFilters } from "../../lib/observatories/filters";

test.describe("trendByBand (slope over the mean, band ±10 %)", () => {
  test("no production in the window is none", () => {
    expect(trendByBand([0, 0, 0, 0, 0])).toBe(TREND.NONE);
  });
  test("increasing above +10 %, decreasing below -10 %, stable in between", () => {
    expect(TREND_BAND).toBe(0.1);
    expect(trendByBand([1, 2, 5, 4, 5])).toBe(TREND.INCREASING); // slope 1.0, mean 3.4 -> +29 %
    expect(trendByBand([5, 4, 3, 2, 1])).toBe(TREND.DECREASING);
    expect(trendByBand([4, 4, 4, 4, 4])).toBe(TREND.STABLE);
    // slope 0.1 over mean 4 is +2.5 %: stable. A fall in one year does not make it decreasing any more.
    expect(trendByBand([4, 3, 4, 5, 4])).toBe(TREND.STABLE);
  });
  test("the edge of the band is exclusive", () => {
    // [8, 9, 10, 11, 12]: slope 1, mean 10 -> exactly +10 %: stable (needs to be above)
    expect(trendByBand([8, 9, 10, 11, 12])).toBe(TREND.STABLE);
    expect(trendByBand([8, 9, 10, 11, 12.1])).toBe(TREND.INCREASING);
  });
});

test.describe("categoryByCapacity (the eight categories of D-122 and D-138)", () => {
  const cat = (trend, ratio, products = 12) => categoryByCapacity({ products, trend, ratio });
  test("increasing or stable trend", () => {
    for (const trend of [TREND.INCREASING, TREND.STABLE]) {
      expect(cat(trend, 1)).toBe(CATEGORY.LEADER);
      expect(cat(trend, 0.99)).toBe(CATEGORY.CONSOLIDATED);
      expect(cat(trend, 0.76)).toBe(CATEGORY.CONSOLIDATED);
      expect(cat(trend, 0.75)).toBe(CATEGORY.CONSOLIDATING); // > 0.75 is exclusive
      expect(cat(trend, 0.51)).toBe(CATEGORY.CONSOLIDATING);
    }
  });
  test("ratio up to 0.50: emerging if increasing, low capacity if stable", () => {
    expect(cat(TREND.INCREASING, 0.5)).toBe(CATEGORY.EMERGING); // > 0.50 is exclusive
    expect(cat(TREND.INCREASING, 0.1)).toBe(CATEGORY.EMERGING);
    expect(cat(TREND.INCREASING, 0.25)).toBe(CATEGORY.EMERGING); // the 0.25 of the old model is not used
    expect(cat(TREND.STABLE, 0.5)).toBe(CATEGORY.LOW_CAPACITY);
    expect(cat(TREND.STABLE, 0)).toBe(CATEGORY.LOW_CAPACITY);
  });
  test("decreasing trend: at risk above 0.50, low capacity otherwise (also with ratio 1)", () => {
    expect(cat(TREND.DECREASING, 1)).toBe(CATEGORY.AT_RISK);
    expect(cat(TREND.DECREASING, 0.51)).toBe(CATEGORY.AT_RISK);
    expect(cat(TREND.DECREASING, 0.5)).toBe(CATEGORY.LOW_CAPACITY);
  });
  test("fewer than 5 products is punctual presence, not classified by ratio or trend; 5 or more classify", () => {
    expect(MIN_PRODUCTS_CLASSIFY).toBe(5);
    expect(cat(TREND.INCREASING, 1, 1)).toBe(CATEGORY.PUNCTUAL); // one product with ratio 1,00 is not a leader
    expect(cat(TREND.INCREASING, 0.1, 4)).toBe(CATEGORY.PUNCTUAL); // four products growing are not emerging
    expect(cat(TREND.DECREASING, 1, 3)).toBe(CATEGORY.PUNCTUAL); // nor at risk
    expect(cat(TREND.STABLE, 0, 2)).toBe(CATEGORY.PUNCTUAL);
    expect(cat(TREND.INCREASING, 1, 5)).toBe(CATEGORY.LEADER); // five products classify
    expect(cat(TREND.INCREASING, 0.1, MIN_PRODUCTS_CLASSIFY)).toBe(CATEGORY.EMERGING);
    expect(cat(TREND.NONE, 1, 0)).toBe(CATEGORY.NONE); // 0 products is still «sin producción»
    // the threshold comes from the constant, and it can be overridden
    expect(categoryByCapacity({ products: MIN_PRODUCTS_CLASSIFY - 1, trend: TREND.INCREASING, ratio: 1 })).toBe(CATEGORY.PUNCTUAL);
    expect(categoryByCapacity({ products: 3, trend: TREND.INCREASING, ratio: 1 }, { minProducts: 3 })).toBe(CATEGORY.LEADER);
  });
  test("no production, and a non-finite ratio counts as 0; there is no 'sin categoría'", () => {
    expect(cat(TREND.NONE, 1, 0)).toBe(CATEGORY.NONE);
    expect(cat(TREND.INCREASING, NaN)).toBe(CATEGORY.EMERGING);
    expect(CATEGORY_ORDER).toEqual([CATEGORY.LEADER, CATEGORY.CONSOLIDATED, CATEGORY.CONSOLIDATING, CATEGORY.EMERGING, CATEGORY.AT_RISK, CATEGORY.LOW_CAPACITY, CATEGORY.PUNCTUAL, CATEGORY.NONE]);
    expect(CATEGORY_ORDER).not.toContain(CATEGORY.UNCATEGORIZED);
  });
});

test.describe("computeCapacity with leaders and OpenAlex mark (synthetic bundle)", () => {
  // Two topics. T1: UdeA cites 100 in the window, the leader cites 100 in the world and 400 in Colombia.
  // T2: no national reference, UdeA cites 60 and the world leader 100.
  const fact = (topic, year, citations, record) => [topic, year, citations, 0, 0, 0, [0], [], [0], [0], [], [], [], [], record];
  const raw = {
    meta: {},
    topics: [
      { id: "T1", t: "Topic 1", sf: "S1", f: "F1", d: "D", gm: 10, gw: 100, link: [] },
      { id: "T2", t: "Topic 2", sf: "S1", f: "F1", d: "D", gm: 20, gw: 300, link: [] },
    ],
    facts: [
      // T1: 12 works in the window growing 1,2,3,3,3 (citations 100 in total), 2 of them without record
      ...[[2021, 1], [2022, 2], [2023, 3], [2024, 3], [2025, 3]].flatMap(([y, n], k) =>
        Array.from({ length: n }, (_, j) => fact(0, y, k === 0 && j === 0 ? 40 : 15, k === 4 && j < 2 ? 0 : 1)),
      ),
      // T1 in 2015 (outside the window)
      fact(0, 2015, 5, 1),
      // T2: 5 works (two in 2021, then 2022 to 2024, nothing in 2025), 12 citations each
      fact(1, 2021, 12, 1), fact(1, 2021, 12, 1), fact(1, 2022, 12, 1), fact(1, 2023, 12, 1), fact(1, 2024, 12, 1),
    ],
    ejes: [],
    groups: [["G0", "Grupo 0", "A1"]],
    cens: ["C0"],
    facs: ["F0"],
    deps: [],
    subregiones: [],
    actores: [],
    // [topic, scope (0 world, 1 Colombia), year, institution, works, citations]
    lideres: [
      [0, 0, 2021, 0, 5, 50], [0, 0, 2022, 0, 5, 50], [0, 1, 2021, 1, 5, 200], [0, 1, 2022, 1, 5, 200],
      [1, 0, 2021, 2, 5, 50], [1, 0, 2022, 2, 5, 50],
    ],
    ref_nacional: [0],
    inst_lider: ["Inst A", "Inst B", "Inst C"],
    // Single referent of 2021–2025 [topic, scope, institution, works, citations] (B106, D-133): different from the sums above on purpose.
    ref_2125: [[0, 0, 0, 10, 120], [0, 1, 1, 10, 300], [1, 0, 2, 10, 100]],
  };
  const dataset = createDataset(raw);
  const unit = (r, id) => r.units.find((u) => u.id === id);

  test("the model applies only with leaders and the OpenAlex mark", () => {
    expect(dataset.hasCapacityModel).toBe(true);
    expect(computeCapacity(dataset).model).toBe("capacity");
    // with the single referent of 2021–2025 the yearly leaders are not needed (B107 removes them from the bundle)
    expect(createDataset({ ...raw, lideres: undefined }).hasCapacityModel).toBe(true);
    expect(createDataset({ ...raw, lideres: undefined, ref_2125: undefined }).hasCapacityModel).toBe(false);
    const without = computeCapacity(createDataset({ ...raw, lideres: undefined }));
    expect(without.units.map((u) => [u.id, u.ratio, u.category])).toEqual(computeCapacity(dataset).units.map((u) => [u.id, u.ratio, u.category]));
  });

  test("ratio = UdeA citations of 2021–2025 over the single referent, capped to 1, Colombia by default, world on request", () => {
    // UdeA T1 cites 40 + 15 * 11 = 205 in 2021–2025 (the work of 2015 is outside the snapshot); referent of Colombia 300, of the world 120
    const colombia = computeCapacity(dataset);
    const world = computeCapacity(dataset, { ratioBasis: "global" });
    expect(colombia.filters.ratioBasis).toBe("national");
    expect(colombia.referentSource).toBe("ref_2125");
    expect(unit(colombia, "T1").ratio).toBeCloseTo(205 / 300, 6);
    expect(unit(colombia, "T1").referent).toBe("Inst B");
    expect(unit(colombia, "T1").leaderCitations).toBe(300);
    expect(unit(world, "T1").ratio).toBe(1); // 205 / 120 capped
    expect(unit(world, "T1").referent).toBe("Inst A");
    // T2 has no national reference: it uses the world ratio in both
    expect(unit(colombia, "T2").ratio).toBeCloseTo(60 / 100, 6);
    expect(unit(world, "T2").ratio).toBeCloseTo(60 / 100, 6);
  });

  test("while the bundle has no ref_2125 the sum of the yearly leaders over 2021–2025 is used and the source says so", () => {
    const stopgap = createDataset({ ...raw, ref_2125: undefined });
    const result = computeCapacity(stopgap, { ratioBasis: "global" });
    expect(result.referentSource).toBe("lideres");
    // world leaders of T1: 50 + 50 = 100 -> 205 / 100 capped
    expect(unit(result, "T1").ratio).toBe(1);
    expect(unit(computeCapacity(stopgap), "T1").ratio).toBeCloseTo(205 / 400, 6);
  });

  test("the panels are a snapshot of 2021–2025: the years filter does not move any unit, the rest of the board follows it", () => {
    const all = computeCapacity(dataset);
    const narrow = computeCapacity(dataset, { yearFrom: 2010, yearTo: 2015 });
    expect(narrow.snapshotYears).toEqual([2021, 2025]);
    expect(narrow.units.map((u) => [u.id, u.products, u.citations, u.ratio, u.category])).toEqual(all.units.map((u) => [u.id, u.products, u.citations, u.ratio, u.category]));
    expect(narrow.categoryCounts).toEqual(all.categoryCounts);
    expect(unit(narrow, "T1").products).toBe(12);
    // the products of the board do follow the years filter: only the work of 2015
    expect(narrow.products).toBe(1);
    expect(all.products).toBe(18);
    // another filter does move the units
    expect(unit(computeCapacity(dataset, { facultyIndex: 5 }), "T1").products).toBe(0);
  });

  test("the tooltip figures agree: products and citations are the ones of 2021–2025 and match the yearly counts", () => {
    const t1 = unit(computeCapacity(dataset), "T1");
    expect(t1.yearCounts.reduce((a, b) => a + b, 0)).toBe(t1.products);
    expect(t1.citations).toBe(205);
  });

  test("units without production in 2021–2025 are counted with how many had production in other years", () => {
    const withOld = createDataset({
      ...raw,
      topics: [...raw.topics, { id: "T3", t: "Topic 3", sf: "S1", f: "F1", d: "D", gm: 5, gw: 10, link: [] }, { id: "T4", t: "Topic 4", sf: "S1", f: "F1", d: "D", gm: 5, gw: 10, link: [] }],
      facts: [...raw.facts, fact(2, 2012, 3, 1)],
    });
    const result = computeCapacity(withOld);
    expect(result.categoryCounts[CATEGORY.NONE]).toBe(2);
    expect(result.noProduction).toEqual({ total: 2, otherYears: 1, never: 1 });
  });

  test("the trend window is always 2021-2025 and ignores the years filter", () => {
    const narrow = computeCapacity(dataset, { yearFrom: 2010, yearTo: 2015 });
    expect(unit(narrow, "T1").yearCounts).toEqual([1, 2, 3, 3, 3]);
    expect(unit(narrow, "T1").trend).toBe(TREND.INCREASING);
    expect(unit(narrow, "T1").products).toBe(12); // the snapshot of the panels ignores the years filter (D-133)
    // but the other filters do apply
    const noFaculty = computeCapacity(dataset, { facultyIndex: 5 });
    expect(unit(noFaculty, "T1").yearCounts).toEqual([0, 0, 0, 0, 0]);
  });

  test("categories and the indicative mark (fewer than 10 products in the window)", () => {
    const r = computeCapacity(dataset);
    expect(unit(r, "T1").category).toBe(CATEGORY.CONSOLIDATING); // 205 / 300 = 0.68 > 0.50, increasing
    expect(unit(r, "T1").indicative).toBe(false); // 12 products in the window
    expect(unit(r, "T2").yearCounts).toEqual([2, 1, 1, 1, 0]);
    expect(unit(r, "T2").trend).toBe(TREND.DECREASING); // nothing in 2025
    expect(unit(r, "T2").category).toBe(CATEGORY.AT_RISK); // 0.60 > 0.50 and decreasing
    expect(unit(r, "T2").indicative).toBe(true); // 5 < MIN_TREND_VOLUME
    expect(MIN_TREND_VOLUME).toBe(10);
    expect(r.indicativeUnits).toBe(1);
    expect(r.unitsInWindow).toBe(2);
    const world = computeCapacity(dataset, { ratioBasis: "global" });
    expect(unit(world, "T1").category).toBe(CATEGORY.LEADER);
    // the counts of the seven categories add up to the units
    expect(Object.values(r.categoryCounts).reduce((a, b) => a + b, 0)).toBe(r.units.length);
  });

  test("a topic with 1 to 4 products in 2021–2025 is punctual presence even with ratio 1; the eight categories add up to the units", () => {
    const punctual = createDataset({
      ...raw,
      topics: [...raw.topics, { id: "T3", t: "Topic 3", sf: "S1", f: "F1", d: "D", gm: 5, gw: 10, link: [] }],
      facts: [...raw.facts, fact(2, 2024, 1000, 1)],
      ref_2125: [...raw.ref_2125, [2, 1, 1, 1, 5], [2, 0, 1, 1, 5]],
      ref_nacional: [0, 2],
    });
    const result = computeCapacity(punctual);
    const t3 = unit(result, "T3");
    expect(t3.products).toBe(1);
    expect(t3.ratio).toBe(1); // 1000 / 5 capped
    expect(t3.category).toBe(CATEGORY.PUNCTUAL);
    expect(result.categoryCounts[CATEGORY.PUNCTUAL]).toBe(1);
    expect(Object.values(result.categoryCounts).reduce((a, b) => a + b, 0)).toBe(result.units.length);
    // the years filter does not move it
    expect(unit(computeCapacity(punctual, { yearFrom: 2010, yearTo: 2015 }), "T3").category).toBe(CATEGORY.PUNCTUAL);
    // a coarser dimension classifies by the mass of the group: 1 + 12 + 5 products are 18
    const sub = computeCapacity(punctual, { dimension: "subfield" });
    expect(sub.units).toHaveLength(1);
    expect(sub.units[0].category).not.toBe(CATEGORY.PUNCTUAL);
  });

  test("FWCI only over the works with a record in OpenAlex", () => {
    const r = computeCapacity(dataset);
    const t1 = unit(r, "T1");
    // T1 in 2021–2025: 12 works, 2 without record (15 citations each): 10 with record and 205 - 30 = 175 citations
    expect(t1.recordProducts).toBe(10);
    expect(t1.fwci).toBeCloseTo(175 / 10 / 10, 6);
    expect(r.fwciBasis.withRecord + r.fwciBasis.withoutRecord).toBe(r.products);
    expect(r.fwciBasis.withoutRecord).toBe(2);
  });

  test("a coarser dimension adds the leaders of the topics with production", () => {
    const r = computeCapacity(dataset, { dimension: "subfield", ratioBasis: "global" });
    expect(r.units).toHaveLength(1);
    // UdeA: 205 + 60 = 265 citations (2021–2025) over the world referents 120 + 100
    expect(r.units[0].ratio).toBe(1);
    const colombia = computeCapacity(dataset, { dimension: "subfield" });
    expect(colombia.units[0].ratio).toBeCloseTo(265 / (300 + 100), 6);
  });
});

test.describe("URL filters of the model", () => {
  test("the reference is Colombia by default and the trend rule is gone from the URL", () => {
    expect(parseFilters(new URLSearchParams("")).ratioBasis).toBe("national");
    expect(parseFilters(new URLSearchParams("basis=global")).ratioBasis).toBe("global");
    expect(parseFilters(new URLSearchParams("rule=slope"))).not.toHaveProperty("trendRule");
  });
});
