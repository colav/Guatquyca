/*
 * F84 (D-194): the tooltip of the maps stays inside the box of the map, wraps its values and shows the topics one per line.
 * The first block needs no server; the second (E2E_LIVE=1) hovers a grid of points on each of the four maps, takes the longest
 * tooltip and measures its box against the box of the map. No screenshots are saved.
 */
import { test, expect } from "@playwright/test";

import { TOPIC_MAX, subregionRowsFromCatalogue } from "../../lib/observatories/geoMap";
import { TOOLTIP_EDGE, TOOLTIP_MAX_WIDTH, tooltipShift, tooltipValue, truncateText } from "../../lib/observatories/mapTooltip";

const LIVE = !!process.env.E2E_LIVE;

test.describe("tooltip of the maps (no server)", () => {
  test("truncateText: 45 characters at most, «…» at the end, short texts untouched", () => {
    const long = "Autoimmune Bullous Skin Diseases and Mining and Resource Management";
    const cut = truncateText(long, 45);
    expect(cut.length).toBeLessThanOrEqual(45);
    expect(cut.endsWith("…")).toBe(true);
    expect(truncateText("Mining", 45)).toBe("Mining");
    expect(truncateText("x".repeat(45), 45)).toBe("x".repeat(45));
    expect(truncateText("x".repeat(46), 45)).toBe(`${"x".repeat(44)}…`);
    expect(truncateText(null)).toBe("");
  });

  test("the main topics go one per line, each cut to 45 characters", () => {
    const catalogue = [{ sub: "Oriente", n_title: 10, n_regprog: 2, topics: [["Autoimmune Bullous Skin Diseases and Related Conditions", 3], ["Mining", 2], ["Tercero", 1]] }];
    const [row] = subregionRowsFromCatalogue(catalogue);
    const lines = row.topics.split("\n");
    expect(TOPIC_MAX).toBe(45);
    expect(lines).toHaveLength(2);
    expect(lines[0].length).toBeLessThanOrEqual(45);
    expect(lines[0].endsWith("…")).toBe(true);
    expect(lines[1]).toBe("Mining");
  });

  test("tooltipValue: escapes the HTML, turns the line feed into a line break and leaves numbers alone", () => {
    expect(tooltipValue("A\nB")).toBe("A<br>B");
    expect(tooltipValue("<b>&")).toBe("&lt;b&gt;&amp;");
    expect(tooltipValue(1234)).toBe(1234);
  });

  test("tooltipShift: stays as it is inside, opens to the left near the right edge, upwards near the bottom, never outside", () => {
    const box = { left: 100, top: 100, right: 700, bottom: 500 };
    expect(tooltipShift({ left: 200, top: 200, width: 250, height: 100 }, box)).toEqual({ dx: 0, dy: 0 });
    const right = tooltipShift({ left: 600, top: 200, width: 250, height: 100 }, box);
    expect(right.dx).toBeLessThan(0);
    expect(600 + right.dx).toBeGreaterThanOrEqual(box.left + TOOLTIP_EDGE);
    expect(600 + right.dx + 250).toBeLessThanOrEqual(box.right - TOOLTIP_EDGE);
    const bottom = tooltipShift({ left: 200, top: 450, width: 250, height: 120 }, box);
    expect(bottom.dy).toBeLessThan(0);
    expect(450 + bottom.dy + 120).toBeLessThanOrEqual(box.bottom - TOOLTIP_EDGE);
    const wide = tooltipShift({ left: 150, top: 200, width: 590, height: 50 }, box);
    expect(150 + wide.dx).toBeGreaterThanOrEqual(box.left + TOOLTIP_EDGE);
    expect(TOOLTIP_MAX_WIDTH).toBe(300);
  });
});

/* Helpers of the live block. */
async function ready(page, box) {
  await box.waitFor({ timeout: 120000 });
  await box.evaluate((el) => el.scrollIntoView({ block: "center" }));
  const size = async () => (await box.screenshot({ type: "png" })).length;
  const start = Date.now();
  while (Date.now() - start < 60000 && (await size()) <= 8000) await page.waitForTimeout(250);
  await page.waitForTimeout(800);
}

