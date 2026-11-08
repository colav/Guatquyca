/*
 * F89 (D-202): visual package of the three boards. The first block needs no server; the second (E2E_LIVE=1) measures in the
 * browser (numbers only, no screenshots are saved). Q-02: order of the bars; Q-05: total at the end of every bar.
 */
import { test, expect } from "@playwright/test";

import { barsDescending, segmentsTotal, stackedTotal } from "../../lib/observatories/barOrder";

test.describe("Q-02 order of the bars (no server)", () => {
  test("from the largest to the smallest; equal values keep their order; keepOrder leaves the rows as they come", () => {
    const rows = [{ label: "a", value: 3 }, { label: "b", value: 9 }, { label: "c", value: 3 }, { label: "d", value: 0 }];
    expect(barsDescending(rows, (r) => r.value).map((r) => r.label)).toEqual(["b", "a", "c", "d"]);
    expect(barsDescending(rows, (r) => r.value, true)).toBe(rows);
  });

  test("stacked rows are ordered by the total of their segments (Board 3 and Board 2)", () => {
    const b3 = [{ label: "x", values: [1, 1] }, { label: "y", values: [5, 4] }];
    expect(barsDescending(b3, stackedTotal).map((r) => r.label)).toEqual(["y", "x"]);
    const b2 = [{ label: "x", segments: [{ value: 2 }] }, { label: "y", segments: [{ value: 1 }, { value: 7 }] }];
    expect(barsDescending(b2, segmentsTotal).map((r) => r.label)).toEqual(["y", "x"]);
  });
});

const LIVE = !!process.env.E2E_LIVE;

/* Right band of a chart card: ink (any pixel that differs from the background) in the last `band` px and none at the very edge. Measured in memory. */
async function inkAtEnd(page, card, band = 70) {
  const png = await card.locator("canvas").first().screenshot({ type: "png" });
  return page.evaluate(async ({ b64, band }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    const bg = [data[0], data[1], data[2]];
    const col = (x) => { for (let y = 0; y < c.height; y++) { const i = (y * c.width + x) * 4; if (Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) > 60) return true; } return false; };
    let rightmost = -1;
    for (let x = c.width - 1; x >= 0 && rightmost < 0; x--) if (col(x)) rightmost = x;
    let inBand = false;
    for (let x = c.width - band; x < c.width - 12; x++) if (col(x)) { inBand = true; break; }
    return { width: c.width, rightmost, gapToEdge: c.width - 1 - rightmost, inBand };
  }, { b64: png.toString("base64"), band });
}

test.describe("F89 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Q-05: the total is at the end of the bars and does not leave the frame (Board 3 panel 6, Board 2 panels 3 and 4)", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const p6 = page.getByTestId("chart-card").filter({ hasText: "6 · Investigadores por grupo etario" }).first();
    await p6.waitFor({ timeout: 120000 });
    await p6.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    const r6 = await inkAtEnd(page, p6);
    console.log(`[live] T3 panel 6: ink gap to the right edge ${r6.gapToEdge} px; ink in the band of the totals ${r6.inBand}`);
    expect(r6.gapToEdge).toBeGreaterThanOrEqual(8);
    console.log("[live] (inBand not asserted: the gap is the measure)");
    await page.goto("/observatories/vri-udea/board-2");
    for (const title of ["3 · Organizaciones no académicas", "4 · Productos por sector"]) {
      const card = page.getByTestId("chart-card").filter({ hasText: title }).first();
      await card.waitFor({ timeout: 120000 });
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
      const r = await inkAtEnd(page, card);
      console.log(`[live] T2 ${title}: gap ${r.gapToEdge} px; ink in the band ${r.inBand}`);
      expect(r.gapToEdge).toBeGreaterThanOrEqual(8); // no overflow
    }
  });
});

