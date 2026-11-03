/* Constants & utils */
import { MAP_PALETTE, OPEN_ACCESS_PALETTE, PALETTE } from "../constants";

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
 * Colour of each capacity category. They are categorical colours, not a gradient, and the
 * categories are always told apart by their label too (axis, tooltip or legend).
 */
export const CAPACITY_COLORS = Object.freeze({
  leader: PALETTE[3],
  consolidated: PALETTE[5],
  consolidating: PALETTE[4],
  emerging: PALETTE[0],
  atRisk: PALETTE[1],
  uncategorized: PALETTE[8],
  none: PALETTE[195],
});

/** Colour classes of the scatter points: highlighted, in consolidation and the rest. */
export const SCATTER_COLORS = Object.freeze({
  highlight: CAPACITY_COLORS.leader,
  consolidating: CAPACITY_COLORS.consolidating,
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
