/*
 * F91 (D-208, Round 2): Q-26 donuts with the legend at the right. The first block needs no server; the second (E2E_LIVE=1)
 * measures the pages in one run. No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

/* Per donut: the box of the ring (the canvas), the legend, and whether the legend is at its right. */
const DONUTS_IN_PAGE = () =>
  [...document.querySelectorAll('[data-testid="ring-legend"]')].map((legend) => {
    const root = legend.closest('[data-testid="ring-root"]') || legend.parentElement;
    const canvas = root.querySelector("canvas");
    const c = canvas.getBoundingClientRect();
    const l = legend.getBoundingClientRect();
    return {
      diameter: Math.round(Math.min(c.width, c.height)),
      right: l.left >= c.right - 4 && l.top < c.bottom,
      below: l.top >= c.bottom - 4,
      cut: [...legend.querySelectorAll("li > span:nth-child(2)")].filter((s) => s.scrollWidth > s.clientWidth + 1 || s.scrollHeight > s.clientHeight + 1).length,
      items: legend.querySelectorAll("li").length,
    };
  });

test.describe("F91 Q-26 donuts, legend at the right (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("diameter of every ring and where its legend sits, at 1440 and 1280 px", async ({ page }) => {
    test.setTimeout(280000);
    const out = {};
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const board of [1, 2, 3]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("ring-legend").first().waitFor({ timeout: 120000 });
        await page.waitForTimeout(2500);
        out[`${width}-T${board}`] = await page.evaluate(DONUTS_IN_PAGE);
      }
    }
    console.log(`[live] ${JSON.stringify(out)}`);
    {
      for (const [k, list] of Object.entries(out)) {
        for (const d of list) expect(d.cut, `${k} legend cut`).toBe(0);
      }
      expect(out["1440-T2"].every((d) => d.right) && out["1280-T2"].every((d) => d.right), "T2 donut: legend at the right").toBe(true);
      expect(out["1440-T1"].every((d) => d.below && d.diameter >= 200), "T1: the columns are narrow, the legend stays below and the ring keeps 200 px").toBe(true);
    }
  });
});

test.describe("F91 Q-18 maps take the height of the panel (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("panels 9, 9b and 10 of Board 2 and the map of Board 1: free space under the content, height of the map, and the minimum on a small screen", async ({ page }) => {
    test.setTimeout(280000);
    const read = () => page.evaluate(() => [...document.querySelectorAll('[data-testid="chart-card"]')]
      .filter((card) => card.querySelector('[data-testid$="-map"]'))
      .map((card) => {
        const body = card.querySelector(".ant-card-body");
        const used = [...body.children].reduce((a, el) => a + el.getBoundingClientRect().height, 0);
        const m = card.querySelector('[data-testid$="-map"]').getBoundingClientRect();
        const legendCut = [...card.querySelectorAll("canvas")].some((c) => c.getBoundingClientRect().bottom > card.getBoundingClientRect().bottom + 1);
        return { title: (card.querySelector(".ant-card-head-title")?.textContent || "").trim().slice(0, 34), free: Math.round(body.clientHeight - 20 - used), map: Math.round(m.height), legendCut };
      }));
    const report = {};
    for (const [width, height] of [[1440, 1000], [1280, 1000], [390, 800]]) {
      await page.setViewportSize({ width, height });
      for (const board of [1, 2]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.locator('[data-testid$="-map"]').first().waitFor({ timeout: 120000 });
        await page.waitForTimeout(4000);
        report[`${width}-T${board}`] = await read();
      }
    }
    console.log(`[live] ${JSON.stringify(report)}`);
    for (const key of ["1440-T2", "1280-T2"]) {
      for (const p of report[key]) expect(p.free, `${key} ${p.title}`).toBeLessThanOrEqual(40);
    }
    for (const key of Object.keys(report)) for (const p of report[key]) { expect(p.map, `${key} ${p.title}`).toBeGreaterThanOrEqual(380); expect(p.legendCut).toBe(false); }
  });
});

import * as texts1 from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import * as texts2 from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import * as texts3 from "../../app/observatories/vri-udea/board-3/components/boardTexts";

/* Q-22 and Q-24: nothing visible says «ensayo», «limitaciones de datos», «provisional», «deben revisarse», «requiere revisión manual» or names Luis. */
const WORKING = /ensayo|limitaciones de datos|provisional|debe(n)? revisarse|requiere revisi[oó]n|no hemos definido|Luis|aprueb/i;
const strings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
};

test.describe("F91 Q-22 and Q-24 texts as a final board (no server)", () => {
  const SHOWN = {
    "Board 1": ["BOARD_EYEBROW", "REAL_TAG", "MOCK_TAG", "DATA_WARNINGS"],
    "Board 2": ["BOARD_EYEBROW", "REAL_TAG", "MOCK_TAG", "NOTICE_NOTES"],
    "Board 3": ["BOARD_EYEBROW", "REAL_TAG", "MOCK_TAG", "PROXY_LABEL"],
  };
  for (const [name, mod] of [["Board 1", texts1], ["Board 2", texts2], ["Board 3", texts3]]) {
    test(`${name}: eyebrow, tags and notes of method`, () => {
      const found = strings(SHOWN[name].map((k) => mod[k])).filter((s) => WORKING.test(s));
      expect(found).toEqual([]);
    });
  }

  test("the notes built with the figures of the bundle", () => {
    const built = [
      ...texts1.realDataWarnings({ n_sel: 1000, n_topic: 900 }),
      ...texts2.realNotes({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 735, appropriation: 752 }),
      ...texts3.methodNotes("con contrato vigente al 30 de mayo de 2026"),
    ];
    expect(built.filter((s) => WORKING.test(s))).toEqual([]);
    expect(texts3.methodNotes("X")[0]).toContain("X");
  });
});

test.describe("F91 Q-22 and Q-24 in the page (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("each board has one box «Notas metodológicas» with the cut-off date as its last note, and none of the working words", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const board of [1, 2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      const box = page.getByTestId("method-notes");
      await box.waitFor({ timeout: 120000 });
      await page.waitForTimeout(2000);
      const notes = await box.locator("li").allInnerTexts();
      const boxes = await page.locator(".ant-alert").count();
      const text = await page.locator("body").innerText();
      const hits = [...new Set([...text.matchAll(new RegExp(WORKING.source, "gi"))].map((m) => m[0].toLowerCase()))];
      console.log(`[live] Board ${board}: ${boxes} blue box(es); ${notes.length} notes; last «${notes[notes.length - 1]}»; working words found: ${hits.join(", ") || "none"}`);
      expect(await page.getByText("Notas metodológicas").count()).toBe(1);
      expect(notes[notes.length - 1]).toMatch(/^Datos consultados/);
      expect(notes.length).toBeGreaterThanOrEqual(2);
      expect(hits.filter((h) => h !== "luis")).toEqual([]);
    }
  });
});

test.describe("F91 Q-28 part A: no «Nombre original» in the tooltip (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the bundle keeps ext.nombres_originales and the panel does not show it", async ({ page, request }) => {
    test.setTimeout(200000);
    const API = process.env.E2E_API_URL || "http://localhost:8080";
    const body = await (await request.get(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    const b2 = body.data || body;
    expect(Object.keys(b2.ext.nombres_originales).length).toBeGreaterThan(5);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    await page.getByTestId("chart-card").filter({ hasText: "Entidades que financian" }).first().waitFor({ timeout: 120000 });
    await page.waitForTimeout(2500);
    expect(await page.locator("body").innerText()).not.toContain("Nombre original");
  });
});
