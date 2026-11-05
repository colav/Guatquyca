/**
 * Geometry of the marks of the categories (F39). The same outlines draw the points of the scatter
 * (G2 symbols) and the small figures of the legend and of the table (SVG), so both always match.
 *
 * @module lib/observatories/shapes
 */

/** Star of five points, as a G2 symbol: (x, y, r) -> path commands. */
export function star(x, y, r) {
  const inner = r * 0.45;
  const commands = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    commands.push([i === 0 ? "M" : "L", x + radius * Math.cos(angle), y + radius * Math.sin(angle)]);
  }
  commands.push(["Z"]);
  return commands;
}
star.style = ["fill"];

const POLYGONS = {
  square: (r) => [[-r, -r], [r, -r], [r, r], [-r, r]],
  diamond: (r) => [[0, -r], [r, 0], [0, r], [-r, 0]],
  triangle: (r) => { const d = r * Math.sin(Math.PI / 3); return [[-r, d], [0, -d], [r, d]]; },
  triangleDown: (r) => { const d = r * Math.sin(Math.PI / 3); return [[-r, -d], [r, -d], [0, d]]; },
  hexagon: (r) => { const d = (r / 2) * Math.sqrt(3); return [[0, -r], [d, -r / 2], [d, r / 2], [0, r], [-d, r / 2], [-d, -r / 2]]; },
};

/**
 * SVG path (the figure centred at 0,0) of a shape name.
 *
 * @param {string} shape - star, square, hexagon, triangle, triangleDown, diamond or point.
 * @param {number} r - Radius.
 * @returns {string} Value of the `d` attribute.
 */
export function shapePath(shape, r) {
  if (shape === "point") return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`;
  const points = shape === "star" ? star(0, 0, r).filter((c) => c[0] !== "Z").map(([, x, y]) => [x, y]) : POLYGONS[shape](r);
  return `${points.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ")} Z`;
}