/* What the page reports about the open tooltip: its box, the box of the map, the rows, and the width it had without the fix. */
const READ = (el) => {
  const tip = el.querySelector(".l7plot-tooltip");
  if (!tip) return null;
  const rect = (n) => {
    const r = n.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  };
  const shift = { dx: Number(tip.dataset.dx || 0), dy: Number(tip.dataset.dy || 0) };
  const now = rect(tip);
  // without the fix: no width limit, no wrapping, no shift (put back right after)
  const items = [...tip.querySelectorAll("li")];
  const saved = { max: tip.style.maxWidth, tr: tip.style.translate, ws: items.map((li) => li.style.whiteSpace), fw: items.map((li) => li.style.flexWrap) };
  tip.style.maxWidth = "none";
  tip.style.translate = "none";
  items.forEach((li) => {
    li.style.whiteSpace = "nowrap";
    li.style.flexWrap = "nowrap";
  });
  const before = rect(tip);
  tip.style.maxWidth = saved.max;
  tip.style.translate = saved.tr;
  items.forEach((li, i) => {
    li.style.whiteSpace = saved.ws[i];
    li.style.flexWrap = saved.fw[i];
  });
  const box = rect(el);
  const rows = items.map((li) => {
    const v = rect(li.querySelector(".l7plot-tooltip__value"));
    return {
      name: li.querySelector(".l7plot-tooltip__name").innerText,
      value: li.querySelector(".l7plot-tooltip__value").innerText,
      visible: v.width > 0 && v.height > 0 && v.left >= now.left - 0.5 && v.right <= now.right + 0.5 && v.left >= box.left && v.right <= box.right && v.top >= box.top && v.bottom <= box.bottom,
    };
  });
  return { now, before, box, shift, rows, text: tip.innerText };
};

const overflowOf = (r) => Math.max(r.now.right - r.box.right, r.now.bottom - r.box.bottom, r.box.left - r.now.left, r.box.top - r.now.top);

/* Hovers a grid on the map: the longest tooltip, how many were outside the box, and the overflow the old one would have had. */
async function survey(page, box, label) {
  const b = await box.boundingBox();
  const cols = 12;
  const rows = 9;
  let longest = null;
  let hits = 0;
  let outside = 0;
  let oldOutside = 0;
  let oldWorst = 0;
  let rightmost = null;
  let lowest = null;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      await page.mouse.move(b.x + (b.width * (i + 0.5)) / cols, b.y + (b.height * (j + 0.5)) / rows);
      await page.waitForTimeout(90);
      const r = await box.evaluate(READ);
      if (!r) continue;
      hits++;
      if (overflowOf(r) > 0.5) outside++;
      const cursor = { x: b.x + (b.width * (i + 0.5)) / cols, y: b.y + (b.height * (j + 0.5)) / rows };
      if (!rightmost || cursor.x > rightmost.x) rightmost = { ...cursor, shift: r.shift, over: overflowOf(r) };
      if (!lowest || cursor.y > lowest.y) lowest = { ...cursor, shift: r.shift, over: overflowOf(r) };
      // the old tooltip: natural place (the shift removed) with the width it had without the limit
      const oldRight = r.now.left - r.shift.dx + r.before.width - r.box.right;
      if (oldRight > 0.5) oldOutside++;
      oldWorst = Math.max(oldWorst, oldRight);
      if (!longest || r.text.length > longest.text.length) longest = r;
    }
  }
  console.log(`[live] ${label}: ${hits} of ${cols * rows} points with tooltip; outside the box now ${outside}; the old width would have gone out in ${oldOutside}, up to ${oldWorst.toFixed(0)} px`);
  if (rightmost) console.log(`[live] ${label}: polygon point nearest the right edge: ${Math.round(b.x + b.width - rightmost.x)} px from it, shift ${JSON.stringify(rightmost.shift)}; nearest the bottom: ${Math.round(b.y + b.height - lowest.y)} px from it, shift ${JSON.stringify(lowest.shift)}`);
  if (longest) {
    console.log(`[live] ${label}: longest tooltip ${Math.round(longest.now.width)} x ${Math.round(longest.now.height)} px (${Math.round(longest.before.width)} px wide without the fix); map ${Math.round(longest.box.width)} x ${Math.round(longest.box.height)}`);
    console.log(`[live] ${label}: rows ${JSON.stringify(longest.rows.map((r) => [r.name, r.value.replace(/\n/g, " / "), r.visible]))}`);
  }
  await page.mouse.move(0, 0);
  return { hits, outside, longest };
}

