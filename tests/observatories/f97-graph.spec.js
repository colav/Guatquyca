/*
 * F97 (Q-38, D-216): graph D with faint hulls and separated communities. Measures (live, 1.440 px, default filters): % of the hull surface
 * that is covered by two or more hulls, nodes with a visible label at the zoom of the fit, nodes that touch, draw time, and whether a hull
 * touches the border of the canvas. The hull is approximated by the convex hull of its nodes grown by the padding (the plugin draws a smooth
 * shape around the same points), so the numbers are comparable between runs, not exact.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const PADDING = Number(process.env.D_PADDING || 6);

const MEASURE = (padding) => {
  const el = document.querySelector('[data-testid="collab-graph"]');
  const g = el.__g6;
  const nodes = g.getNodeData().map((n) => { const [x, y] = g.getElementPosition(n.id); return { x, y, r: n.data.radius, community: n.data.community, label: g.getElementRenderStyle(n.id).labelText || "" }; });
  const byCommunity = new Map();
  nodes.forEach((n) => byCommunity.set(n.community, [...(byCommunity.get(n.community) || []), n]));
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const hullOf = (pts) => {
    const p = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
    if (p.length < 3) return p;
    const lower = [];
    for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
    const upper = [];
    for (const q of [...p].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
  };
  const inside = (poly, pt) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) if ((poly[i].y > pt.y) !== (poly[j].y > pt.y) && pt.x < ((poly[j].x - poly[i].x) * (pt.y - poly[i].y)) / (poly[j].y - poly[i].y) + poly[i].x) c = !c; return c; };
  const dist = (poly, pt) => { let m = Infinity; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; const dx = b.x - a.x, dy = b.y - a.y; const t = Math.max(0, Math.min(1, ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / (dx * dx + dy * dy || 1))); m = Math.min(m, Math.hypot(pt.x - a.x - t * dx, pt.y - a.y - t * dy)); } return m; };
  const hulls = [...byCommunity.values()].filter((m) => m.length >= 2).map((m) => ({ poly: hullOf(m), pts: m }));
  const covers = (h, pt) => (h.poly.length >= 3 ? inside(h.poly, pt) || dist(h.poly, pt) <= padding : h.pts.some((q) => Math.hypot(q.x - pt.x, q.y - pt.y) <= padding + q.r));
  const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
  const x0 = Math.min(...xs) - 60, x1 = Math.max(...xs) + 60, y0 = Math.min(...ys) - 60, y1 = Math.max(...ys) + 60;
  let one = 0, many = 0;
  for (let x = x0; x <= x1; x += 4) for (let y = y0; y <= y1; y += 4) { const n = hulls.filter((h) => covers(h, { x, y })).length; if (n >= 1) one++; if (n >= 2) many++; }
  // border: the hull (nodes grown by padding) against the viewport of the canvas
  const [vx0, vy0] = g.getCanvasByViewport([0, 0]);
  const [vx1, vy1] = g.getCanvasByViewport([el.clientWidth, el.clientHeight]);
  const margin = Math.min(...hulls.flatMap((h) => h.pts.flatMap((q) => [q.x - q.r - padding - vx0, vx1 - (q.x + q.r + padding), q.y - q.r - padding - vy0, vy1 - (q.y + q.r + padding)])));
  let touching = 0;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < nodes[i].r + nodes[j].r) touching++;
  const part = new Map();
  const edges = g.getEdgeData();
  const comm = new Map(g.getNodeData().map((n) => [n.id, n.data.community]));
  const all = edges.reduce((a, e) => a + e.data.weight, 0);
  const within = edges.filter((e) => comm.get(e.source) === comm.get(e.target)).reduce((a, e) => a + e.data.weight, 0);
  return {
    communities: byCommunity.size,
    overlapPct: Math.round((1000 * many) / Math.max(1, one)) / 10,
    labels: nodes.filter((n) => n.label).length,
    touching,
    drawMs: Number(el.dataset.drawMs),
    hullMarginPx: Math.round(margin * g.getZoom() * 10) / 10,
    insidePct: Math.round((1000 * within) / all) / 10,
    zoom: Math.round(g.getZoom() * 100) / 100,
    nodes: nodes.length,
    edges: edges.length,
    part: part.size,
  };
};

test.describe("F97 graph D (one run per measure)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("faint hulls, separated communities, no hull on the border", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const runs = [];
    for (let i = 0; i < 3; i++) {
      await page.goto("/observatories/vri-udea/board-2");
      await page.getByTestId("collab-graph").waitFor({ timeout: 120000 });
      await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 60000 });
      await page.waitForTimeout(3000);
      runs.push(await page.evaluate(MEASURE, PADDING));
    }
    console.log(`[live] D ${JSON.stringify(runs)}`);
    const m = runs[0];
    expect(m.nodes).toBe(60);
    expect(m.edges).toBe(220);
    expect(m.touching).toBe(0);
    expect(m.hullMarginPx).toBeGreaterThan(0);
    expect(m.overlapPct).toBeLessThan(15);
  });

  test("the hulls are faint: low fill, thin outline", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 120000 });
    const hull = await page.evaluate(() => JSON.parse(document.querySelector('[data-testid="collab-graph"]').dataset.hullStyle || "null"));
    expect(hull).not.toBeNull();
    expect(hull.fillOpacity).toBeLessThanOrEqual(0.06);
    expect(hull.lineWidth).toBeLessThanOrEqual(1);
    expect(hull.padding).toBeLessThanOrEqual(8);
  });
});
