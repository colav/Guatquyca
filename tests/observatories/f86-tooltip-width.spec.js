/*
 * F86 (D-146): the width of the tooltip of the maps does not depend on where the cursor is. Same polygon, five horizontal
 * positions of the cursor (the last one as close to the right edge as the polygon allows): the width must be the same (±1 px)
 * and the box must stay inside the map. The first block needs no server; the second (E2E_LIVE=1) measures the four maps.
 * No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

import { TOOLTIP_EDGE, TOOLTIP_MAX_WIDTH, tooltipMaxWidth } from "../../lib/observatories/mapTooltip";

const LIVE = !!process.env.E2E_LIVE;

test.describe("width of the tooltip (no server)", () => {
  test("tooltipMaxWidth: 300 px, or the width of the map minus the margin of both sides if the map is narrower; never below 120", () => {
    expect(tooltipMaxWidth(661)).toBe(TOOLTIP_MAX_WIDTH);
    expect(tooltipMaxWidth(581)).toBe(300);
    expect(tooltipMaxWidth(300)).toBe(300 - 2 * TOOLTIP_EDGE);
    expect(tooltipMaxWidth(100)).toBe(120);
  });
});

async function ready(page, box) {
  await box.waitFor({ timeout: 120000 });
  await box.evaluate((el) => el.scrollIntoView({ block: "center" }));
  const size = async () => (await box.screenshot({ type: "png" })).length;
  const start = Date.now();
  while (Date.now() - start < 60000 && (await size()) <= 8000) await page.waitForTimeout(250);
  await page.waitForTimeout(800);
}

/* Title and box of the open tooltip, and the box of the map. */
const READ = (el) => {
  const tip = el.querySelector(".l7plot-tooltip");
  if (!tip) return null;
  const r = tip.getBoundingClientRect();
  const m = el.getBoundingClientRect();
  return { natural: r.left - Number(tip.dataset.dx || 0), text: tip.innerText, width: r.width, height: r.height, left: r.left, right: r.right, top: r.top, bottom: r.bottom, map: { left: m.left, right: m.right, top: m.top, bottom: m.bottom, width: m.width } };
};

/* Five horizontal positions inside the same polygon, taken along the row of the polygon nearest the right edge. */
async function fivePositions(page, box) {
  const b = await box.boundingBox();
  // 1. coarse grid: the polygon whose point is nearest the right edge (and its row)
  let right = null;
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < 24; i++) {
      const x = b.x + (b.width * (i + 0.5)) / 24;
      const y = b.y + (b.height * (j + 0.5)) / 9;
      await page.mouse.move(x, y);
      await page.waitForTimeout(130);
      const r = await box.evaluate(READ);
      if (r && (!right || x > right.x)) right = { x, y, name: r.text.split("\n")[0] + "|" + r.text.split("\n")[1] };
    }
  }
  if (!right) return null;
  // 2. sweep three rows through that point every 2 px: the x positions where the same polygon answers; the row with the longest run wins
  let best = { y: right.y, xs: [] };
  for (const dy of [0, -14, 14]) {
    const y = right.y + dy;
    const xs = [];
    for (let x = b.x + 4; x < b.x + b.width - 2; x += 2) {
      await page.mouse.move(x, y);
      await page.waitForTimeout(110);
      const r = await box.evaluate(READ);
      // a tooltip that is still there from an earlier position does not follow the cursor: its natural place is 15 px right of it
      if (r && Math.abs(r.natural - x - 15) <= 4 && r.text.split("\n")[0] + "|" + r.text.split("\n")[1] === right.name) xs.push(x);
    }
    // the longest run without gaps over 8 px (a tooltip that lingers from far away is not the polygon)
    const runs = [];
    for (const x of xs) {
      const last = runs[runs.length - 1];
      if (last && x - last[last.length - 1] <= 8) last.push(x);
      else runs.push([x]);
    }
    const run = runs.sort((a, c) => c.length - a.length)[0] || [];
    if (run.length > best.xs.length) best = { y, xs: run };
    if (best.xs.length >= 12) break;
  }
  const xs = best.xs;
  right.y = best.y;
  if (xs.length < 5) return { y: right.y, xs, name: right.name };
  // sixteen candidates spread along the polygon: the ones that answer again are kept (at least five)
  const pick = [...new Set([...Array(16).keys()].map((k) => xs[Math.round(((xs.length - 1) * k) / 15)]))];
  return { y: right.y, xs: pick, name: right.name, extent: [xs[0] - b.x, xs[xs.length - 1] - b.x], mapWidth: b.width };
}

async function measure(page, box, label) {
  const pos = await fivePositions(page, box);
  expect(pos, `${label}: some polygon answers`).not.toBeNull();
  const rows = [];
  for (const x of pos.xs) {
    let r = null;
    for (let attempt = 0; attempt < 4 && !r; attempt++) {
      await page.mouse.move(x - 3, pos.y);
      await page.mouse.move(x, pos.y);
      await page.waitForTimeout(150);
      r = await box.evaluate(READ);
    }
    if (!r) continue;
    rows.push({ x: Math.round(x - (await box.boundingBox()).x), width: +r.width.toFixed(1), height: +r.height.toFixed(1), inside: r.left >= r.map.left - 0.5 && r.right <= r.map.right + 0.5 && r.top >= r.map.top - 0.5 && r.bottom <= r.map.bottom + 0.5, text: r.text });
  }
  const widths = rows.map((r) => r.width);
  const spread = Math.max(...widths) - Math.min(...widths);
  console.log(`[live] ${label} «${pos.name.replace("|", " ")}»: ${rows.length} positions (x ${rows.map((r) => r.x).join(", ")}) (polygon spans x ${pos.extent ? pos.extent.map(Math.round).join("–") : "?"} of ${Math.round(pos.mapWidth || 0)}): widths ${widths.join(", ")}; heights ${rows.map((r) => r.height).join(", ")}; spread ${spread.toFixed(1)} px; all inside ${rows.every((r) => r.inside)}`);
  await page.mouse.move(0, 0);
  return { rows, spread };
}

function check({ rows, spread }, label) {
  expect(rows.length, `${label}: at least five positions answer`).toBeGreaterThanOrEqual(5);
  expect(spread, `${label}: same width in any position (±1 px)`).toBeLessThanOrEqual(1);
  expect(new Set(rows.map((r) => r.height)).size, `${label}: same height`).toBe(1);
  expect(rows.every((r) => r.inside), `${label}: inside the map`).toBe(true);
}

test.describe("width of the tooltip in the four maps (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 1 at 1440 and 1280: subregions with topics", async ({ page }) => {
    test.setTimeout(290000);
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-1");
      const sub = page.getByTestId("subregion-map");
      await ready(page, sub);
      const result = await measure(page, sub, `Board 1 at ${width}`);
      const topics = result.rows[0].text.split("\n");
      expect(topics.every((t) => t.length <= 80), "topics are one per line, cut").toBe(true);
      check(result, `Board 1 at ${width}`);
    }
  });

  test("Board 2 at 1440: departments, subregions and countries", async ({ page }) => {
    test.setTimeout(290000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    for (const id of ["department-map", "subregion-map", "country-map"]) {
      const box = page.getByTestId(id);
      await ready(page, box);
      check(await measure(page, box, `Board 2 ${id}`), `Board 2 ${id}`);
    }
  });
});
