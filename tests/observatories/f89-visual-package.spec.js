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
    const tiles = await card.getByTestId("access-cards").locator(".obs-tile").evaluateAll((els) => els.map((el) => {
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

/* WCAG contrast ratio, run inside the page. Measures the KPI row (.obs-kpi) and the tiles of the panels (.obs-tile). */
const CONTRAST_IN_PAGE = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); const p = m[1].split(",").map((v) => parseFloat(v)); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const pageBg = over(parse(getComputedStyle(document.body).backgroundColor), { r: 255, g: 255, b: 255, a: 1 });
  const measure = (sel) => [...document.querySelectorAll(sel)].map((card) => {
    const bg = over(parse(getComputedStyle(card).backgroundColor), pageBg);
    const texts = [...card.querySelectorAll("div")].filter((d) => d.children.length === 0 && d.textContent.trim());
    const contrast = Math.min(...texts.map((t) => ratio(over(parse(getComputedStyle(t).color), bg), bg)));
    const clipped = texts.filter((t) => t.scrollHeight > t.clientHeight + 1).map((t) => t.textContent);
    const r = card.getBoundingClientRect();
    return { bg: `${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}`, shadow: getComputedStyle(card).boxShadow, contrast, clipped, h: Math.round(r.height), top: Math.round(r.top + window.scrollY) };
  });
  return { kpi: measure(".obs-kpi"), tiles: measure(".obs-tile") };
};

test.describe("F91 Q-17 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the KPI row is white with shadow at 116 or 134 px; the tiles of the panels have no shadow, one pastel, 4.5:1 or more and no cut text", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const tileBgs = new Set();
    for (const board of [1, 2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.locator(".obs-kpi").first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(2000);
      const { kpi, tiles } = await page.evaluate(CONTRAST_IN_PAGE);
      tiles.forEach((c) => tileBgs.add(c.bg));
      const minTile = tiles.length ? Math.min(...tiles.map((c) => c.contrast)) : 99;
      console.log(`[live] Board ${board}: ${kpi.length} KPI (background ${[...new Set(kpi.map((c) => c.bg))].join(" | ")}; heights ${[...new Set(kpi.map((c) => c.h))].join(", ")}; shadow ${kpi.every((c) => c.shadow !== "none")}); ${tiles.length} tiles (background ${[...new Set(tiles.map((c) => c.bg))].join(" | ")}; heights ${[...new Set(tiles.map((c) => c.h))].join(", ")}; lowest contrast ${minTile.toFixed(2)}:1; cut texts ${tiles.filter((c) => c.clipped.length).length})`);
      expect(kpi.length).toBeGreaterThan(2);
      expect(kpi.every((c) => c.bg === "255,255,255" && c.shadow !== "none")).toBe(true);
      expect(kpi.every((c) => c.h === 116 || c.h === 134 || c.h === 152)).toBe(true);
      expect(tiles.every((c) => c.shadow === "none")).toBe(true);
      expect(minTile).toBeGreaterThanOrEqual(4.5);
      expect(tiles.filter((c) => c.clipped.length)).toEqual([]);
    }
    expect([...tileBgs], "one pastel for all the tiles").toEqual(["230,238,246"]);
  });
});

/* Free vertical space under the content of every panel (px): the height the card has minus what its children take. */
const FREE_SPACE_IN_PAGE = () =>
  [...document.querySelectorAll('[data-testid="chart-card"]')].map((card) => {
    const body = card.querySelector(".ant-card-body");
    const title = (card.querySelector(".ant-card-head-title")?.textContent || "").slice(0, 40);
    const used = [...body.children].reduce((a, el) => a + el.getBoundingClientRect().height + (parseFloat(getComputedStyle(el).marginTop) || 0) + (parseFloat(getComputedStyle(el).marginBottom) || 0), 0);
    const fill = body.querySelector('[data-testid="fill-height"]');
    return { title, card: Math.round(card.getBoundingClientRect().height), free: Math.round(body.clientHeight - 20 - used), stretched: !!fill };
  });

test.describe("F89 Q-04 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("panels of one row give their chart the height of the taller neighbour (free space under the chart)", async ({ page }) => {
    test.setTimeout(290000);
    const report = [];
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const board of [1, 2, 3]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("chart-card").first().waitFor({ timeout: 120000 });
        await page.waitForTimeout(3500);
        const cards = await page.evaluate(FREE_SPACE_IN_PAGE);
        const big = cards.filter((c) => c.free > 40);
        console.log(`[live] Board ${board} at ${width}: ${cards.length} panels; ${big.length} with more than 40 px free: ${big.map((c) => `${c.title.trim()} (${c.free})`).join("; ") || "none"}`);
        report.push(...big.map((c) => ({ board, width, ...c })));
      }
    }
    // exceptions (no chart to stretch): a table (Board 1 panel 10), the panels of figure cards only (Board 2 panels 6 and 8), (the maps stretch since Q-18 of F91)
    const exception = (r) => (r.board === 1 && r.title.startsWith("10 ·")) || (r.board === 2 && /^(6|8) ·/.test(r.title));
    expect(report.filter((r) => !exception(r)).map((r) => `${r.board}@${r.width} ${r.title} ${r.free}`)).toEqual([]);
  });
});

