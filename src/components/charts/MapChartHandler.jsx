import React, { useState, useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import MapChart from "./MapChart";

/* UI Library Components */
import { Card, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/clustercien";
import { useLocation } from "react-router-dom";

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

const MapChartHandler = () => {
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState("collaboration_worldmap");
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&plot=${selectedPlot}`
  );

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}&plot=${selectedPlot}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlot]);

  const handleChange = (value) => {
    setSelectedPlot(value);
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
        {state.isLoading ? (
          <LoadingCard height={"100%"} />
        ) : (
          <MapChart data={state.data.plot} />
        )}
        {state.isError ? <ErrorWarning /> : ""}
      </div>
    </Card>
  );
};

export default MapChartHandler;
