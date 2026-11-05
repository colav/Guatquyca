/* Constants & utils */
import { CATEGORY_PALETTE, MAP_PALETTE, OPEN_ACCESS_PALETTE, PALETTE } from "../constants";

/**
 * Colours of every chart of the observatories. They come from the palettes that live in
 * lib/constants.js: PALETTE (200 colours: the first eight are the categorical ones; the last nine
 * are greys), MAP_PALETTE (sequential, light to dark) and OPEN_ACCESS_PALETTE (access routes). No
 * chart component writes a hex value; the only literals are the brand colours at the end, which
 * that file does not have. Positions refer to PALETTE as it is today.
 */

/** Categorical colours (the chromatic part of PALETTE). */
export const CATEGORICAL_COLORS = Object.freeze(PALETTE.slice(0, 8));

/** Neutrals (the greys at the end of PALETTE): light, medium and dark. */
export const NEUTRAL = Object.freeze({
  light: PALETTE[194], // #f1f1f1
  medium: PALETTE[195], // #cacaca
  dark: PALETTE[199], // #adadad
  border: PALETTE[199],
});

/** Sequential colours, light to dark (MAP_PALETTE). */
export const SEQUENTIAL_COLORS = Object.freeze([...MAP_PALETTE]);

/** Colour of the bars of the rankings (a single series). */
export const RANKING_COLOR = PALETTE[0];

/**
 * Colour of each capacity category: the own pastel palette CATEGORY_PALETTE (lib/constants.js),
 * chosen for what each category means. The categories are also told apart by their label and by
 * their shape (axis, tooltip, legend).
 */
export const CAPACITY_COLORS = Object.freeze({ ...CATEGORY_PALETTE });

/** Colour classes of the scatter points: highlighted, in consolidation and the rest. */
export const SCATTER_COLORS = Object.freeze({
  highlight: PALETTE[3],
  consolidating: PALETTE[4],
  other: NEUTRAL.light,
});

/** Donut of the product type (three categorical colours). */
export const TYPE_COLORS = Object.freeze([PALETTE[0], PALETTE[1], PALETTE[2]]);

/** Donut of the Scimago quartile: no quartile in grey and Q1 to Q4 sequential (dark = Q1). */
export const QUARTILE_COLORS = Object.freeze([
  PALETTE[8],
  MAP_PALETTE[7],
  MAP_PALETTE[5],
  MAP_PALETTE[3],
  MAP_PALETTE[1],
]);

/** Access route: label of the board -> key of OPEN_ACCESS_PALETTE. */
const ACCESS_KEYS = {
  "Sin dato OA": "Sin información",
  Diamante: "Diamante",
  Dorada: "Dorado",
  Híbrida: "Híbrido",
  Verde: "Verde",
  Bronce: "Bronce",
  Cerrado: "Cerrado",
};

/** @param {string} label - Label of the access donut. @returns {string} Colour of that route. */
export const accessColor = (label) => OPEN_ACCESS_PALETTE[ACCESS_KEYS[label]] ?? NEUTRAL.medium;

/**
 * Sequential colour for a value between 0 and 1 (subregion tiles) and the text colour that reads on it.
 *
 * @param {number} t - Intensity from 0 to 1.
 * @returns {{ background: string, color: string }}
 */
export function sequentialTile(t) {
  const i = Math.min(SEQUENTIAL_COLORS.length - 1, Math.max(0, Math.round(t * (SEQUENTIAL_COLORS.length - 1))));
  return { background: SEQUENTIAL_COLORS[i], color: i >= 5 ? BRAND.white : BRAND.text };
}

/** Product types of Board 2 (articles, book chapters, books, social appropriation, projects). */
export const COLLAB_TYPE_COLORS = Object.freeze([PALETTE[4], PALETTE[5], PALETTE[6], PALETTE[3], PALETTE[1]]);

/** Sector of the organizations (Board 2). */
export const SECTOR_COLORS = Object.freeze({
  company: PALETTE[3],
  government: PALETTE[4],
  nonprofit: PALETTE[6],
  healthcare: PALETTE[1],
  education: PALETTE[5],
  other: NEUTRAL.medium,
});

/** Global North and South (Board 2). */
export const NORTH_SOUTH_COLORS = Object.freeze({ north: PALETTE[4], south: PALETTE[6] });