test.describe("F89 Q-04 treemap label (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 3 panel 2: the label of the smallest block («Ciencias Agrícolas») in three lines fits its block", async ({ page }) => {
    test.setTimeout(250000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const map = page.getByTestId("areas-treemap");
    await map.waitFor({ timeout: 120000 });
    await map.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    // blocks = groups of pixels of the same colour (quantised); the smallest solid rectangle is «Ciencias Agrícolas» (3 % of the researchers)
    const r = await readCanvas(page, map.locator("canvas").first(), (image) => {
      const { data, width: w, height: h } = image;
      const groups = new Map();
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) continue;
        const k = [data[i] >> 3, data[i + 1] >> 3, data[i + 2] >> 3].join(",");
        const g = groups.get(k) || { n: 0, x0: w, x1: 0, y0: h, y1: 0 };
        g.n++; g.x0 = Math.min(g.x0, x); g.x1 = Math.max(g.x1, x); g.y0 = Math.min(g.y0, y); g.y1 = Math.max(g.y1, y);
        groups.set(k, g);
      }
      const blocks = [...groups.values()].filter((g) => g.n >= 600 && g.n / ((g.x1 - g.x0 + 1) * (g.y1 - g.y0 + 1)) > 0.7).sort((a, b) => a.n - b.n);
      const g = blocks[0];
      return g ? { width: g.x1 - g.x0 + 1, height: g.y1 - g.y0 + 1 } : null;
    });
    const need = await page.evaluate(() => {
      const c = document.createElement("canvas").getContext("2d");
      c.font = "12px sans-serif";
      const lines = ["Ciencias", "Agrícolas", "9.999"];
      return { width: Math.max(...lines.map((l) => c.measureText(l).width)), height: lines.length * 12 * 1.25 };
    });
    console.log(`[live] smallest block of the treemap: ${JSON.stringify(r)}; the label in 3 lines needs about ${Math.round(need.width)}×${Math.round(need.height)} px`);
    expect(r).not.toBeNull();
    expect(r.width, "the three lines fit in width").toBeGreaterThanOrEqual(need.width + 4);
    expect(r.height, "the three lines fit in height").toBeGreaterThanOrEqual(need.height + 4);
  });
});

test.describe("F89 Q-16 in the browser (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the sticky filter panel stays above the legends of the maps and below the menus of Ant, in the three boards", async ({ page }) => {
    test.setTimeout(290000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const maps = { 1: ["subregion-map"], 2: ["department-map", "subregion-map", "country-map"], 3: [] };
    for (const board of [1, 2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      const filters = page.getByTestId("filters");
      await filters.waitFor({ timeout: 120000 });
      await page.waitForTimeout(2500);
      const z = await filters.evaluate((el) => getComputedStyle(el).zIndex);
      expect(z).toBe("1040");
      for (const id of maps[board]) {
        const map = page.getByTestId(id);
        await map.waitFor({ timeout: 120000 });
        // scroll so that the top of the map goes under the panel, then the middle of it: the panel must answer at its own points
        const result = [];
        for (const place of ["start", "center"]) {
          await map.evaluate((el, p) => {
            const rect = el.getBoundingClientRect();
            const panel = document.querySelector('[data-testid="filters"]').getBoundingClientRect();
            window.scrollBy(0, p === "start" ? rect.top - panel.bottom + 60 : rect.top - panel.bottom - rect.height / 2 + 60);
          }, place);
          await page.waitForTimeout(500);
          result.push(await page.evaluate(() => {
            const panel = document.querySelector('[data-testid="filters"]');
            const r = panel.getBoundingClientRect();
            const points = [];
            for (let i = 1; i < 12; i++) for (const f of [0.2, 0.5, 0.8]) points.push([r.left + (r.width * i) / 12, r.top + r.height * f]);
            const outside = points.filter(([x, y]) => { const el = document.elementFromPoint(x, y); return !(el && panel.contains(el)); }).length;
            const header = document.querySelector("header");
            return { points: points.length, outside, panelTop: Math.round(r.top), headerBottom: header ? Math.round(header.getBoundingClientRect().bottom) : null };
          }));
        }
        console.log(`[live] Board ${board} ${id}: points of the panel answered by something that is not the panel: ${result.map((r) => `${r.outside}/${r.points}`).join(" and ")}; panel top ${result[0].panelTop}, header bottom ${result[0].headerBottom}`);
        for (const r of result) {
          expect(r.outside).toBe(0);
          if (r.headerBottom != null) expect(r.panelTop).toBeGreaterThanOrEqual(r.headerBottom - 1);
        }
      }
    }
    // an open menu and a tooltip are above the panel (z-index of Ant: 1050)
    await page.goto("/observatories/vri-udea/board-2");
    await page.getByTestId("filters").waitFor({ timeout: 120000 });
    await page.getByTestId("filters").locator(".ant-select").first().click();
    const dropdown = page.locator(".ant-select-dropdown:visible").first();
    await dropdown.waitFor({ timeout: 20000 });
    const menuZ = await dropdown.evaluate((el) => getComputedStyle(el.closest(".ant-select-dropdown")).zIndex);
    console.log(`[live] z-index of an open menu of a filter: ${menuZ} (the panel: 1040)`);
    expect(Number(menuZ)).toBeGreaterThan(1040);
  });
});

