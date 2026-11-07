/**
 * Choropleth of countries of Board 2 (F79, D-184): joins the countries of the bundle (`countries[].c`, ISO 3166-1 alpha-2) with the
 * polygons of `data/geo/world.json` (copied from lib/Data/main_dashboard_plots.json, index 0, without the counts) by
 * `country_code`. The geometry is a static file: the bundles carry only counts and keys.
 */

/**
 * Polygons of the file without `country_code` (seven of 215), by the name they have in it; only four are fixed (F79b, D-185, B130):
 * Romania, Curaçao, Hong Kong and Macao. NOT fixed on purpose: «Prince edward island» (a province of Canada, which has its own
 * polygon), «East timor» and «Tm» (they stay without code). The key of the join is `country_code` of the file (ISO 3166-1 alpha-2)
 * with `countries[].c` of the bundle; if the file is replaced by the simplified one of B131 (`world.json`, same properties
 * `country_code` and `name`) nothing here changes.
 */
export const POLYGON_CODE_FIXES = Object.freeze({
  Romania: "RO",
  "Curacao (neth.)": "CW",
  Hk: "HK",
  Mo: "MO",
});

/** Property of the polygons that holds the ISO code. */
export const COUNTRY_KEY = "country_code";

/** Polygons with their code completed (`POLYGON_CODE_FIXES`). */
export function codedFeatures(collection) {
  return collection.features.map((f) => {
    const code = f.properties.country_code || POLYGON_CODE_FIXES[f.properties.name] || "";
    return code === f.properties.country_code ? f : { ...f, properties: { ...f.properties, country_code: code } };
  });
}

/**
 * Data of the map: every polygon with `count` (products of its country with the filters) and `log_count` (natural logarithm, the
 * scale of MapChart), plus the countries with products that have no polygon.
 *
 * @param {{ type: string, features: Array }} collection - The GeoJSON of countries.
 * @param {{ c: string, n: string, r: string, value: number }[]} countries - Countries of the board with products (`result.countries`).
 * @returns {{ data: { type: string, features: Array }, withoutOutline: { c: string, n: string, value: number }[], drawn: number }}
 */
export function countryMapData(collection, countries) {
  const byCode = new Map(countries.map((c) => [c.c, c]));
  const features = codedFeatures(collection);
  const covered = new Set(features.map((f) => f.properties.country_code).filter(Boolean));
  const data = {
    type: "FeatureCollection",
    features: features.map((f) => {
      const c = byCode.get(f.properties.country_code);
      const count = c ? c.value : 0;
      return { ...f, properties: { ...f.properties, name: c ? c.n : f.properties.name, region: c ? c.r : "", count, log_count: count > 0 ? Math.log(count) : 0 } };
    }),
  };
  const withoutOutline = countries.filter((c) => c.value > 0 && !covered.has(c.c)).map((c) => ({ c: c.c, n: c.n, value: c.value }));
  return { data, withoutOutline, drawn: countries.filter((c) => c.value > 0).length - withoutOutline.length };
}

/** Phrase of the help of the panel: the countries without outline and their products (the figures are calculated). */
export function withoutOutlineText(withoutOutline) {
  if (!withoutOutline.length) return "";
  const products = withoutOutline.reduce((a, c) => a + c.value, 0);
  const n = withoutOutline.length;
  const names = withoutOutline.map((c) => c.n).join(", ");
  return `${n} ${n === 1 ? "país sin contorno en el mapa" : "países sin contorno en el mapa"}: ${names}; ${products.toLocaleString("es-CO")} ${products === 1 ? "producto" : "productos"}. Sí cuentan en la tabla.`;
}
