/*
 * F101 (D-221, D-224, B153): ratio, trend, categories and FWCI of the panels 1 and 2 of the Board 1 in 2010–2025. The first block needs no
 * server; the second (E2E_LIVE=1) checks the real bundle of B153 (ETag, split of the categories and ranges of the ratio).
 */
import { test, expect } from "@playwright/test";

import { CAPACITY_WINDOW, LEGACY_TREND_WINDOW_YEARS, TREND_WINDOW_YEARS } from "../../lib/observatories/capacity/constants";
import { CALCULATOR_EXPLANATION, PUNCTUAL_DEFINITION, SNAPSHOT_NOTE } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { CATEGORY, CATEGORY_ORDER, computeCapacity, createDataset } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

test.describe("F101 window 2010–2025 (no server)", () => {
  test("one constant: 2010 to 2025, sixteen years; the legacy model keeps its five", () => {
    expect(CAPACITY_WINDOW).toEqual({ from: 2010, to: 2025 });
    expect(TREND_WINDOW_YEARS).toHaveLength(16);
    expect(TREND_WINDOW_YEARS[0]).toBe(2010);
    expect(TREND_WINDOW_YEARS[15]).toBe(2025);
    expect(LEGACY_TREND_WINDOW_YEARS).toEqual([2021, 2022, 2023, 2024, 2025]);
  });

  test("the texts of the panels say 2010–2025 and the explanation under the calculator has the four parts, with the figures of the constants", () => {
    expect(SNAPSHOT_NOTE).toContain("2010–2025");
    expect(PUNCTUAL_DEFINITION).toContain("2010–2025");
    expect(CALCULATOR_EXPLANATION.map((p) => p.key)).toEqual(["ratio", "trend", "category", "care"]);
    const all = CALCULATOR_EXPLANATION.map((p) => p.text).join(" ");
    expect(all).toContain("2010–2025");
    expect(all).toMatch(/máximo es 1/);
    expect(all).toMatch(/cercano a 0/);
    expect(all).toMatch(/10 % del promedio anual/);
    expect(all).toMatch(/asterisco/);
    expect(all).toMatch(/empezó a producirse tarde/);
    expect(all).not.toContain("2021");
  });

  test("a bundle with ref_1025 reads it; an old bundle falls back to ref_2125", () => {
    const base = {
      meta: {}, topics: [{ id: "T1", t: "Topic 1", sf: "S", f: "F", d: "D", gm: 10, gw: 100, link: [] }],
      facts: Array.from({ length: 6 }, (_, i) => [0, 2012 + i, 10, 0, 0, 0, [0], [], [0], [0], [], [], [], [], 1]),
      ejes: [], groups: [["G0", "Grupo 0", "A1"]], cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [], ref_nacional: [0], inst_lider: ["Inst A"],
    };
    const fresh = computeCapacity(createDataset({ ...base, ref_1025: [[0, 0, 0, 10, 120], [0, 1, 0, 10, 240]], ref_2125: [[0, 0, 0, 10, 12], [0, 1, 0, 10, 24]] }));
    expect(fresh.referentSource).toBe("ref_1025");
    expect(fresh.units[0].ratio).toBeCloseTo(60 / 240, 6);
    const old = computeCapacity(createDataset({ ...base, ref_2125: [[0, 0, 0, 10, 12], [0, 1, 0, 10, 24]] }));
    expect(old.referentSource).toBe("ref_2125");
    expect(fresh.snapshotYears).toEqual([2010, 2025]);
    expect(fresh.units[0].yearCounts).toHaveLength(16);
    expect(fresh.categoryCounts).toBeTruthy();
    expect(CATEGORY_ORDER).toContain(CATEGORY.LEADER);
  });
});

/* B153 report: split of the categories with the window 2010–2025 (Colombia by default; world on request) and the clearest ranges of the ratio. */
const B153 = {
  national: { leader: 276, consolidated: 189, consolidating: 194, emerging: 224, atRisk: 95, lowCapacity: 870, punctual: 1370, none: 1298 },
  global: { leader: 0, consolidated: 0, consolidating: 3, emerging: 371, atRisk: 0, lowCapacity: 1474, punctual: 1370, none: 1298 },
};

test.describe("F101 against the bundle of B153 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("ETag of the Board 1, split of the categories and ranges of the ratio equal to the report of B153", async () => {
    test.setTimeout(200000);
    const res = await fetch(`${API}/observatories/vri-udea/boards/1/bundle`, { headers: { "Accept-Encoding": "gzip" } });
    expect(res.headers.get("etag")).toBe('"20261107-5b280d917c42"');
    const raw = await res.json();
    expect(raw.ref_1025.length).toBe(8613);
    const ds = createDataset(raw);
    for (const basis of ["national", "global"]) {
      const r = computeCapacity(ds, { ratioBasis: basis, dimension: "topic" });
      expect(r.referentSource).toBe("ref_1025");
      expect(r.snapshotYears).toEqual([2010, 2025]);
      expect(r.categoryCounts, basis).toEqual(B153[basis]);
      const withProduction = r.units.filter((u) => u.windowTotal > 0);
      const classified = r.units.filter((u) => u.windowTotal >= 5);
      expect(withProduction).toHaveLength(3218);
      expect(classified).toHaveLength(1848);
      const bands = (list) => [list.filter((u) => u.ratio > 0.75).length, list.filter((u) => u.ratio > 0.5 && u.ratio <= 0.75).length, list.filter((u) => u.ratio <= 0.5).length];
      if (basis === "national") expect(bands(classified)).toEqual([533, 221, 1094]);
      else expect(bands(classified)).toEqual([0, 3, 1845]);
      expect(withProduction.filter((u) => u.indicative)).toHaveLength(2027);
    }
  });

  test("the page: the explanation is under the calculator, the notes say 2010–2025 and the header of the ratio has no 2021–2025", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${BASE}/observatories/vri-udea/board-1`, { waitUntil: "domcontentloaded" });
    const box = page.getByTestId("calc-explanation");
    await expect(box).toBeVisible({ timeout: 120000 });
    await expect(box).toContainText("Razón de capacidad");
    await expect(box).toContainText("Tendencia");
    await expect(box).toContainText("2010–2025");
    const text = await page.locator("body").innerText();
    expect(text.match(/2021–2025/g) ?? []).toHaveLength(0);
    expect(text).toContain("Fotografía 2010–2025");
  });
});
