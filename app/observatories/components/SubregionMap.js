"use client";

/* Hooks */
import { memo } from "react";

/* Components & lib */
import GeoMap from "@/app/observatories/components/GeoMap";
import { DANE_ATTRIBUTION, POLYGON_KEYS } from "@/lib/observatories/geoMap";

/* UI Library Components */
import { Typography } from "antd";

const load = () => import("@/lib/observatories/data/geo/antioquia_subregiones.json");

/**
 * Choropleth of the nine subregions of Antioquia (F80; panel 09b of the Tablero 2 and the complement of the Tablero 1):
 * `GeoMap` with `antioquia_subregiones.json`, joined by `subregion`. The attribution that the license of the DANE requires goes
 * under the map as visible text, not in a «?».
 *
 * @param {{ key: string, name: string, value: number }[]} rows - Stable reference (`useStableValue`).
 * @param {{ field: string, alias: string }[]} tooltipItems - Stable reference.
 */
function SubregionMap({ rows, tooltipItems, height = 380 }) {
  return (
    <>
      <GeoMap load={load} polygonKey={POLYGON_KEYS.subregions} rows={rows} tooltipItems={tooltipItems} height={height} testId="subregion-map" />
      <Typography.Text type="secondary" style={{ display: "block", fontSize: 11, marginTop: 4 }} data-testid="dane-attribution">
        {DANE_ATTRIBUTION}
      </Typography.Text>
    </>
  );
}

export default memo(SubregionMap);
