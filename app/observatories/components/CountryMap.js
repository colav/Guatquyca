"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* Components & lib */
import GeoMap from "@/app/observatories/components/GeoMap";
import { POLYGON_KEYS, withoutOutlineText } from "@/lib/observatories/geoMap";

const load = () => import("@/lib/observatories/data/geo/world.json");
const TOOLTIP_ITEMS = [
  { field: "name", alias: "País:" },
  { field: "region", alias: "Región:" },
  { field: "count", alias: "Productos:" },
];

/**
 * Choropleth of products by country (F79, D-184), the use of `GeoMap` with `world.json`; the join is by `country_code`
 * (ISO 3166-1 alpha-2) with `countries[].c` of the bundle. Tooltip «País · Región · Productos»; the countries with products and
 * no polygon go in a «?».
 *
 * @param {{ c: string, n: string, r: string, value: number }[]} countries - Countries of the board with products.
 * @param {number} [height]
 */
function CountryMap({ countries, height = 400 }) {
  const rows = useMemo(() => countries.map((c) => ({ key: c.c, name: c.n, region: c.r, value: c.value })), [countries]);
  return <GeoMap load={load} polygonKey={POLYGON_KEYS.countries} rows={rows} tooltipItems={TOOLTIP_ITEMS} helpOf={withoutOutlineText} helpLabel="países sin contorno" height={height} testId="country-map" />;
}

export default memo(CountryMap);
