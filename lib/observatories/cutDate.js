/**
 * Dates of the sources of Board 1 for the texts (F47, D-140, D-141, D-145): the readings of OpenAlex are in
 * `meta.corte_openalex` of the bundle as ISO 8601 ranges in UTC («inicio/fin») and are shown in Bogotá time
 * (America/Bogota), in Spanish and never written by hand: a reading of 6 Nov 03:31 UTC is of 5 November.
 *
 * @module lib/observatories/cutDate
 */

const TIME_ZONE = "America/Bogota";

/** Day (year, month, day) of an ISO instant in Bogotá time. */
function bogotaDay(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((p) => [p.type, p.value]));
  return { year: +parts.year, month: +parts.month, day: +parts.day };
}

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const same = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;

/**
 * Date of a range «inicio/fin» in Spanish and Bogotá time: «5 de noviembre de 2026»; when the range spans
 * several days, «del 5 al 6 de noviembre de 2026» (or with both months if they differ). `""` if it is not a range.
 *
 * @param {string | undefined} range
 * @returns {string}
 */
export function rangeDate(range) {
  if (typeof range !== "string" || !range.includes("/")) return "";
  const [from, to] = range.split("/").map(bogotaDay);
  if (!from || !to) return "";
  if (same(from, to)) return `${from.day} de ${MONTHS[from.month - 1]} de ${from.year}`;
  if (from.year === to.year && from.month === to.month) return `del ${from.day} al ${to.day} de ${MONTHS[to.month - 1]} de ${to.year}`;
  return `del ${from.day} de ${MONTHS[from.month - 1]} de ${from.year} al ${to.day} de ${MONTHS[to.month - 1]} de ${to.year}`;
}

/** Month and year of a date «AAAA-MM-DD» (the extraction of ImpactU): «octubre de 2026»; `""` if it is not one. */
export function monthYear(day) {
  const m = typeof day === "string" ? day.match(/^(\d{4})-(\d{2})-\d{2}/) : null;
  return m && MONTHS[+m[2] - 1] ? `${MONTHS[+m[2] - 1]} de ${m[1]}` : "";
}

/**
 * Sentence about the sources of Board 1: «Productos: ImpactU (extracción de octubre de 2026). Citas, FWCI y
 * referente: OpenAlex, consultados el 5 de noviembre de 2026.» If the dates of the citations and of the
 * referent are not the same, each has its own. Without `corte_openalex` no date is shown (and nothing breaks).
 *
 * @param {{ corte_openalex?: { citas?: string, referente?: string } }} [meta]
 * @param {{ etl_hasta?: string }} [obsCut] - `obs.corte` of the bundle (extraction of ImpactU).
 * @returns {{ products: string, openalex: string, citations: string, full: string }}
 */
export function sourceSentences(meta = {}, obsCut = {}) {
  const month = monthYear(obsCut && obsCut.etl_hasta);
  const products = month ? `Productos: ImpactU (extracción de ${month}).` : "Productos: ImpactU.";
  const cut = meta && meta.corte_openalex;
  const citations = cut ? rangeDate(cut.citas) : "";
  const referent = cut ? rangeDate(cut.referente) : "";
  let openalex;
  let citationsOnly;
  if (citations && referent && citations === referent) {
    openalex = `Citas, FWCI y referente: OpenAlex, consultados el ${citations}.`;
    citationsOnly = `Citas y FWCI: OpenAlex, consultados el ${citations}.`;
  } else if (citations || referent) {
    openalex = [citations ? `Citas y FWCI: OpenAlex, consultados el ${citations}.` : "Citas y FWCI: OpenAlex.", referent ? `Referente: OpenAlex, consultado el ${referent}.` : "Referente: OpenAlex."].join(" ");
    citationsOnly = citations ? `Citas y FWCI: OpenAlex, consultados el ${citations}.` : "Citas y FWCI: OpenAlex.";
  } else {
    openalex = "Citas, FWCI y referente: OpenAlex.";
    citationsOnly = "Citas y FWCI: OpenAlex.";
  }
  return { products, openalex, citations: citationsOnly, full: `${products} ${openalex}` };
}