/* A walk over the right and the bottom bands of the map (the last 30 %): the places where the old tooltip went out. */
async function edges(page, box, label) {
  const b = await box.boundingBox();
  const points = [];
  for (let fx = 0.7; fx < 0.99; fx += 0.04) for (let fy = 0.05; fy < 1; fy += 0.1) points.push([fx, fy]);
  for (let fy = 0.7; fy < 0.99; fy += 0.05) for (let fx = 0.05; fx < 0.7; fx += 0.1) points.push([fx, fy]);
  let hits = 0;
  let outside = 0;
  let rowsHidden = 0;
  for (const [fx, fy] of points) {
    await page.mouse.move(b.x + b.width * fx, b.y + b.height * fy);
    await page.waitForTimeout(90);
    const r = await box.evaluate(READ);
    if (!r) continue;
    hits++;
    if (overflowOf(r) > 0.5) outside++;
    rowsHidden += r.rows.filter((row) => !row.visible).length;
  }
  console.log(`[live] ${label} (right and bottom bands): ${hits} of ${points.length} points with tooltip; outside the box ${outside}; rows without visible value ${rowsHidden}`);
  await page.mouse.move(0, 0);
  return { hits, outside, rowsHidden };
}

function check(result, label, optional = false) {
  if (!optional) expect(result.hits, `${label}: some point has a tooltip`).toBeGreaterThan(0);
  expect(result.outside, `${label}: no tooltip outside the box of the map`).toBe(0);
  if (result.longest) expect(result.longest.rows.every((r) => r.visible), `${label}: every row has its value visible`).toBe(true);
  if (result.rowsHidden !== undefined) expect(result.rowsHidden, `${label}: every row has its value visible`).toBe(0);
}

test.describe("tooltips of the four maps (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 1 at 1440 and 1280: subregions with topics; the cursor does not rebuild the map", async ({ page }) => {
    test.setTimeout(300000);
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-1");
      const sub = page.getByTestId("subregion-map");
      await ready(page, sub);
      await sub.evaluate((el) => {
        el.querySelectorAll("canvas").forEach((c) => (c.dataset.mark = "f84"));
        window.__root = el.firstElementChild;
      });
      const label = `Board 1 at ${width}`;
      const result = await survey(page, sub, label);
      check(result, label);
      const names = result.longest.rows.map((r) => r.name);
      expect(names).toContain("Tópicos principales:");
      expect(names).toContain("Con autores de Regionalización:");
      check(await edges(page, sub, label), `${label} edges`, true);
      const kept = await sub.evaluate((el) => ({ sameRoot: window.__root === el.firstElementChild, marked: [...el.querySelectorAll("canvas")].filter((c) => c.dataset.mark === "f84").length, canvases: el.querySelectorAll("canvas").length }));
      console.log(`[live] ${label}: after the walks same container ${kept.sameRoot}; canvases kept ${kept.marked} of ${kept.canvases}`);
      expect(kept.sameRoot).toBe(true);
      expect(kept.marked).toBe(kept.canvases);
    }
  });

  test("Board 2 at 1440: departments, subregions and countries", async ({ page }) => {
    test.setTimeout(300000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    for (const id of ["department-map", "subregion-map", "country-map"]) {
      const box = page.getByTestId(id);
      await ready(page, box);
      const label = `Board 2 ${id}`;
      check(await survey(page, box, label), label);
      check(await edges(page, box, label), `${label} edges`, true);
    }
  });
});
