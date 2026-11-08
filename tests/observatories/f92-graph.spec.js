/*
 * F92 (Q-25, D-206, D-208): collaboration graph of Board 2. The first block needs no server (helpers and tooltips); the second
 * (E2E_LIVE=1) measures the four arrangements (ref, A, B, C) in one run and the two tooltips. Screenshots: f92-graph-capture.spec.js.
 */
import { test, expect } from "@playwright/test";

import { GRAPH_VARIANTS, graphLabels, graphTooltip, groupAnchors, labelBox, ringPositions } from "../../lib/observatories/collabGraph";

const LIVE = !!process.env.E2E_LIVE;

test.describe("F92 helpers of the graph (no server)", () => {
  test("variants", () => {
    expect(GRAPH_VARIANTS).toEqual(["ref", "A", "B", "C", "D"]);
  });

  test("an anchor per group on an ellipse, the first one on top", () => {
    const a = groupAnchors([0, 1, 2, 3], 800, 600);
    expect(a.get(0).x).toBeCloseTo(400);
    expect(a.get(0).y).toBeLessThan(300);
    expect(new Set([...a.values()].map((p) => `${Math.round(p.x)},${Math.round(p.y)}`)).size).toBe(4);
    expect(groupAnchors([5], 800, 600).get(5)).toEqual({ x: 400, y: 300 });
  });

  test("option B: nodes of a group are contiguous on its own ring and no two nodes of a ring touch", () => {
    const nodes = Array.from({ length: 12 }, (_, i) => ({ id: i, group: i % 3, r: 6 + (i % 5), degree: 20 - i }));
    const pos = ringPositions(nodes, 700, 520);
    expect(Object.keys(pos)).toHaveLength(12);
    for (const g of [0, 1, 2]) {
      const members = nodes.filter((n) => n.group === g);
      for (const a of members) for (const b of members) if (a.id < b.id) expect(Math.hypot(pos[a.id].x - pos[b.id].x, pos[a.id].y - pos[b.id].y)).toBeGreaterThanOrEqual(a.r + b.r);
    }
  });

  test("labels: the lower-degree label is dropped when two overlap, and there are never more than the limit", () => {
    const placed = [
      { id: "a", name: "Grupo de Investigación A", degree: 30, r: 14, x: 100, y: 100 },
      { id: "b", name: "Grupo de Investigación B", degree: 20, r: 12, x: 110, y: 104 },
      { id: "c", name: "Otro grupo", degree: 10, r: 8, x: 400, y: 300 },
    ];
    const chosen = graphLabels(placed);
    expect([...chosen.keys()]).toEqual(["a", "c"]);
    expect(graphLabels(Array.from({ length: 40 }, (_, i) => ({ id: String(i), name: "G", degree: i, r: 5, x: i * 100, y: 0 })), 14).size).toBe(14);
    expect(labelBox("x".repeat(40), 0, 0, 5).w).toBeLessThan(26 * 5.8 + 11);
  });

  test("tooltip of an edge: the two groups and the shared products, without «Grado»", () => {
    const html = graphTooltip("edge", { sourceName: "Grupo A", targetName: "Grupo B", weight: 1234 }, "Poppins");
    expect(html).toContain("Grupo A — Grupo B");
    expect(html).toContain("1.234");
    expect(html).toContain("productos compartidos");
    expect(html).not.toMatch(/Grado/);
    expect(html).toContain("font-family:Poppins");
  });

  test("tooltip of a node: full name, centre with its dot, «Colaboran con N grupos» and «M productos compartidos»", () => {
    const html = graphTooltip("node", { name: "Grupo con un nombre muy largo <b>", center: "Medicina", color: "#1b9e77", degree: 7, weight: 45 }, "Poppins");
    expect(html).toContain("Grupo con un nombre muy largo &lt;b&gt;");
    expect(html).toContain("Medicina");
    expect(html).toContain("#1b9e77");
    expect(html).toMatch(/Colaboran con <span[^>]*>7<\/span> grupos/);
    expect(html).toMatch(/<span[^>]*>45<\/span> productos compartidos/);
  });
});

/* Measures of one arrangement, read from the G6 instance that the component leaves in the element. */
const MEASURE_IN_PAGE = () => {
  const el = document.querySelector('[data-testid="collab-graph"]');
  const g = el.__g6;
  const nodes = g.getNodeData().map((n) => {
    const [x, y] = g.getElementPosition(n.id);
    return { id: n.id, x, y, r: n.data.radius, degree: n.data.degree, name: n.data.name, label: g.getElementRenderStyle(n.id).labelText || "" };
  });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  let touching = 0;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (dist(nodes[i], nodes[j]) < nodes[i].r + nodes[j].r) touching++;
  const meanMin = nodes.reduce((a, n) => a + Math.min(...nodes.filter((m) => m !== n).map((m) => dist(n, m) - n.r - m.r)), 0) / nodes.length;
  /* labels that overlap: the new labels (the ones drawn) and the old ones (top 10 by degree, centred on the node, font of 9.5 px) */
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const pairs = (boxes) => { let n = 0; for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (hit(boxes[i], boxes[j])) n++; return n; };
  const newBoxes = nodes.filter((n) => n.label).map((n) => { const w = n.label.length * 5.8 + 10; return { x: n.x - w / 2, y: n.y + n.r + 2, w, h: 16 }; });
  const oldBoxes = [...nodes].sort((a, b) => b.degree - a.degree).slice(0, 10).map((n) => { const t = n.name.length > 26 ? 26 : n.name.length; const w = t * 5.3; return { x: n.x - w / 2, y: n.y - 6, w, h: 12 }; });
  const edges = g.getEdgeData().map((e) => ({ id: e.id, w: e.data.weight, a: e.data.sourceName, b: e.data.targetName, s: e.source, t: e.target }));
  const [cx, cy] = g.getCanvasByClient([0, 0]);
  return {
    variant: el.dataset.variant, drawMs: Number(el.dataset.drawMs), height: Math.round(el.getBoundingClientRect().height), nodes: nodes.length, edges: edges.length,
    touching, meanMinGap: Math.round(meanMin * 10) / 10, labelsShown: newBoxes.length, labelOverlapNew: pairs(newBoxes), labelOverlapOld: pairs(oldBoxes), cx: Math.round(cx), cy: Math.round(cy),
  };
};

