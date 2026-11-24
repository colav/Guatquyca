"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* UI Library Components */
import { Typography } from "antd";

/* Components & lib */
import GeoMap from "@/app/observatories/components/GeoMap";
import { DANE_ATTRIBUTION_DEPARTMENTS, POLYGON_KEYS, departmentRows, departmentsWithoutOutlineText } from "@/lib/observatories/geoMap";

const load = () => import("@/lib/observatories/data/geo/colombia.json");
const TOOLTIP_ITEMS = [
  { field: "name", alias: "Departamento:" },
  { field: "count", alias: "Productos en coautoría:" },
];

/**
 * Choropleth of Colombia by department (F80, panel 09 of the Tablero 2): `GeoMap` with `colombia.json`, joined by `nombre_t2` with
 * `depts` of the bundle. The departments without data (Arauca, Putumayo, Guainía, Guaviare, Vaupés, Vichada) stay in 0;
 * «Sin asignar» has no polygon and goes in the «?».
 *
 * @param {Object<string, number>} departments - Department -> products in co-authorship (`result.departments`).
 */
function DepartmentMap({ departments, height = 520 }) {
  const rows = useMemo(() => departmentRows(departments), [departments]);
  return (
    <>
      <GeoMap load={load} polygonKey={POLYGON_KEYS.departments} rows={rows} tooltipItems={TOOLTIP_ITEMS} helpOf={departmentsWithoutOutlineText} helpLabel="sin contorno" height={height} testId="department-map" />
      <Typography.Text type="secondary" style={{ display: "block", fontSize: 11, marginTop: 4 }} data-testid="dane-attribution-departments">
        {DANE_ATTRIBUTION_DEPARTMENTS}
      </Typography.Text>
    </>
  );
}

export default memo(DepartmentMap);
