import React from "react";

/* Libraries */
import { AreaMap } from "@ant-design/charts";

/* Utilities */
import MapLegendMaker from "../../utils/MapLegendMaker";

const MapChart = ({ data }) => {
  let max = Math.max(
    ...data?.features?.map((item) => item.properties.count)
  ).toString();

  let config = {
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
      value: [
        "#f7fcf0",
        "#e0f3db",
        "#ccebc5",
        "#a8ddb5",
        "#7bccc4",
        "#4eb3d3",
        "#2b8cbe",
        "#0868ac",
        "#084081",
      ],
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
        { field: "NOMBRE_DPT", alias: "Departamento" },
        { field: "name", alias: "País" },
        { field: "count", alias: "Cantidad" },
      ],
    },
    zoom: {
      position: "bottomright",
    },
    legend: {
      position: "bottomleft",
      customContent: (title, items) => {
        return MapLegendMaker(items, max);
      },
    },
  };

  return (
    <div className="chart">
      <AreaMap {...config} />
    </div>
  );
};

export default MapChart;
