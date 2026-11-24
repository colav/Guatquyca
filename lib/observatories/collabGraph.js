/**
 * Helpers of the collaboration graph of the Board 2 (F92, Q-25; the graph D of F94 and F97 is the only one since F98): the anchors of the
 * communities, the communities of collaboration, the choice of labels that do not overlap and the HTML of the two tooltips. Pure
 * functions, so they are tested without a browser.
 *
 * @module lib/observatories/collabGraph
 */

const fmt = (n) => Number(n).toLocaleString("es-CO");
const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * One anchor per group on an ellipse (the first group on top, clockwise). A single group sits at the centre.
 *
 * @param {number[]} groups - Group ids, in order.
 * @param {number} width
 * @param {number} height
 * @param {number} [spread] - Share of half the canvas used by the ellipse.
 * @returns {Map<number, { x: number, y: number }>}
 */
export function groupAnchors(groups, width, height, spread = 0.6) {
  const anchors = new Map();
  const n = groups.length;
  groups.forEach((g, i) => {
    if (n === 1) anchors.set(g, { x: width / 2, y: height / 2 });
    else {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      anchors.set(g, { x: width / 2 + Math.cos(angle) * (width / 2) * spread, y: height / 2 + Math.sin(angle) * (height / 2) * spread });
    }
  });
  return anchors;
}

/** Abbreviation of a name for a label of the graph. */
export const shortName = (name, maxChars = 22) => (name.length > maxChars ? `${name.slice(0, maxChars - 1)}…` : name);
const overlaps = (a, b, pad = 2) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;

const dot = (color) => `<i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px"></i>`;

/**
 * HTML of the tooltip of a node or of an edge (Q-25 d, e): the typeface and colours of the other tooltips of the board.
 *
 * @param {"node"|"edge"} kind
 * @param {Object} d - `data` of the element.
 * @param {string} font - `font-family` of the page.
 */
export function graphTooltip(kind, d, font) {
  const box = (title, lines) =>
    `<div style="font-family:${font};font-size:12px;line-height:20px;color:rgba(0,0,0,.65);background:white;border-radius:6px;box-shadow:0 6px 16px 0 rgba(0,0,0,.08),0 3px 6px -4px rgba(0,0,0,.12),0 9px 28px 8px rgba(0,0,0,.05);padding:8px 12px;min-width:220px;max-width:360px;white-space:normal">` +
    `<div style="font-size:13px;font-weight:600;color:rgba(0,0,0,.88);margin-bottom:4px;overflow-wrap:anywhere">${title}</div>${lines.join("")}</div>`;
  const row = (before, value, after) => `<div>${before}<span style="font-weight:500;color:rgba(0,0,0,.88)">${value}</span>${after}</div>`;
  if (kind === "edge") {
    return box(`${escape(d.sourceName)} — ${escape(d.targetName)}`, [row("", fmt(d.weight ?? 0), " productos compartidos")]);
  }
  const lines = [];
  if (d.center) lines.push(`<div style="margin-bottom:2px">${dot(d.color || "gray")}${escape(d.center)}</div>`);
  lines.push(row("Colaboran con ", fmt(d.degree ?? 0), " grupos"));
  lines.push(row("", fmt(d.weight ?? 0), " productos compartidos"));
  /* the community and how many collaborators are of another centre */
  if (d.community) {
    lines.push(row("Comunidad ", fmt(d.community), ""));
    lines.push(row("", fmt(d.otherCenter ?? 0), ` de sus ${fmt(d.neighbours ?? 0)} colaboradores en este gráfico son de otro centro`));
  }
  return box(escape(d.name ?? ""), lines);
}

/**
 * Communities of collaboration (Q-33 a): Louvain on the weighted edges (weight = shared products), written by hand because the
 * platform has no such function in a declared dependency. Deterministic: nodes are visited in the order given and ties go to the
 * lowest community. Returns the community of each node, numbered from 0 by size (the biggest first).
 *
 * @param {{ id: * }[]} nodes
 * @param {{ source: *, target: *, weight: number }[]} links
 * @returns {Map<*, number>} node id -> community
 */
