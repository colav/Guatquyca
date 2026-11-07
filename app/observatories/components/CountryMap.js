"use client";

/* Hooks */
import { memo, useEffect, useMemo, useState } from "react";

/* Components & lib */
import MapChart from "@/app/components/ClientSide/Charts/MapCharts/MapChart";
import FilterHelp from "@/app/observatories/components/FilterHelp";
import { countryMapData, withoutOutlineText } from "@/lib/observatories/countryGeo";

const TOOLTIP_ITEMS = [
  { field: "name", alias: "País:" },
  { field: "region", alias: "Región:" },
  { field: "count", alias: "Productos:" },
];

/**
 * Choropleth of products by country (F79, D-184): the MapChart of the platform over the static polygons of
 * `lib/observatories/data/geo/world.json`, loaded only when the map is drawn. Colour: quantile of the logarithm of the count
 * (MAP_PALETTE); tooltip «País · Región · Productos»; the countries with products and no polygon go in a «?».
 *
 * @param {{ c: string, n: string, r: string, value: number }[]} countries - Countries of the board with products.
 * @param {number} [height]
 */
function CountryMap({ countries, height = 400 }) {
  const [geo, setGeo] = useState(null);
  useEffect(() => {
    let alive = true;
    import("@/lib/observatories/data/geo/world.json").then((mod) => {
      if (alive) setGeo(mod.default || mod);
    });
    return () => {
      alive = false;
    };
  }, []);
  const map = useMemo(() => (geo ? countryMapData(geo, countries) : null), [geo, countries]);
  const help = map ? withoutOutlineText(map.withoutOutline) : "";
  return (
    <div data-testid="country-map" style={{ position: "relative", height }}>
      {map ? <MapChart data={map.data} tooltipItems={TOOLTIP_ITEMS} /> : null}
      {help ? (
        <div data-testid="country-map-help" style={{ position: "absolute", top: 4, right: 6, zIndex: 5, background: "rgba(255,255,255,.85)", borderRadius: 4, padding: "0 4px" }}>
          <FilterHelp label="países sin contorno">{help}</FilterHelp>
        </div>
      ) : null}
    </div>
  );
}

export default memo(CountryMap);
