/* Unit tests of the capacity model of Board 1 (pure functions; no browser, no server). */
import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

import {
  CATEGORY,
  TREND,
  TREND_RULE,
  categoryOf,
  computeCapacity,
  createDataset,
  officialFwci,
  rankAxes,
  rankGoals,
  rankGroups,
  substituteBenchmark,
  trendOf,
  yearAdjustedFwci,
} from "../../lib/observatories/capacity";
import { parseFilters, serializeFilters } from "../../lib/observatories/filters";

const MOCK_FILE = path.join(__dirname, "..", "..", "mock-data", "observatories", "vri-udea-board-1.json");

test.describe("trendOf", () => {
  test("no production in the window is none", () => {
    expect(trendOf([0, 0, 0, 0, 0])).toBe(TREND.NONE);
  });
  test("strict rule: no year falls -> increasing, any fall -> decreasing", () => {
    expect(trendOf([1, 1, 2, 3, 3], TREND_RULE.STRICT)).toBe(TREND.INCREASING);
    expect(trendOf([3, 0, 4, 1, 3], TREND_RULE.STRICT)).toBe(TREND.DECREASING);
  });
  test("slope rule: regression slope >= 0 is increasing", () => {
    expect(trendOf([3, 0, 4, 1, 3], TREND_RULE.SLOPE)).toBe(TREND.INCREASING);
    expect(trendOf([5, 4, 3, 2, 1], TREND_RULE.SLOPE)).toBe(TREND.DECREASING);
  });
});

test.describe("categoryOf (edges of D-102)", () => {
  const up = (ratio) => categoryOf({ products: 10, trend: TREND.INCREASING, ratio });
  const down = (ratio) => categoryOf({ products: 10, trend: TREND.DECREASING, ratio });

  test("increasing trend", () => {
    expect(up(1)).toBe(CATEGORY.LEADER);
    expect(up(5)).toBe(CATEGORY.LEADER); // capped to 1
    expect(up(0.9)).toBe(CATEGORY.CONSOLIDATED);
    expect(up(0.76)).toBe(CATEGORY.CONSOLIDATED);
    expect(up(0.75)).toBe(CATEGORY.CONSOLIDATING); // > 0.75 is exclusive
    expect(up(0.51)).toBe(CATEGORY.CONSOLIDATING);
    expect(up(0.5)).toBe(CATEGORY.UNCATEGORIZED); // > 0.50 is exclusive
    expect(up(0.25)).toBe(CATEGORY.UNCATEGORIZED); // < 0.25 is exclusive
    expect(up(0.24)).toBe(CATEGORY.EMERGING);
    expect(up(0)).toBe(CATEGORY.EMERGING);
  });
  test("decreasing trend: at risk above 0.50, otherwise no category", () => {
    expect(down(0.51)).toBe(CATEGORY.AT_RISK);
    expect(down(0.8)).toBe(CATEGORY.AT_RISK);
    expect(down(1)).toBe(CATEGORY.AT_RISK);
    expect(down(0.5)).toBe(CATEGORY.UNCATEGORIZED);
    expect(down(0.1)).toBe(CATEGORY.UNCATEGORIZED);
  });
  test("no production, and non-finite ratio counts as 0", () => {
    expect(categoryOf({ products: 0, trend: TREND.NONE, ratio: 1 })).toBe(CATEGORY.NONE);
    expect(categoryOf({ products: 4, trend: TREND.NONE, ratio: 1 })).toBe(CATEGORY.NONE);
    expect(categoryOf({ products: 4, trend: TREND.INCREASING, ratio: NaN })).toBe(CATEGORY.EMERGING);
  });
  test("thresholds are parameters", () => {
    expect(categoryOf({ products: 4, trend: TREND.INCREASING, ratio: 0.8 }, { consolidated: 0.9, consolidating: 0.6 })).toBe(CATEGORY.CONSOLIDATING);
  });
});

