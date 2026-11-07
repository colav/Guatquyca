"use client";

/* lib */
import MapLegendMaker from "@/lib/utils/MapLegendMaker";
import { MAP_PALETTE } from "@/lib/constants";
import { useEffect, useState, useMemo } from "react";

/**
 * MapChart is a client-side function component that displays an area map.
 *
 * @param {Object[]} data - The data to display in the map.
 * @param {{ field: string, alias: string }[]} [tooltipItems] - Fields of the tooltip (F79; the default is the one this chart always had).
 * @returns {JSX.Element|null} An AreaMap component displaying the data.
 */
const DEFAULT_TOOLTIP_ITEMS = [
  { field: "NOMBRE_DPT", alias: "Departamento:" },
  { field: "name", alias: "País:" },
  { field: "count", alias: "Cantidad:" },
];

export default function MapChart({ data, tooltipItems = DEFAULT_TOOLTIP_ITEMS }) {
  const [AreaMap, setAreaMap] = useState(null);

  useEffect(() => {
    import("@ant-design/maps").then((mod) => {
      setAreaMap(() => mod.AreaMap);
    });
  }, []);

  const config = useMemo(
    () => ({
      map: {
        type: "mapbox",
        style: "blank",
      },
      source: {
        data: data,
        parser: { type: "geojson" },
      },
      autoFit: true,
      color: {
        field: "log_count",
        value: MAP_PALETTE,
        scale: { type: "quantize" },
      },
      style: {
        opacity: 1,
        stroke: "#ccc",
        lineWidth: 0.6,
        lineOpacity: 1,
      },
      state: {
        active: {
          stroke: "white",
          lineWidth: 1.5,
          lineOpacity: 0.8,
        },
      },
      tooltip: {
        items: tooltipItems,
      },
      zoom: {
        position: "bottomright",
      },
      legend: {
        position: "bottomleft",
        customContent: (title, items) => MapLegendMaker(items, data),
      },
    }),
    [data, tooltipItems],
  );

  if (!AreaMap || !data?.features?.length) return null;

  return <AreaMap {...config} />;
}