/** Research centres in the collaboration graph: eight categorical colours; the rest in grey. */
export const CENTER_COLORS = Object.freeze(PALETTE.slice(0, 8));
export const CENTER_OTHER_COLOR = NEUTRAL.dark;

/** Brand colours that are not in lib/constants.js (header of the cards of the platform, selection, text). */
export const BRAND = Object.freeze({
  header: "#003e65",
  selected: "#003e65",
  text: "#262626",
  white: "#ffffff",
});

/**
 * Colours of Board 3 (base capacities). Series use the categorical colours in a fixed order; what
 * the artifact shows in grey ("sin dato", closed, no identifier) uses the greys of PALETTE.
 */
export const FOUNDATIONS_COLORS = Object.freeze({
  /** Series of the line charts and legends (students by level, age groups, contracts). */
  series: CATEGORICAL_COLORS,
  /** Sex: men, women and no data. */
  sex: Object.freeze({ male: PALETTE[0], female: PALETTE[1], noData: NEUTRAL.dark }),
  /** Contracts of the panel "c": the five known ones and "otros/desconocido" in grey. */
  contracts: Object.freeze([...PALETTE.slice(0, 5), NEUTRAL.dark]),
  /** Open access donut: open, closed and no data. */
  openAccess: Object.freeze({ open: OPEN_ACCESS_PALETTE.Verde, closed: OPEN_ACCESS_PALETTE.Cerrado, noData: NEUTRAL.medium }),
  /** Identifiers: with and without. */
  identifiers: Object.freeze({ with: PALETTE[0], without: NEUTRAL.medium }),
  /** Repository against total (panel 15): products and products in a repository. */
  repository: Object.freeze({ total: PALETTE[0], inRepository: PALETTE[2] }),
  /** Single-series bars of each panel. */
  bars: Object.freeze({ datasets: PALETTE[2], appropriation: PALETTE[4], company: PALETTE[1], artsProjects: PALETTE[6], artsCreation: PALETTE[4], topics: PALETTE[0] }),
  /** Contract groups of the arts scatter (panel 12). */
  arts: Object.freeze({ vinculado: PALETTE[0], ocasional: PALETTE[1], "otro/desconocido": PALETTE[2] }),
});

/**
 * Darker tone of a hex colour (the 1 px border of the marks of a category).
 *
 * @param {string} hex - "#rrggbb".
 * @param {number} [amount] - 0 to 1, share taken from each channel.
 * @returns {string}
 */
export function darken(hex, amount = 0.3) {
  const channel = (i) => Math.round(parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16) * (1 - amount)).toString(16).padStart(2, "0");
  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

/**
 * The only map category -> colour and shape (F39). The colour is the one of the bar of the category
 * in the calculator (panel 2); the shape tells the categories apart without colour alone. The keys
 * are the values of CATEGORY (lib/observatories/capacity/constants.js). `uncategorized` belongs to
 * the old model (artifact data). Shape names are the ones of G2, plus the custom `star`.
 */
export const CATEGORY_MARKS = Object.freeze({
  leader: { color: CAPACITY_COLORS.leader, shape: "star" },
  consolidated: { color: CAPACITY_COLORS.consolidated, shape: "square" },
  consolidating: { color: CAPACITY_COLORS.consolidating, shape: "hexagon" },
  emerging: { color: CAPACITY_COLORS.emerging, shape: "triangle" },
  atRisk: { color: CAPACITY_COLORS.atRisk, shape: "triangleDown" },
  lowCapacity: { color: CAPACITY_COLORS.lowCapacity, shape: "point" },
  punctual: { color: CAPACITY_COLORS.punctual, shape: "x" },
  uncategorized: { color: CAPACITY_COLORS.uncategorized, shape: "point" },
  none: { color: CAPACITY_COLORS.none, shape: "diamond" },
});

/** Colours of the own legend of the scatter (F39): buttons, active state and size samples. */
export const LEGEND_COLORS = Object.freeze({
  idleBorder: "rgba(0,0,0,.12)",
  activeBorder: "#1677ff",
  activeBackground: "rgba(22,119,255,.08)",
  background: "#fff",
  sampleFill: "#d9d9d9",
  sampleStroke: "#8c8c8c",
  sampleText: "#262626",
});