test.describe("FWCI", () => {
  test("official FWCI = citations per work over the world mean", () => {
    expect(officialFwci({ citations: 569, count: 30, worldMean: 33.56 })).toBeCloseTo(0.565, 3);
    expect(officialFwci({ citations: 5, count: 0, worldMean: 3 })).toBeNaN();
    expect(officialFwci({ citations: 5, count: 2, worldMean: 0 })).toBeNaN();
  });
  test("year-adjusted FWCI uses the injected world mean of each year", () => {
    const works = [{ year: 2020, citations: 10 }, { year: 2021, citations: 4 }];
    expect(yearAdjustedFwci(works, { 2020: 10, 2021: 2 })).toBeCloseTo((1 + 2) / 2, 6);
    expect(yearAdjustedFwci(works, { 2020: 10 })).toBeNaN();
    expect(yearAdjustedFwci(works, undefined)).toBeNaN();
  });
  test("the substitute benchmark is the FWCI capped to 1 and is a mock", () => {
    expect(substituteBenchmark.isMock).toBe(true);
    expect(substituteBenchmark.ratio({ citations: 569, count: 30, worldMean: 33.56 }, "global")).toBeCloseTo(0.565, 3);
    expect(substituteBenchmark.ratio({ citations: 5000, count: 1, worldMean: 1 }, "national")).toBe(1);
  });
});

test.describe("computeCapacity on a small dataset", () => {
  const raw = {
    meta: {},
    topics: [
      { id: "T1", t: "A", sf: "S1", f: "F1", d: "D", gm: 10, gw: 100, link: [[0, 1]] },
      { id: "T2", t: "B", sf: "S1", f: "F1", d: "D", gm: 20, gw: 300, link: [[1, 1]] },
    ],
    // [topic, year, citations, type, quartile, oa, faculties, departments, centers, groups]
    facts: [
      [0, 2021, 10, 0, 0, 0, [0], [], [0], [0]],
      [0, 2022, 10, 0, 1, 1, [0], [], [0], [0]],
      [0, 2025, 10, 1, 2, 2, [1], [], [0], [0, 1]],
      [1, 2023, 40, 2, 3, 3, [0], [], [1], [1]],
    ],
    ejes: [
      { id: 0, clave: "X|1", eje: "Eje A", agenda: "Doc 1", nivel: "Local", meta: "Meta 1" },
      { id: 1, clave: "X|2", eje: "Eje B", agenda: "Doc 2", nivel: "Nacional", meta: "Meta 2" },
    ],
    groups: [["G0", "Grupo 0", "A1"], ["G1", "Grupo 1", "B"]],
    cens: ["C0", "C1"],
    facs: ["F0", "F1"],
    deps: [],
    subregiones: [],
    actores: [],
  };
  const dataset = createDataset(raw);

  test("counts, citations and trend", () => {
    const r = computeCapacity(dataset);
    expect(r.products).toBe(4);
    expect(r.citations).toBe(70);
    const a = r.units.find((u) => u.id === "T1");
    expect(a.yearCounts).toEqual([1, 1, 0, 0, 1]);
    expect(a.trend).toBe(TREND.DECREASING); // strict: falls to 0 in 2023
    // slope of [1, 1, 0, 0, 1] is -0.1 (decreasing); the rule changes the result for [3, 0, 4, 1, 3] (see below)
    expect(computeCapacity(dataset, { trendRule: TREND_RULE.SLOPE }).units.find((u) => u.id === "T1").trend).toBe(TREND.DECREASING);
  });
  test("filters by faculty, years, scope and policy document", () => {
    expect(computeCapacity(dataset, { facultyIndex: 1 }).products).toBe(1);
    expect(computeCapacity(dataset, { yearFrom: 2023, yearTo: 2021 }).products).toBe(3); // swapped range: 2021 to 2023
    expect(computeCapacity(dataset, { yearFrom: 2023, yearTo: 2023 }).products).toBe(1);
    expect(computeCapacity(dataset, { scope: "Nacional" }).products).toBe(1);
    expect(computeCapacity(dataset, { policyDoc: "Doc 1" }).products).toBe(3);
    expect(computeCapacity(dataset, { centerIndex: 1 }).products).toBe(1);
  });
  test("a coarser dimension aggregates topics with the weighted world mean", () => {
    const r = computeCapacity(dataset, { dimension: "subfield" });
    expect(r.units).toHaveLength(1);
    const u = r.units[0];
    expect(u.products).toBe(4);
    // world mean = (100*10 + 300*20) / 400 = 17.5 ; fwci = (70/4)/17.5 = 1
    expect(u.fwci).toBeCloseTo(1, 6);
  });
  test("rankings", () => {
    const r = computeCapacity(dataset);
    expect(rankGroups(dataset, r)[0]).toMatchObject({ id: "G0", value: 3 });
    expect(rankAxes(dataset, r).map((x) => x.id).sort()).toEqual([0, 1]);
    expect(rankGoals(dataset, r)).toHaveLength(2);
  });
  test("the benchmark is injectable", () => {
    const real = { id: "x", isMock: false, ratio: () => 1 };
    const r = computeCapacity(dataset, {}, { benchmark: real });
    expect(r.benchmark.isMock).toBe(false);
    expect(r.units.find((u) => u.id === "T2").ratio).toBe(1);
  });
});