export function detectCommunities(nodes, links) {
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  let size = nodes.length;
  let adjacency = Array.from({ length: size }, () => new Map());
  let total = 0;
  for (const l of links) {
    const a = index.get(l.source);
    const b = index.get(l.target);
    if (a === undefined || b === undefined || a === b || !(l.weight > 0)) continue;
    adjacency[a].set(b, (adjacency[a].get(b) || 0) + l.weight);
    adjacency[b].set(a, (adjacency[b].get(a) || 0) + l.weight);
    total += l.weight;
  }
  const membership = nodes.map((_, i) => i); // original node -> node of the current level
  if (total === 0) return new Map(nodes.map((n, i) => [n.id, i]));
  const m2 = 2 * total;
  for (let level = 0; level < 10; level++) {
    const degree = adjacency.map((map, i) => [...map.entries()].reduce((a, [j, w]) => a + (j === i ? 2 * w : w), 0));
    const community = Array.from({ length: size }, (_, i) => i);
    const sumTot = degree.slice();
    let moved = true;
    let improved = false;
    for (let pass = 0; moved && pass < 50; pass++) {
      moved = false;
      for (let i = 0; i < size; i++) {
        const own = community[i];
        const weightTo = new Map();
        for (const [j, w] of adjacency[i]) if (j !== i) weightTo.set(community[j], (weightTo.get(community[j]) || 0) + w);
        sumTot[own] -= degree[i];
        let best = own;
        let bestGain = (weightTo.get(own) || 0) - (sumTot[own] * degree[i]) / m2;
        for (const c of [...weightTo.keys()].sort((a, b) => a - b)) {
          const gain = weightTo.get(c) - (sumTot[c] * degree[i]) / m2;
          if (gain > bestGain + 1e-12) { best = c; bestGain = gain; }
        }
        sumTot[best] += degree[i];
        if (best !== own) { community[i] = best; moved = true; improved = true; }
      }
    }
    if (!improved) break;
    const renumber = new Map();
    community.forEach((c) => { if (!renumber.has(c)) renumber.set(c, renumber.size); });
    const next = Array.from({ length: renumber.size }, () => new Map());
    adjacency.forEach((map, i) => {
      for (const [j, w] of map) {
        const a = renumber.get(community[i]);
        const b = renumber.get(community[j]);
        /* between groups the two directions each add w; inside a group an edge is seen twice (i→j and j→i) and a self loop once */
        next[a].set(b, (next[a].get(b) || 0) + (a !== b || i === j ? w : w / 2));
      }
    });
    for (let i = 0; i < membership.length; i++) membership[i] = renumber.get(community[membership[i]]);
    size = renumber.size;
    adjacency = next;
    if (size === 1) break;
  }
  const counts = new Map();
  membership.forEach((c) => counts.set(c, (counts.get(c) || 0) + 1));
  const order = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a - b);
  const rank = new Map(order.map((c, i) => [c, i]));
  return new Map(nodes.map((n, i) => [n.id, rank.get(membership[i])]));
}

/**
 * Measures of a partition of the graph (Q-33 g): number of groups, share of the weight of the edges that stays inside a group,
 * and share of the groups with nodes of two or more centres.
 *
 * @param {{ id: *, center: number }[]} nodes
 * @param {{ source: *, target: *, weight: number }[]} links
 * @param {Map<*, number>} partition - node id -> group.
 */
export function partitionStats(nodes, links, partition) {
  const groups = new Map();
  for (const n of nodes) groups.set(partition.get(n.id), [...(groups.get(partition.get(n.id)) || []), n.center]);
  const all = links.reduce((a, l) => a + l.weight, 0);
  const inside = links.filter((l) => partition.get(l.source) === partition.get(l.target)).reduce((a, l) => a + l.weight, 0);
  const mixed = [...groups.values()].filter((centers) => new Set(centers).size >= 2).length;
  return { groups: groups.size, insideShare: all ? inside / all : 0, mixedShare: groups.size ? mixed / groups.size : 0 };
}

/**
 * Labels of the option D (Q-33 d): almost every node gets its name. Each label tries four places around its node (below, right, left,
 * above) and takes the first one where it overlaps neither a label already placed nor any node; the ones that fit nowhere stay
 * hidden, in order of degree, and zooming in (`scale` smaller) makes room for them.
 *
 * @param {{ id: string, name: string, degree: number, r: number, x: number, y: number }[]} placed
 * @param {{ scale?: number, maxChars?: number }} [options]
 * @returns {Map<string, { text: string, placement: "bottom"|"right"|"left"|"top" }>}
 */
export function graphLabelsAround(placed, { scale = 1, maxChars = 22 } = {}) {
  const chosen = new Map();
  const boxes = [];
  const discs = placed.map((n) => ({ x: n.x - n.r, y: n.y - n.r, w: 2 * n.r, h: 2 * n.r, id: n.id }));
  for (const n of [...placed].sort((a, b) => b.degree - a.degree)) {
    const text = shortName(n.name, maxChars);
    const w = (text.length * 5.8 + 10) * scale;
    const h = 16 * scale;
    const gap = 2 * scale;
    const options = {
      bottom: { x: n.x - w / 2, y: n.y + n.r + gap },
      right: { x: n.x + n.r + gap, y: n.y - h / 2 },
      left: { x: n.x - n.r - gap - w, y: n.y - h / 2 },
      top: { x: n.x - w / 2, y: n.y - n.r - gap - h },
    };
    for (const [placement, pos] of Object.entries(options)) {
      const box = { ...pos, w, h };
      if (boxes.some((b) => overlaps(b, box)) || discs.some((d) => d.id !== n.id && overlaps(d, box, 0))) continue;
      boxes.push(box);
      chosen.set(n.id, { text, placement });
      break;
    }
  }
  return chosen;
}
