/**
 * Sources of each board with their real cut-off date, for the last note of the box «Notas metodológicas» (F95, Q-31). The list comes
 * from `fuentes` of GET /observatories/vri-udea/cut (B148); nothing is written by hand here: a source without a date says its
 * `detalle`, and without `fuentes` the fixed text stays.
 *
 * @module lib/observatories/cutSources
 */

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** «2026-11-06» → «6 de noviembre de 2026» (read from the text: no time zone can move the day). Anything else returns "". */
export function longDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return "";
  return `${Number(m[3])} de ${MONTHS[Number(m[2]) - 1]} de ${m[1]}`;
}

/**
 * The lines of the sources that a board uses.
 *
 * @param {{ nombre: string, fecha_corte: string, detalle: string, tableros: number[] }[]} sources - `fuentes` of /cut.
 * @param {1|2|3} board
 * @returns {string[]} «Name: 16 de octubre de 2026», or «Name: detail» when the source declares no date; [] without sources.
 */
export function sourceLines(sources, board) {
  if (!Array.isArray(sources)) return [];
  return sources
    .filter((s) => s && Array.isArray(s.tableros) && s.tableros.includes(board) && s.nombre)
    .map((s) => {
      const date = longDate(s.fecha_corte);
      if (date) return `${s.nombre}: ${date}`;
      return s.detalle ? `${s.nombre}: ${s.detalle}` : String(s.nombre);
    });
}