test.describe("F92 the four arrangements (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("measures of ref, A, B and C at 1440 px, and the two tooltips of the option C", async ({ page }) => {
    test.setTimeout(290000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const results = {};
    for (const v of GRAPH_VARIANTS) {
      await page.goto(`/observatories/vri-udea/board-2${v === "ref" ? "" : `?grafo=${v}`}`);
      const graph = page.getByTestId("collab-graph");
      await graph.waitFor({ timeout: 120000 });
      await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 60000 });
      await page.waitForTimeout(1500);
      results[v] = await page.evaluate(MEASURE_IN_PAGE);
    }
    console.log(`[live] ${JSON.stringify(results)}`);
    for (const v of GRAPH_VARIANTS) {
      expect(results[v].nodes).toBe(60);
      if (v !== "D") expect(results[v].labelOverlapNew, `${v}: labels overlap`).toBe(0); // D places its labels around the node (graphLabelsAround), measured in f94
    }
    expect(results.A.height).toBeGreaterThanOrEqual(520);
    expect(results.ref.height).toBe(460);
    expect(results.A.touching).toBeLessThanOrEqual(results.ref.touching);

    // tooltip of an edge and of a node, on the option C
    await page.goto("/observatories/vri-udea/board-2?grafo=C");
    await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    const target = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="collab-graph"]');
      el.scrollIntoView({ block: "center" });
      const g = el.__g6;
      const all = g.getNodeData().map((n) => ({ p: g.getElementPosition(n.id), r: n.data.radius }));
      /* the heaviest edge whose middle point is not under any node */
      const edge = [...g.getEdgeData()].sort((a, b) => b.data.weight - a.data.weight).find((e) => {
        const [sx, sy] = g.getElementPosition(e.source);
        const [tx, ty] = g.getElementPosition(e.target);
        const mx = (sx + tx) / 2, my = (sy + ty) / 2;
        return all.every((n) => Math.hypot(n.p[0] - mx, n.p[1] - my) > n.r + 6);
      });
      const [sx, sy] = g.getElementPosition(edge.source);
      const [tx, ty] = g.getElementPosition(edge.target);
      const [ex, ey] = g.getClientByCanvas([(sx + tx) / 2, (sy + ty) / 2]);
      const nodes = g.getNodeData().sort((a, b) => b.data.degree - a.data.degree);
      const n = nodes[0];
      const [nx, ny] = g.getClientByCanvas(g.getElementPosition(n.id));
      return { edges: g.getEdgeData().map((e) => ({ a: e.data.sourceName, b: e.data.targetName, w: e.data.weight })), edge: { x: ex, y: ey, weight: edge.data.weight, a: edge.data.sourceName, b: edge.data.targetName }, node: { x: nx, y: ny, name: n.data.name, degree: n.data.degree, weight: n.data.weight } };
    });
    await page.waitForTimeout(500);
    const rect = await page.getByTestId("collab-graph").boundingBox();
    const hover = async (x, y) => { for (let i = 0; i < 5; i++) await page.mouse.move(x - 4 + i * 2, y - 2 + i); await page.waitForTimeout(700); };
    await hover(target.edge.x, target.edge.y);
    /* the edge under the pointer may be a neighbour of the one aimed at: the tooltip must say the two groups and the weight of THAT edge in the graph data */
    const edgeText = (await page.locator(".tooltip").last().innerText()).replace(/\s+/g, " ").trim();
    const m = edgeText.match(/^(.+) — (.+?) ([\d.]+) productos compartidos$/);
    expect(m, `tooltip: ${edgeText}`).not.toBeNull();
    const real = target.edges.find((e) => e.a === m[1] && e.b === m[2]);
    console.log(`[live] edge tooltip «${edgeText}»; weight in the graph data (graph.links): ${real?.w}; container y ${Math.round(rect.y)}`);
    expect(real, "the pair is an edge of the graph").toBeTruthy();
    expect(m[3]).toBe(real.w.toLocaleString("es-CO"));
    expect(edgeText).not.toContain("Grado");
    await hover(target.node.x, target.node.y);
    const nodeText = await page.locator("body").innerText();
    expect(nodeText).toContain(target.node.name);
    expect(nodeText).toContain(`Colaboran con ${target.node.degree.toLocaleString("es-CO")} grupos`);
    expect(nodeText).toContain(`${target.node.weight.toLocaleString("es-CO")} productos compartidos`);
  });
});
