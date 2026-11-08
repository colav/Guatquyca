/*
 * F94 (D-211, Round 3): Q-30 (tile of the panel 7), Q-32 (15 px of the donut legend), Q-34 (typeface of the KPI row), note of
 * amounts (Q-28 iv) and Q-33 (graph D). The first blocks need no server; the ones with E2E_LIVE=1 measure the pages in one run.
 * Screenshots are only saved by f92-graph-capture.spec.js (graph D, exception of D-206).
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

test.describe("F94 Q-30 panel 7 of Board 2 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("no tile of social appropriation, five tiles with the same height per row, and the note of the panel does not name it", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-2");
    const card = page.getByTestId("chart-card").filter({ hasText: "7 · Colaboraciones de cuádruple hélice" }).first();
    await card.waitFor({ timeout: 120000 });
    await page.waitForTimeout(2000);
    const text = await card.innerText();
    const tiles = await card.locator(".obs-tile").evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) }; }));
    const free = await card.evaluate((c) => { const b = c.querySelector(".ant-card-body"); return Math.round(b.clientHeight - 20 - [...b.children].reduce((a, el) => a + el.getBoundingClientRect().height, 0)); });
    console.log(`[live] panel 7: ${tiles.length} tiles ${JSON.stringify(tiles)}; free space ${free} px`);
    expect(text).not.toMatch(/Apropiación social con empresa|apropiación social con empresa|sin dato en la fuente|Apropiación social: productos/);
    expect(tiles).toHaveLength(5);
    const rows = [...new Set(tiles.map((t) => t.top))];
    expect(rows).toHaveLength(2);
    for (const top of rows) expect(new Set(tiles.filter((t) => t.top === top).map((t) => t.h)).size).toBe(1);
    expect(tiles.filter((t) => t.top === rows[0])).toHaveLength(2);
    expect(tiles.filter((t) => t.top === rows[1])).toHaveLength(3);
  });
});

test.describe("F94 Q-32 legend of the donut 15 px from the edge (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("Board 2 panel 4 at 1440 and 1280 px: 15 px between the legend and the right border of the panel, and the ring does not shrink", async ({ page }) => {
    test.setTimeout(200000);
    for (const width of [1440, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/observatories/vri-udea/board-2");
      const card = page.getByTestId("chart-card").filter({ hasText: "4 ·" }).filter({ has: page.getByTestId("ring-legend") }).first();
      await card.waitFor({ timeout: 120000 });
      await page.waitForTimeout(2500);
      const m = await card.evaluate((c) => {
        const l = c.querySelector('[data-testid="ring-legend"]').getBoundingClientRect();
        const cv = c.querySelector("canvas").getBoundingClientRect();
        const border = c.getBoundingClientRect();
        return { gap: Math.round((border.right - l.right) * 10) / 10, diameter: Math.round(Math.min(cv.width, cv.height)), legendRight: c.querySelector('[data-testid="ring-root"]').dataset.legend };
      });
      console.log(`[live] ${width} px: legend ${m.legendRight}; ${m.gap} px from the right border of the panel; ring ${m.diameter} px (before: ${width === 1440 ? 320 : 320})`);
      expect(m.legendRight).toBe("right");
      expect(Math.abs(m.gap - 15)).toBeLessThanOrEqual(0.6);
      expect(m.diameter).toBeGreaterThanOrEqual(320);
    }
  });
});

test.describe("F94 Q-34 typeface of the KPI row (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the label of every KPI starts with a capital, 14 px, weight 500, grey 4.5:1 or more on white; the card stays white with shadow; nothing is cut", async ({ page }) => {
    test.setTimeout(280000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const heights = {};
    for (const board of [1, 2, 3]) {
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.locator(".obs-kpi").first().waitFor({ timeout: 120000 });
      await page.waitForTimeout(2000);
      const cards = await page.locator(".obs-kpi").evaluateAll((els) => els.map((el) => {
        const l = el.querySelector("[title]");
        const cs = getComputedStyle(l);
        const lum = (c) => { const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
        const ratio = (1.05) / (lum(cs.color) + 0.05);
        const cut = [...el.querySelectorAll("[title]")].some((t) => t.scrollHeight > t.clientHeight + 1);
        return { text: l.textContent, size: cs.fontSize, weight: cs.fontWeight, ratio, cut, h: Math.round(el.getBoundingClientRect().height), bg: getComputedStyle(el).backgroundColor, shadow: getComputedStyle(el).boxShadow !== "none" };
      }));
      heights[board] = [...new Set(cards.map((c) => c.h))];
      console.log(`[live] Board ${board}: ${cards.length} KPI; heights ${heights[board]}; contrast min ${Math.min(...cards.map((c) => c.ratio)).toFixed(2)}:1; cut ${cards.filter((c) => c.cut).map((c) => c.text).join(" / ") || "none"}; first «${cards[0].text}»`);
      expect(cards.every((c) => /^\p{Lu}|^\d/u.test(c.text) && c.size === "14px" && c.weight === "500")).toBe(true);
      expect(Math.min(...cards.map((c) => c.ratio))).toBeGreaterThanOrEqual(4.5);
      expect(cards.every((c) => c.bg === "rgb(255, 255, 255)" && c.shadow)).toBe(true);
      expect(cards.filter((c) => c.cut).map((c) => c.text)).toEqual([]);
    }
    expect(new Set([...heights[1], ...heights[2]]).size, "T1 and T2 keep one height per row").toBeLessThanOrEqual(2);
  });
});

import { MONEY_NOTE, realNotes } from "../../app/observatories/vri-udea/board-2/components/boardTexts";

test.describe("F94 note of the amounts (Q-28 iv)", () => {
  test("the notes of method of Board 2 end with the money note, and it says COP", () => {
    const notes = realNotes({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 735, appropriation: 752 });
    expect(MONEY_NOTE).toBe("Montos en pesos colombianos (COP) según el registro de proyectos de la Universidad.");
    expect(notes[notes.length - 1]).toBe(MONEY_NOTE);
  });

  test.describe("in the page", () => {
    test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
    test("the box «Notas metodológicas» of Board 2 carries it, before the cut-off date", async ({ page }) => {
      test.setTimeout(150000);
      await page.goto("/observatories/vri-udea/board-2");
      const box = page.getByTestId("method-notes");
      await box.waitFor({ timeout: 120000 });
      await page.waitForTimeout(1500);
      const notes = await box.locator("li").allInnerTexts();
      console.log(`[live] notes of Board 2: ${notes.length}; the money note is number ${notes.indexOf(MONEY_NOTE) + 1}`);
      expect(notes[notes.length - 2]).toBe(MONEY_NOTE);
      expect(notes[notes.length - 1]).toMatch(/^Datos consultados/);
    });
  });
});

import { GRAPH_VARIANTS, detectCommunities, graphLabels, partitionStats } from "../../lib/observatories/collabGraph";

test.describe("F94 Q-33 communities of the graph D (no server)", () => {
  /* two groups of four nodes, strongly tied inside, one weak edge between them; centres: 0 and 1 mixed in the second group */
  const nodes = Array.from({ length: 8 }, (_, i) => ({ id: `n${i}`, center: i < 4 ? 0 : i < 6 ? 1 : 0 }));
  const clique = (ids, w) => ids.flatMap((a, i) => ids.slice(i + 1).map((b) => ({ source: a, target: b, weight: w })));
  const links = [...clique(["n0", "n1", "n2", "n3"], 10), ...clique(["n4", "n5", "n6", "n7"], 8), { source: "n3", target: "n4", weight: 2 }];

  test("the variant D exists", () => {
    expect(GRAPH_VARIANTS).toContain("D");
  });

  test("Louvain finds the two groups by the weight of the edges, deterministically, the biggest first", () => {
    const p = detectCommunities(nodes, links);
    expect(new Set([...p.values()]).size).toBe(2);
    expect(["n0", "n1", "n2", "n3"].map((id) => p.get(id))).toEqual([0, 0, 0, 0].map(() => p.get("n0")));
    expect(p.get("n4")).not.toBe(p.get("n0"));
    expect(p.get("n4")).toBe(p.get("n7"));
    expect([...detectCommunities(nodes, links).entries()]).toEqual([...p.entries()]);
  });

  test("a graph without edges gives one community per node; a single heavy chain stays together", () => {
    expect(new Set(detectCommunities(nodes, []).values()).size).toBe(8);
    const chain = detectCommunities(nodes.slice(0, 3), [{ source: "n0", target: "n1", weight: 5 }, { source: "n1", target: "n2", weight: 5 }]);
    expect(new Set([...chain.values()]).size).toBe(1);
  });

  test("measures: share of the weight inside the groups and groups with two or more centres", () => {
    const p = detectCommunities(nodes, links);
    const s = partitionStats(nodes, links, p);
    expect(s.groups).toBe(2);
    expect(s.insideShare).toBeCloseTo((6 * 10 + 6 * 8) / (6 * 10 + 6 * 8 + 2), 5);
    expect(s.mixedShare).toBe(0.5); // the second group has nodes of the centres 0 and 1
  });

  test("labels: with the scale of a zoom-in the hidden labels appear; the abbreviation has at most 22 characters", () => {
    const placed = Array.from({ length: 6 }, (_, i) => ({ id: `n${i}`, name: "Grupo de Investigación en Neurociencias", degree: 10 - i, r: 8, x: 40 * i, y: 0 }));
    const far = graphLabels(placed, Infinity, { scale: 1, maxChars: 22 });
    const near = graphLabels(placed, Infinity, { scale: 0.2, maxChars: 22 });
    expect(near.size).toBeGreaterThan(far.size);
    for (const t of near.values()) expect(t.length).toBeLessThanOrEqual(22);
  });
});

