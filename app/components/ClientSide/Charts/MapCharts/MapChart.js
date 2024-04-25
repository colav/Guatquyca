/* Libraries */
import { AreaMap } from "@ant-design/maps";

/* lib */
import MapLegendMaker from "@/lib/MapLegendMaker";
import { MAP_PALETTE } from "@/lib/constants";

/**
 * MapChart is a client-side function component that displays an area map.
 *
 * @param {Object[]} data - The data to display in the map. Each object should have 'log_count', 'NOMBRE_DPT', 'name', and 'count' properties.
 * @returns {JSX.Element} An AreaMap component displaying the data.
 */
export default function MapChart({ data }) {
  const config = {
    map: {
      type: "mapbox",
      style: "blank",
    },
    source: {
      data: data,
      parser: {
        type: "geojson",
      },
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
      items: [
        { field: "NOMBRE_DPT", alias: "Departamento:" },
        { field: "name", alias: "País:" },
        { field: "count", alias: "Cantidad:" },
      ],
    },
    zoom: {
      position: "bottomright",
    },
    legend: {
      position: "bottomleft",
      customContent: (title, items) => {
        return MapLegendMaker(items, data);
      },
    },
  };

  return <AreaMap {...config} />;
}
