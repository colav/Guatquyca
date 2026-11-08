/**
 * Helpers of the collaboration graph of the Board 2 (F92, Q-25): the arrangements A and B, the choice of labels that do not overlap
 * and the HTML of the two tooltips. Pure functions, so they are tested without a browser.
 *
 * @module lib/observatories/collabGraph
 */

/** `?grafo=` values: the reference (the graph of before) and the options A, B and C. */
export const GRAPH_VARIANTS = Object.freeze(["ref", "A", "B", "C"]);

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

/**
 * Option B: a ring per centre. Each group's nodes go around a small circle (the biggest first, contiguous), and the rings sit on
 * an ellipse. Returns the position of each node by id.
 *
 * @param {{ id: * , group: number, r: number, degree: number }[]} nodes
 * @param {number} width
 * @param {number} height
 * @returns {Object<string, { x: number, y: number }>}
 */
export function ringPositions(nodes, width, height) {
  const byGroup = new Map();
  nodes.forEach((n) => byGroup.set(n.group, [...(byGroup.get(n.group) || []), n]));
  const groups = [...byGroup.keys()].sort((a, b) => a - b);
  const ringOf = (list) => (list.length === 1 ? 0 : Math.max(Math.max(...list.map((n) => n.r)) + 4, list.reduce((a, n) => a + 2 * n.r + 8, 0) / (2 * Math.PI)));
  const biggest = Math.max(0, ...groups.map((g) => ringOf(byGroup.get(g)) + Math.max(...byGroup.get(g).map((n) => n.r))));
  const spread = Math.max(0.3, Math.min(0.85, 1 - (biggest + 12) / Math.min(width, height) * 1.0));
  const anchors = groupAnchors(groups, width, height, spread);
  const out = {};
  groups.forEach((g) => {
    const list = [...byGroup.get(g)].sort((a, b) => b.degree - a.degree);
    const ring = ringOf(list);
    const { x, y } = anchors.get(g);
    list.forEach((n, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / list.length;
      out[n.id] = list.length === 1 ? { x, y } : { x: x + Math.cos(angle) * ring, y: y + Math.sin(angle) * ring };
    });
  });
  return out;
}

/** Estimated box of a label under its node (font of 10.5 px): the same estimate is used to count the labels that overlap. */
export function labelBox(name, x, y, r) {
  const text = shortName(name);
  const w = text.length * 5.8 + 10;
  const h = 16;
  return { x: x - w / 2, y: y + r + 2, w, h };
}

const shortName = (name) => (name.length > 26 ? `${name.slice(0, 25)}…` : name);
const overlaps = (a, b, pad = 2) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;

/**
 * Labels (Q-25 c): only the biggest nodes (up to `limit`), and a label is dropped if its box overlaps one already chosen (the
 * one of the node with the lower degree is the one that disappears). The full name is always in the tooltip.
 *
 * @param {{ id: string, name: string, degree: number, r: number, x: number, y: number }[]} placed
 * @param {number} [limit]
 * @returns {Map<string, string>} id -> label text
 */
export function graphLabels(placed, limit = 14) {
  const chosen = new Map();
  const boxes = [];
  for (const n of [...placed].sort((a, b) => b.degree - a.degree)) {
    if (chosen.size >= limit) break;
    const box = labelBox(n.name, n.x, n.y, n.r);
    if (boxes.some((b) => overlaps(b, box))) continue;
    boxes.push(box);
    chosen.set(n.id, shortName(n.name));
  }
  return chosen;
}

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
  return box(escape(d.name ?? ""), lines);
}