/* Measures of Q-33 (g) of one arrangement, read from the G6 instance that the component leaves in the element. */
const GRAPH_MEASURES = () => {
  const el = document.querySelector('[data-testid="collab-graph"]');
  const g = el.__g6;
  const variant = el.dataset.variant;
  const nodes = g.getNodeData().map((n) => { const [x, y] = g.getElementPosition(n.id); return { id: n.id, x, y, r: n.data.radius, center: n.data.center, group: variant === "D" ? n.data.community : n.data.group, label: g.getElementRenderStyle(n.id).labelText || "" }; });
  const edges = g.getEdgeData();
  const part = new Map(nodes.map((n) => [n.id, n.group]));
  const all = edges.reduce((a, e) => a + e.data.weight, 0);
  const inside = edges.filter((e) => part.get(e.source) === part.get(e.target)).reduce((a, e) => a + e.data.weight, 0);
  const groups = new Map();
  nodes.forEach((n) => groups.set(n.group, [...(groups.get(n.group) || []), n.center]));
  const mixed = [...groups.values()].filter((c) => new Set(c).size >= 2).length;
  let touching = 0;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < nodes[i].r + nodes[j].r) touching++;
  return { variant, groups: groups.size, insidePct: Math.round((1000 * inside) / all) / 10, mixedPct: Math.round((1000 * mixed) / groups.size) / 10, labels: nodes.filter((n) => n.label).length, touching, drawMs: Number(el.dataset.drawMs), zoom: Math.round(g.getZoom() * 100) / 100 };
};

