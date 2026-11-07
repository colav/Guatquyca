"use client";

/* Hooks */
import { memo, useEffect, useMemo, useState } from "react";

/* Components & lib */
import MapChart from "@/app/components/ClientSide/Charts/MapCharts/MapChart";
import FilterHelp from "@/app/observatories/components/FilterHelp";
import { geoMapData } from "@/lib/observatories/geoMap";

/**
 * Choropleth over a static file of polygons (F79, generalised in F80): the MapChart of the platform, the file loaded with
 * `import()` only when the map is drawn, and the join of the rows with the polygons by one key. Colour: quantile of the logarithm
 * of the count (MAP_PALETTE). What has products and no polygon goes in a «?» in the corner of the map.
 *
 * Every function and array passed in must keep its reference between renders (module-level constants or `useStableValue`),
 * otherwise the map is drawn again.
 *
 * @param {() => Promise<Object>} load - `() => import("…json")`: the file of polygons.
 * @param {string} polygonKey - Property of the polygon that joins with `rows[].key`.
 * @param {{ key: string, name: string, value: number }[]} rows - One per place; the other fields go to the tooltip.
 * @param {{ field: string, alias: string }[]} tooltipItems
 * @param {(withoutOutline: Object[]) => string} [helpOf] - Phrase of the «?» from the rows without polygon; empty = no «?».
 * @param {string} [emptyLabel] - Phrase of the tooltip of the polygons that no row names (F81b).
 * @param {string} [helpLabel] - Accessible name of the «?».
 * @param {number} [height]
 * @param {string} [testId]
 */
function GeoMap({ load, polygonKey, rows, tooltipItems, helpOf, emptyLabel = "", helpLabel = "sin contorno", height = 400, testId = "geo-map" }) {
  const [geo, setGeo] = useState(null);
  useEffect(() => {
    let alive = true;
    load().then((mod) => {
      if (alive) setGeo(mod.default || mod);
    });
    return () => {
      alive = false;
    };
  }, [load]);
  const map = useMemo(() => (geo ? geoMapData(geo, rows, polygonKey, emptyLabel) : null), [geo, rows, polygonKey, emptyLabel]);
  const help = map && helpOf ? helpOf(map.withoutOutline) : "";
  return (
    <div data-testid={testId} style={{ position: "relative", height }}>
      {map ? <MapChart data={map.data} tooltipItems={tooltipItems} /> : null}
      {help ? (
        <div data-testid={`${testId}-help`} style={{ position: "absolute", top: 4, right: 6, zIndex: 5, background: "rgba(255,255,255,.85)", borderRadius: 4, padding: "0 4px" }}>
          <FilterHelp label={helpLabel}>{help}</FilterHelp>
        </div>
      ) : null}
    </div>
  );
}

export default memo(GeoMap);
