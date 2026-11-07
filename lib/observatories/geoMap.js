/**
 * Choropleth maps of the observatory (F79, F80): joins the rows of a bundle with the polygons of a static file of
 * `lib/observatories/data/geo/` by one key of the polygon. The files carry only geometry and keys; the counts are calculated
 * at draw time with the filters in force (the scale of MapChart is the natural logarithm of the count, `log_count`).
 */

/** Property of each file that holds the key of the join with the bundle. */
export const POLYGON_KEYS = Object.freeze({
  countries: "country_code",
  departments: "nombre_t2",
  subregions: "subregion",
});

/**
 * Data of the map: every polygon with `count` and `log_count` (0 when the file has a polygon the rows do not mention), plus the
 * rows with products and no polygon.
 *
 * @param {{ type: string, features: Array }} collection - The GeoJSON.
 * @param {{ key: string, name: string, value: number }[]} rows - One per place; every other field goes to the properties (tooltip).
 * @param {string} polygonKey - Property of the polygon that joins with `rows[].key`.
 * @returns {{ data: { type: string, features: Array }, withoutOutline: { key: string, name: string, value: number }[], drawn: number }}
 */
export function geoMapData(collection, rows, polygonKey) {
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const covered = new Set(collection.features.map((f) => f.properties[polygonKey]).filter(Boolean));
  const data = {
    type: "FeatureCollection",
    features: collection.features.map((f) => {
      const row = byKey.get(f.properties[polygonKey]);
      const count = row ? row.value : 0;
      const { key, value, ...extra } = row || {};
      return { ...f, properties: { ...f.properties, ...extra, count, log_count: count > 0 ? Math.log(count) : 0 } };
    }),
  };
  const withoutOutline = rows.filter((r) => r.value > 0 && !covered.has(r.key)).map(({ key, name, value }) => ({ key, name, value }));
  return { data, withoutOutline, drawn: rows.filter((r) => r.value > 0).length - withoutOutline.length };
}

const fmtN = (n) => n.toLocaleString("es-CO");

/**
 * Rows of the departments (panel 09 of the Tablero 2). `departments` is `result.departments` (name -> products); «Sin asignar» is
 * not a department: it has no polygon and goes to the help of the map. The key is `nombre_t2` of `colombia.json`.
 *
 * @param {Object<string, number>} departments
 */
export function departmentRows(departments) {
  return Object.entries(departments).map(([name, value]) => ({ key: name, name, value }));
}

/** Phrase of the help of the map of departments: what has no outline, with its figure (calculated). */
export function departmentsWithoutOutlineText(withoutOutline) {
  if (!withoutOutline.length) return "";
  return withoutOutline.map((r) => `«${r.name}»: ${fmtN(r.value)} ${r.value === 1 ? "producto" : "productos"} con instituciones colombianas, sin contorno en el mapa.`).join(" ");
}

/**
 * Rows of the subregions of Antioquia, from a name -> value object (Tablero 2) or from the catalogue and a list of counts (Tablero 1).
 */
export function subregionRowsFromObject(counts) {
  return Object.entries(counts).map(([name, value]) => ({ key: name, name, value }));
}

/**
 * @param {{ sub: string, n_title: number, n_regprog: number, topics: [string, number][] }[]} subregions - Catalogue of the Tablero 1.
 * @param {number[]} [counts] - Products by subregion with the filters (same order); without it, the fixed `n_title`.
 */
export function subregionRowsFromCatalogue(subregions, counts) {
  return subregions.map((s, i) => ({
    key: s.sub,
    name: s.sub,
    value: counts ? counts[i] : s.n_title,
    regprog: s.n_regprog ? fmtN(s.n_regprog) : "—",
    topics: s.topics.slice(0, 2).map((t) => t[0]).join(" · "),
  }));
}

/** Phrase of the help of a map whose places have no polygon (countries): count, names and products (calculated). */
export function withoutOutlineText(withoutOutline, one = "país sin contorno en el mapa", many = "países sin contorno en el mapa") {
  if (!withoutOutline.length) return "";
  const products = withoutOutline.reduce((a, r) => a + r.value, 0);
  const n = withoutOutline.length;
  return `${n} ${n === 1 ? one : many}: ${withoutOutline.map((r) => r.name).join(", ")}; ${fmtN(products)} ${products === 1 ? "producto" : "productos"}. Sí cuentan en la tabla.`;
}

/** Attribution that the license of the DANE requires next to every map of Antioquia (F80 (5); provisional text for Luis). */
export const DANE_ATTRIBUTION = "Límites municipales: Departamento Administrativo Nacional de Estadística - DANE (www.dane.gov.co), Marco Geoestadístico Nacional 2024; simplificados.";
