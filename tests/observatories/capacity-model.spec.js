/* Unit tests of the capacity model of D-121 and D-122 (pure functions; no browser, no server). */
import { test, expect } from "@playwright/test";

import {
  CATEGORY,
  CATEGORY_ORDER,
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

test.describe("categoryByCapacity (the seven categories of D-122)", () => {
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
  test("no production, and a non-finite ratio counts as 0; there is no 'sin categoría'", () => {
    expect(cat(TREND.NONE, 1, 0)).toBe(CATEGORY.NONE);
    expect(cat(TREND.INCREASING, NaN)).toBe(CATEGORY.EMERGING);
    expect(CATEGORY_ORDER).toEqual([CATEGORY.LEADER, CATEGORY.CONSOLIDATED, CATEGORY.CONSOLIDATING, CATEGORY.EMERGING, CATEGORY.AT_RISK, CATEGORY.LOW_CAPACITY, CATEGORY.NONE]);
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
      // T2: only 4 works (2021 to 2024, nothing in 2025)
      fact(1, 2021, 15, 1), fact(1, 2022, 15, 1), fact(1, 2023, 15, 1), fact(1, 2024, 15, 1),
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
  };
  const dataset = createDataset(raw);
  const unit = (r, id) => r.units.find((u) => u.id === id);

  test("the model applies only with leaders and the OpenAlex mark", () => {
    expect(dataset.hasCapacityModel).toBe(true);
    expect(computeCapacity(dataset).model).toBe("capacity");
    expect(createDataset({ ...raw, lideres: undefined }).hasCapacityModel).toBe(false);
  });

  test("ratio = UdeA citations over the leader, capped to 1, Colombia by default, world on request", () => {
    // Years 2010-2026: UdeA T1 cites 40+15*11+5 = 210 ... world leader 100, Colombia leader 400
    const colombia = computeCapacity(dataset);
    const world = computeCapacity(dataset, { ratioBasis: "global" });
    expect(colombia.filters.ratioBasis).toBe("national");
    expect(unit(colombia, "T1").ratio).toBeCloseTo(210 / 400, 6);
    expect(unit(world, "T1").ratio).toBe(1); // 210 / 100 capped
    // T2 has no national reference: it uses the world ratio in both
    expect(unit(colombia, "T2").ratio).toBeCloseTo(60 / 100, 6);
    expect(unit(world, "T2").ratio).toBeCloseTo(60 / 100, 6);
  });

  test("the leader and the UdeA citations are summed over the same years of the filter", () => {
    const only2021 = computeCapacity(dataset, { yearFrom: 2021, yearTo: 2021, ratioBasis: "global" });
    // UdeA T1 in 2021: 1 work with 40 citations; world leader 2021: 50
    expect(unit(only2021, "T1").citations).toBe(40);
    expect(unit(only2021, "T1").ratio).toBeCloseTo(40 / 50, 6);
  });

  test("the trend window is always 2021-2025 and ignores the years filter", () => {
    const narrow = computeCapacity(dataset, { yearFrom: 2010, yearTo: 2015 });
    expect(unit(narrow, "T1").yearCounts).toEqual([1, 2, 3, 3, 3]);
    expect(unit(narrow, "T1").trend).toBe(TREND.INCREASING);
    expect(unit(narrow, "T1").products).toBe(1); // only the 2015 work is in the years of the filter
    // but the other filters do apply
    const noFaculty = computeCapacity(dataset, { facultyIndex: 5 });
    expect(unit(noFaculty, "T1").yearCounts).toEqual([0, 0, 0, 0, 0]);
  });

  test("categories and the indicative mark (fewer than 10 products in the window)", () => {
    const r = computeCapacity(dataset);
    expect(unit(r, "T1").category).toBe(CATEGORY.CONSOLIDATING); // 0.525 > 0.50, increasing
    expect(unit(r, "T1").indicative).toBe(false); // 12 products in the window
    expect(unit(r, "T2").yearCounts).toEqual([1, 1, 1, 1, 0]);
    expect(unit(r, "T2").trend).toBe(TREND.DECREASING); // nothing in 2025
    expect(unit(r, "T2").category).toBe(CATEGORY.AT_RISK); // 0.60 > 0.50 and decreasing
    expect(unit(r, "T2").indicative).toBe(true); // 4 < MIN_TREND_VOLUME
    expect(MIN_TREND_VOLUME).toBe(10);
    expect(r.indicativeUnits).toBe(1);
    expect(r.unitsInWindow).toBe(2);
    const world = computeCapacity(dataset, { ratioBasis: "global" });
    expect(unit(world, "T1").category).toBe(CATEGORY.LEADER);
    // the counts of the seven categories add up to the units
    expect(Object.values(r.categoryCounts).reduce((a, b) => a + b, 0)).toBe(r.units.length);
  });

  test("FWCI only over the works with a record in OpenAlex", () => {
    const r = computeCapacity(dataset);
    const t1 = unit(r, "T1");
    // T1: 13 works, 2 without record (15 citations each): 11 with record and 210 - 30 = 180 citations
    expect(t1.recordProducts).toBe(11);
    expect(t1.fwci).toBeCloseTo(180 / 11 / 10, 6);
    expect(r.fwciBasis.withRecord + r.fwciBasis.withoutRecord).toBe(r.products);
    expect(r.fwciBasis.withoutRecord).toBe(2);
  });

  test("a coarser dimension adds the leaders of the topics with production", () => {
    const r = computeCapacity(dataset, { dimension: "subfield", ratioBasis: "global" });
    expect(r.units).toHaveLength(1);
    // UdeA: 210 + 60 = 270 citations over the world leaders 100 + 100
    expect(r.units[0].ratio).toBe(1);
    const colombia = computeCapacity(dataset, { dimension: "subfield" });
    expect(colombia.units[0].ratio).toBeCloseTo(270 / (400 + 100), 6);
  });
});

test.describe("URL filters of the model", () => {
  test("the reference is Colombia by default and the trend rule is gone from the URL", () => {
    expect(parseFilters(new URLSearchParams("")).ratioBasis).toBe("national");
    expect(parseFilters(new URLSearchParams("basis=global")).ratioBasis).toBe("global");
    expect(parseFilters(new URLSearchParams("rule=slope"))).not.toHaveProperty("trendRule");
  });
});