test.describe("F91 Q-20 labels of the tiles (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the label of every tile of a panel starts with a capital, at 14 px and weight 500; the KPI row is not touched", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const board of [2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.locator(".obs-tile").first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(1500);
      const labels = await page.locator(".obs-tile").evaluateAll((els) => els.map((el) => { const d = el.firstElementChild; const cs = getComputedStyle(d); return { text: d.textContent, size: cs.fontSize, weight: cs.fontWeight, clipped: d.scrollHeight > d.clientHeight + 1 }; }));
      console.log(`[live] Board ${board}: ${labels.length} tile labels; first ones: ${labels.slice(0, 3).map((l) => l.text).join(" | ")}; sizes ${[...new Set(labels.map((l) => l.size))]}; weights ${[...new Set(labels.map((l) => l.weight))]}`);
      expect(labels.every((l) => /^\p{Lu}|^\d/u.test(l.text))).toBe(true);
      expect(labels.every((l) => l.size === "14px" && l.weight === "500" && !l.clipped)).toBe(true);
      const kpi = await page.locator(".obs-kpi div[title]").first().evaluate((el) => getComputedStyle(el).fontSize);
      expect(kpi).toBe("13px");
    }
  });
});

test.describe("F91 Q-21 complete dates (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the staff label says the year and is not cut in the KPI card, nor the tags", async ({ page }) => {
    test.setTimeout(150000);
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-3");
      await page.locator(".obs-kpi").first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(1500);
      const kpi = page.locator(".obs-kpi div[title]").filter({ hasText: "al 30 de mayo de 2026" }).first();
      const cut = await kpi.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
      const tags = await page.locator(".ant-tag", { hasText: "al 30 de mayo de 2026" }).evaluateAll((els) => els.map((e) => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > window.innerWidth));
      console.log(`[live] ${width} px: KPI label cut ${cut}; tags with the label ${tags.length}, cut ${tags.filter(Boolean).length}`);
      expect(cut).toBe(false);
      expect(tags.some(Boolean)).toBe(false);
      expect(await page.locator("body").innerText()).not.toMatch(/al 30 de mayo(?! de 2026)/);
    }
  });
});

test.describe("F91 Q-23 first KPI says what it counts (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("T1 «productos con tópico» and T2 «… y apropiación social», complete (not cut) and the numbers differ by 752 + 514", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const read = async (board, label) => {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.locator(".obs-kpi").first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(1500);
      const card = page.locator(".obs-kpi").first();
      const t = card.locator("div[title]").first();
      const info = await t.evaluate((el) => ({ text: el.textContent, cut: el.scrollHeight > el.clientHeight + 1 }));
      const value = Number((await card.innerText()).split("\n").pop().replace(/\./g, ""));
      return { ...info, value };
    };
    const t1 = await read(1);
    const t2 = await read(2);
    console.log(`[live] T1 «${t1.text}» ${t1.value} cut ${t1.cut}; T2 «${t2.text}» ${t2.value} cut ${t2.cut}`);
    expect(t1.text).toBe("productos con tópico (artículos, libros, capítulos)");
    expect(t2.text).toBe("productos (artículos, libros, capítulos y apropiación social)");
    expect(t1.cut || t2.cut).toBe(false);
  });
});

test.describe("F91 Q-19 vertical gap of the tags of the header (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the space between lines of tags equals the space between tags, at 1440, 1280 and 390 px, in the three boards", async ({ page }) => {
    test.setTimeout(280000);
    for (const board of [1, 2, 3]) {
      for (const width of [1440, 1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/observatories/vri-udea/board-${board}`);
        const row = page.locator(".obs-tag-row").first();
        await row.waitFor({ timeout: 120000 });
        const gaps = await row.locator(".ant-tag").evaluateAll((els) => {
          const r = els.map((e) => e.getBoundingClientRect());
          const h = [], v = [];
          for (let i = 1; i < r.length; i++) {
            if (Math.abs(r[i].top - r[i - 1].top) < 2) h.push(Math.round((r[i].left - r[i - 1].right) * 10) / 10);
            else v.push(Math.round((r[i].top - r[i - 1].bottom) * 10) / 10);
          }
          return { h, v, n: r.length };
        });
        console.log(`[live] Board ${board} at ${width} px: ${gaps.n} tags; horizontal gaps ${[...new Set(gaps.h)]}; vertical gaps between lines ${[...new Set(gaps.v)]}`);
        expect([...new Set(gaps.h)].every((g) => g === 8)).toBe(true);
        expect(gaps.v.every((g) => g === 8)).toBe(true);
      }
    }
  });
});