test.describe("URL filters", () => {
  test("round trip and invalid values", () => {
    const filters = { scope: "Local", policyDoc: "CONPES 4069", centerIndex: 3, facultyIndex: -1, departmentIndex: -1, yearFrom: 2018, yearTo: 2024, dimension: "subfield", ratioBasis: "global", axisIds: [] }; /* the trend rule left the URL (D-121); the reference is Colombia by default (D-122) */
    const qs = serializeFilters(filters);
    expect(parseFilters(new URLSearchParams(qs))).toEqual(filters);
    expect(serializeFilters(parseFilters(new URLSearchParams("")))).toBe("");
    const bad = parseFilters(new URLSearchParams("from=1900&to=abc&dimension=zzz&faculty=-4&rule=x"));
    expect(bad).toMatchObject({ yearFrom: 2010, yearTo: 2026, dimension: "topic", facultyIndex: -1, ratioBasis: "national" });
  });
});

// Example verified in the Board 1 handoff report (section 3.1): T10083, 30 products, 569 citations.
test.describe("verified example T10083 (real artifact data [mock])", () => {
  test.skip(!fs.existsSync(MOCK_FILE), "mock-data/observatories/vri-udea-board-1.json is not present");

  test("30 products, 569 citations, FWCI 0.565; at risk (strict) and consolidating (slope)", () => {
    const dataset = createDataset(JSON.parse(fs.readFileSync(MOCK_FILE, "utf8")));
    const strict = computeCapacity(dataset).units.find((u) => u.id === "T10083");
    expect(strict.products).toBe(30);
    expect(strict.citations).toBe(569);
    expect(strict.yearCounts).toEqual([3, 0, 4, 1, 3]);
    expect(strict.fwci).toBeCloseTo(0.565, 3);
    expect(strict.category).toBe(CATEGORY.AT_RISK);
    const slope = computeCapacity(dataset, { trendRule: TREND_RULE.SLOPE }).units.find((u) => u.id === "T10083");
    expect(slope.category).toBe(CATEGORY.CONSOLIDATING);
  });

  test("filtered totals of the artifact: 41,653 products and 551,709 citations", () => {
    const dataset = createDataset(JSON.parse(fs.readFileSync(MOCK_FILE, "utf8")));
    const r = computeCapacity(dataset);
    expect(r.products).toBe(41653);
    expect(r.citations).toBe(551709);
    expect(r.unitsWithProduction).toBe(3163);
  });
});