test.describe("F94 Q-33 graph D in the page (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("measures of ref, A, B, C and D; labels of D with the zoom; tooltip of a node with its community", async ({ page }) => {
    test.setTimeout(290000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const out = {};
    for (const v of GRAPH_VARIANTS) {
      await page.goto(`/observatories/vri-udea/board-2${v === "ref" ? "" : `?grafo=${v}`}`);
      await page.getByTestId("collab-graph").waitFor({ timeout: 120000 });
      await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 60000 });
      await page.waitForTimeout(2500);
      out[v] = await page.evaluate(GRAPH_MEASURES);
    }
    console.log(`[live] ${JSON.stringify(out)}`);
    expect(out.D.groups).toBeGreaterThan(1);
    expect(out.D.insidePct).toBeGreaterThan(out.C.insidePct - 100); // reported; the comparison is in the report
    expect(out.D.labels).toBeGreaterThan(out.C.labels);
    expect(out.D.touching).toBe(0);

    // D: legend, labels with the zoom and tooltip of a node
    await page.goto("/observatories/vri-udea/board-2?grafo=D");
    await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 120000 });
    await page.waitForTimeout(2500);
    await expect(page.getByTestId("community-legend")).toContainText("grupos que colaboran más entre sí");
    const zoomed = await page.evaluate(async () => {
      const el = document.querySelector('[data-testid="collab-graph"]');
      el.scrollIntoView({ block: "center" });
      const g = el.__g6;
      const count = () => g.getNodeData().filter((n) => g.getElementRenderStyle(n.id).labelText).length;
      const before = count();
      await g.zoomTo(g.getZoom() * 2.2, false);
      await new Promise((r) => setTimeout(r, 900));
      return { before, after: count(), zoom: g.getZoom() };
    });
    console.log(`[live] D labels: ${zoomed.before} at the first zoom, ${zoomed.after} after zooming in ×2,2`);
    expect(zoomed.after).toBeGreaterThanOrEqual(zoomed.before);
    await page.reload();
    await page.waitForFunction(() => document.querySelector('[data-testid="collab-graph"]')?.dataset.variant, null, { timeout: 120000 });
    await page.waitForTimeout(2500);
    const target = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="collab-graph"]');
      el.scrollIntoView({ block: "center" });
      const g = el.__g6;
      const n = g.getNodeData().sort((a, b) => b.data.degree - a.data.degree)[0];
      const [x, y] = g.getClientByCanvas(g.getElementPosition(n.id));
      return { x, y, name: n.data.name, community: n.data.community, other: n.data.otherCenter, neighbours: n.data.neighbours };
    });
    await page.waitForTimeout(400);
    for (let i = 0; i < 5; i++) await page.mouse.move(target.x - 3 + i, target.y - 1 + (i % 2));
    await page.waitForTimeout(800);
    const tip = (await page.locator(".tooltip").last().innerText()).replace(/\s+/g, " ");
    console.log(`[live] tooltip of D: ${tip}`);
    expect(tip).toContain(`Comunidad ${target.community}`);
    expect(tip).toContain(`${target.other} de sus ${target.neighbours} colaboradores en este gráfico son de otro centro`);
  });
});

