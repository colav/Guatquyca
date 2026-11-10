/**
 * Quality of the type of the organizations (F109, D-244): the share of organizations whose type comes from an institutional source
 * (ROR, the reviewed catalogue, OpenAlex), from the assisted review, from rules on the name, or has no type. The counts come from the
 * key `calidad_tipo` of each bundle (B161: `obs.calidad_tipo.no_academicas` in the T1, `ext.calidad_tipo` in the T2 and the T3); no
 * figure is written by hand (D-223).
 */

/** Token of the help texts that is replaced by the sentence of `typeQualityText`. */
export const QUALITY_TOKEN = "{calidad}";

/** Used when the bundle has no `calidad_tipo`: it names the cause and carries no figure and no open «errores». */
export const QUALITY_FALLBACK = "Las organizaciones que solo se clasifican por el nombre son la parte menos segura del dato.";

const fmt = (n) => n.toLocaleString("es-CO");

function counts(q) {
  const org = (key) => q && q[key] && Number(q[key].organizaciones);
  const total = q && q.total && Number(q.total.organizaciones);
  const parts = [org("institucional"), org("revision_asistida"), org("solo_nombre"), org("sin_clasificar")];
  if (!total || parts.some((n) => !Number.isFinite(n) || n < 0)) return null;
  return { total, reliable: parts[0] + parts[1], byName: parts[2], none: parts[3] };
}

/** Percentages that add 100: whole numbers when they do, one decimal otherwise. */
function shares(values, total) {
  const exact = values.map((v) => (100 * v) / total);
  const whole = exact.map((x) => Math.round(x));
  if (whole.reduce((a, b) => a + b, 0) === 100 && exact.every((x, i) => x === 0 || whole[i] > 0)) return whole.map((x) => String(x));
  return exact.map((x) => x.toFixed(1).replace(".", ","));
}

/**
 * Sentence that quantifies the quality of the type, or `null` when the bundle has no `calidad_tipo`.
 *
 * @param {Object|null|undefined} quality - `calidad_tipo` of the board (the group `no_academicas` in the T1).
 * @param {string} noun - What is counted, for example «organizaciones no académicas».
 * @returns {string|null}
 */
export function typeQualityText(quality, noun) {
  const c = counts(quality);
  if (!c) return null;
  const [a, b, n] = shares([c.reliable, c.byName, c.none], c.total);
  const none = c.none > 0 ? ` El ${n} % restante no tiene clasificación.` : "";
  return `El ${a} % de las ${fmt(c.total)} ${noun} se clasificó con ROR, OpenAlex, el catálogo revisado de la Universidad o revisión manual; el ${b} %, con reglas de detección sobre el nombre, y en ese grupo puede haber algunos errores.${none}`;
}

/** Help entry whose `{calidad}` token is replaced by the sentence (or by the fallback). */
export function withQuality(entry, text) {
  const fill = (s) => (typeof s === "string" ? s.split(QUALITY_TOKEN).join(text || QUALITY_FALLBACK) : s);
  const out = { ...entry };
  for (const key of Object.keys(out)) out[key] = Array.isArray(out[key]) ? out[key].map(fill) : fill(out[key]);
  return out;
}
