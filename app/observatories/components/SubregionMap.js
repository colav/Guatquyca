"use client";

/* Hooks */
import { memo } from "react";

/* Components & lib */
import GeoMap from "@/app/observatories/components/GeoMap";
import { DANE_ATTRIBUTION, POLYGON_KEYS } from "@/lib/observatories/geoMap";

/* UI Library Components */
import { Typography } from "antd";

const load = () => import("@/lib/observatories/data/geo/antioquia_subregiones.json");
const tooltip = (unit, detailed) => [
  { field: "name", alias: "Subregión:" },
  { field: "count", alias: `${unit}:` },
  ...(detailed ? [{ field: "regprog", alias: "Productos con autores de Regionalización:" }, { field: "topics", alias: "Tópicos:" }] : []),
];
/* Module-level: the tooltip keeps its reference between renders, so the map is not drawn again. */
const TOOLTIPS = { Proyectos: tooltip("Proyectos", false), Productos: tooltip("Productos", false), detailed: tooltip("Productos", true) };

/**
 * Choropleth of the nine subregions of Antioquia (F80; panel 09b of the Tablero 2 and the complement of the Tablero 1):
 * `GeoMap` with `antioquia_subregiones.json`, joined by `subregion`. The attribution that the license of the DANE requires goes
 * under the map as visible text, not in a «?».
 *
 * @param {{ key: string, name: string, value: number }[]} rows - Stable reference (`useStableValue`).
 * @param {"Proyectos"|"Productos"} [unit] - Unit of the tooltip (the Tablero 2 changes it with the tab).
 * @param {boolean} [detailed] - Tablero 1: the tooltip also carries the Regionalización count and the two main topics.
 */
function SubregionMap({ rows, unit = "Productos", detailed = false, height = 380 }) {
  return (
    <>
      <GeoMap load={load} polygonKey={POLYGON_KEYS.subregions} rows={rows} tooltipItems={detailed ? TOOLTIPS.detailed : TOOLTIPS[unit]} height={height} testId="subregion-map" />
      <Typography.Text type="secondary" style={{ display: "block", fontSize: 11, marginTop: 4 }} data-testid="dane-attribution">
        {DANE_ATTRIBUTION}
      </Typography.Text>
    </>
  );
}

export default memo(SubregionMap);