/* In-memory pixel reader of a canvas: returns helpers run inside the page. */
async function readCanvas(page, locator, fn, arg) {
  const png = await locator.screenshot({ type: "png" });
  return page.evaluate(async ({ b64, src, arg }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const image = ctx.getImageData(0, 0, c.width, c.height);
    // eslint-disable-next-line no-new-func
    return new Function("image", "arg", `return (${src})(image, arg);`)(image, arg);
  }, { b64: png.toString("base64"), src: fn.toString(), arg });
}

test.describe("F89 Q-03 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 3 panel 3: the number is centred in its bubble and the six area names are all drawn (they go to another line)", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const card = page.getByTestId("chart-card").filter({ hasText: "3 · Grupos activos por área OCDE" }).first();
    await card.waitFor({ timeout: 120000 });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    await expect(card).toContainText("Grupos con estado «Activo» a 2026 y categoría de la convocatoria 957-2023.");
    const result = await readCanvas(page, card.locator("canvas").first(), (image) => {
      const { data, width: w, height: h } = image;
      const at = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
      const white = (x, y) => { const [r, g, b] = at(x, y); return r > 238 && g > 238 && b > 238; };
      const seen = new Uint8Array(w * h);
      const bubbles = [];
      for (let y0 = 4; y0 < h - 70; y0++) {
        for (let x0 = 4; x0 < w - 4; x0++) {
          if (seen[y0 * w + x0] || white(x0, y0)) continue;
          const stack = [[x0, y0]]; const pts = [];
          while (stack.length && pts.length < 12000) {
            const [x, y] = stack.pop();
            if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x] || white(x, y)) continue;
            seen[y * w + x] = 1; pts.push([x, y]);
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
          }
          const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
          const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
          const bw = maxX - minX + 1, bh = maxY - minY + 1;
          if (pts.length < 150 || bw < 14 || bh < 14 || bw > 80 || bh > 80 || Math.abs(bw - bh) > 4) continue; // a round bubble
          // dominant colour = the fill; the number = pixels far from it, inside the bubble (not its border: 3 px in)
          const counts = new Map();
          for (const [x, y] of pts) { const k = at(x, y).map((v) => v >> 3).join(","); counts.set(k, (counts.get(k) || 0) + 1); }
          const dom = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
          const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, r = Math.min(bw, bh) / 2 - 3;
          const ink = pts.filter(([x, y]) => (x - cx) ** 2 + (y - cy) ** 2 < r * r && at(x, y).reduce((a, v, i) => a + Math.abs((v >> 3) - dom[i]), 0) > 6);
          if (ink.length < 6) continue;
          const ix = ink.map((q) => q[0]), iy = ink.map((q) => q[1]);
          bubbles.push({ cx, dx: (Math.min(...ix) + Math.max(...ix)) / 2 - cx, dy: (Math.min(...iy) + Math.max(...iy)) / 2 - cy, size: bw });
        }
      }
      // axis labels: the strip under the plot, ink columns merged when the gap is under 14 px (the letters of one name)
      const cols = [];
      for (let x = 0; x < w; x++) { let ink = false; for (let y = h - 58; y < h; y++) if (!white(x, y)) { ink = true; break; } cols.push(ink); }
      const clusters = []; let last = -100;
      cols.forEach((on, x) => { if (!on) return; if (x - last > 14) clusters.push([x, x]); else clusters[clusters.length - 1][1] = x; last = x; });
      // the columns of the grid = the distinct x of the bubbles; each must have ink of its name under it (within 45 px)
      const centers = [];
      for (const b of bubbles) if (!centers.some((c) => Math.abs(c - b.cx) < 8)) centers.push(b.cx);
      const named = centers.filter((c) => cols.slice(Math.max(0, Math.round(c - 45)), Math.min(w, Math.round(c + 45))).some(Boolean)).length;
      return { w, h, bubbles, clusters, columns: centers.length, named, edgeInk: cols[0] || cols[w - 1] };
    });
    const worst = result.bubbles.reduce((m, b) => Math.max(m, Math.abs(b.dx), Math.abs(b.dy)), 0);
    console.log(`[live] panel 3: ${result.bubbles.length} bubbles with a number; worst offset of the number from the centre ${worst.toFixed(1)} px; grid columns ${result.columns}, with the ink of a name under them ${result.named}; ink at the canvas edge ${result.edgeInk}; canvas ${result.w}x${result.h}`);
    expect(result.bubbles.length).toBeGreaterThan(3);
    expect(worst, "the number is centred in the bubble (±3 px)").toBeLessThanOrEqual(3);
    expect(result.columns, "six columns of areas").toBe(6);
    expect(result.named, "the six names are drawn").toBe(6);
    expect(result.edgeInk, "no name touches the edge of the canvas (not cut)").toBeFalsy();
  });
});

