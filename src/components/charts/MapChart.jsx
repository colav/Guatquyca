import React, { useState, useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* Libraries */
import { AreaMap } from "@ant-design/charts";

/* UI Library Components */
import { Card, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/clustercien";
import { useLocation } from "react-router-dom";
import MapLegendMaker from "../../utils/MapLegendMaker";

const PLOTLIST = [
  {
    label: "Número de coautorías según país de afiliación",
    value: "collaboration_worldmap",
  },
  {
    label: "Cantidad de coautorías según departamento colombiano de afiliación",
    value: "collaboration_colombiamap",
  },
];

const MapChart = () => {
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState("collaboration_worldmap");
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&plot=${selectedPlot}`
  );

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}&plot=${selectedPlot}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlot]);

  let max = "";
  let config = "";

  const handleChange = (value) => {
    setSelectedPlot(value);
  };

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return (
      <Card
        size="small"
        headStyle={{ backgroundColor: "#003e65", color: "white" }}
        bodyStyle={{ padding: "10px", height: "420px" }}
      >
        <LoadingCard height={"100%"} />
      </Card>
    );
  } else
    max = Math.max(
      ...state.data?.plot?.features?.map((item) => item.properties.count)
    ).toString();

  config = {
    map: {
      type: "mapbox",
      style: "blank",
    },
    source: {
      data: state.data.plot,
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
    <Card
      size="small"
      headStyle={{ backgroundColor: "#003e65", color: "white" }}
      bodyStyle={{ padding: "10px", height: "420px" }}
      extra={
        <Select
          size="small"
          defaultValue={selectedPlot}
          style={{
            width: 420,
          }}
          onChange={handleChange}
          options={PLOTLIST}
        />
      }
    >
      <div className="chart">
        <AreaMap {...config} />
      </div>
    </Card>
  );
};

export default MapChart;
