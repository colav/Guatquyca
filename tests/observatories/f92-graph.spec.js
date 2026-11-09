/*
 * F92 (Q-25, D-206, D-208): collaboration graph of Board 2. The first block needs no server (helpers and tooltips); the second
 * (E2E_LIVE=1) reads the two tooltips of the graph (the only one since F98; its measures are in f94-round3 and f97-graph).
 */
import { test, expect } from "@playwright/test";

import { graphTooltip, groupAnchors } from "../../lib/observatories/collabGraph";

const LIVE = !!process.env.E2E_LIVE;

test.describe("F92 helpers of the graph (no server)", () => {
  test("an anchor per group on an ellipse, the first one on top", () => {
    const a = groupAnchors([0, 1, 2, 3], 800, 600);
    expect(a.get(0).x).toBeCloseTo(400);
    expect(a.get(0).y).toBeLessThan(300);
    expect(new Set([...a.values()].map((p) => `${Math.round(p.x)},${Math.round(p.y)}`)).size).toBe(4);
    expect(groupAnchors([5], 800, 600).get(5)).toEqual({ x: 400, y: 300 });
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

test.describe("F92 tooltips of the graph (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the tooltip of an edge and of a node", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    await page.getByTestId("collab-graph").waitFor({ timeout: 120000 });
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