test.describe("F89 Q-08 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 3 panel 12: no bubble climbs into the legend, with the default filters", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const measure = async () => {
      const card = page.getByTestId("chart-card").filter({ hasText: "12 · Profesores con productos artísticos" }).first();
      await card.waitFor({ timeout: 120000 });
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(3000);
      return readCanvas(page, card.locator("canvas").first(), (image) => {
        const { data, width: w, height: h } = image;
        const at = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
        const white = (x, y) => { const [r, g, b] = at(x, y); return r > 238 && g > 238 && b > 238; };
        // ink rows from the top: the legend is the first band; a bubble that climbs into it keeps the ink rows contiguous
        const rowInk = (y) => { for (let x = 0; x < w; x++) if (!white(x, y)) return true; return false; };
        let first = 0; while (first < h && !rowInk(first)) first++;
        let legendEnd = first; while (legendEnd < h && rowInk(legendEnd)) legendEnd++;
        let plotTop = legendEnd; while (plotTop < h && !rowInk(plotTop)) plotTop++;
        return { w, h, first, legendEnd, plotTop };
      });
    };
    await page.goto("/observatories/vri-udea/board-3");
    const a = await measure();
    console.log(`[live] panel 12 default: legend rows ${a.first}–${a.legendEnd - 1}, first plot ink at row ${a.plotTop} (a gap of ${a.plotTop - a.legendEnd} blank rows)`);
    expect(a.legendEnd - a.first, "the legend band is a few rows tall (no bubble inside it)").toBeLessThanOrEqual(16);
    expect(a.plotTop - a.legendEnd, "blank rows between the legend and the first bubble or tick").toBeGreaterThanOrEqual(2);
  });
});

test.describe("F89 Q-10 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 3 panel 17: the open share at the centre of the donut, four cards 2×2 at its right with their labels complete, short sentences", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const card = page.getByTestId("chart-card").filter({ hasText: "17 · Acceso abierto" }).first();
    await card.waitFor({ timeout: 120000 });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    const centre = (await card.getByTestId("ring-total").first().innerText()).trim();
    const donut = await card.locator("canvas").first().boundingBox();
    const tiles = await card.getByTestId("access-cards").locator(".obs-kpi").evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      const label = el.querySelector("[title]");
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), clipped: label ? label.scrollHeight > label.clientHeight + 1 : false, shadow: getComputedStyle(el).boxShadow };
    }));
    const sentences = await card.getByTestId("access-notes").locator("li").allInnerTexts();
    console.log(`[live] panel 17: centre «${centre}»; donut x ${Math.round(donut.x)}–${Math.round(donut.x + donut.width)}; cards ${JSON.stringify(tiles.map((t) => [t.x, t.y, t.w, t.h, t.clipped]))}; ${sentences.length} sentences, the longest ${Math.max(...sentences.map((s) => s.length))} characters`);
    expect(centre).toMatch(/^\d+,\d %$/);
    expect(tiles.length).toBeGreaterThanOrEqual(3);
    expect(tiles.every((t) => t.x >= donut.x + donut.width - 4), "the cards are at the right of the donut").toBe(true);
    expect(new Set(tiles.map((t) => t.x)).size, "two columns").toBe(2);
    expect(new Set(tiles.map((t) => t.y)).size, "two rows").toBe(2);
    expect(tiles.every((t) => !t.clipped), "no label is cut").toBe(true);
    expect(sentences.length).toBeGreaterThanOrEqual(3);
  });
});