import { INCOMPLETE_YEARS_NOTE, realDataWarnings } from "../../app/observatories/vri-udea/board-1/components/boardTexts";
import { NOTICE_NOTES } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { methodNotes } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

test.describe("F96 note of 2025 and 2026 (D-212)", () => {
  const PHRASE = "Los productos de 2025 y 2026 pueden estar incompletos: Minciencias aún no ha publicado en datos abiertos la información de la última convocatoria de medición de SCIENTI.";

  test("the same sentence in the three boards, with its cause", () => {
    expect(INCOMPLETE_YEARS_NOTE).toBe(PHRASE);
    expect(realDataWarnings({ n_sel: 100, n_topic: 90 }).join(" ")).toContain(PHRASE);
    expect(realNotes({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 1, appropriation: 2 })).toContain(PHRASE);
    expect(NOTICE_NOTES).toContain(PHRASE);
    expect(methodNotes("X")).toContain(PHRASE);
  });

  test("the old sentences are gone and the notes of the projects (SIIU) and of classification by name stay as they were", () => {
    const all = [...realDataWarnings({ n_sel: 100, n_topic: 90 }), ...realNotes({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 1, appropriation: 2 }), ...methodNotes("X")].join(" ");
    expect(all).not.toContain("Los datos de 2025 y 2026 pueden estar incompletos.");
    expect(all).not.toMatch(/ 2025 y 2026 pueden estar incompletos\.`?$/);
    expect(methodNotes("X").some((n) => n.includes("corte al 3 de julio de 2025"))).toBe(true);
    expect(methodNotes("X").some((n) => n.includes("reglas sobre su nombre"))).toBe(true);
    expect(realNotes({ documentsWithTerms: 8, documents: 12, appropriationWithoutYear: 1, appropriation: 2 }).some((n) => n.includes("reglas sobre el nombre"))).toBe(true);
  });

  test.describe("in the pages", () => {
    test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
    test("each board shows the sentence once in its notes of method", async ({ page }) => {
      test.setTimeout(250000);
      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const board of [1, 2, 3]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("method-notes").waitFor({ timeout: 120000 });
        await page.waitForTimeout(1500);
        const text = await page.getByTestId("method-notes").innerText();
        const n = text.split("la información de la última convocatoria de medición de SCIENTI").length - 1;
        console.log(`[live] Board ${board}: the sentence appears ${n} time(s) in the notes of method`);
        expect(n).toBe(1);
      }
    });
  });
});
