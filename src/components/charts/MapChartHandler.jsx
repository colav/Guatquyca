import React, { useState, useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import MapChart from "./MapChart";

/* Constants */
import { PLOTLIST_MAP } from "../../utils/constants";

/* UI Library Components */
import { Card, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/colav";
import { useLocation } from "react-router-dom";

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
      hoverable
      extra={
        <Select
          size="small"
          defaultValue={selectedPlot}
          style={{
            width: 420,
          }}
          onChange={handleChange}
          options={PLOTLIST_MAP}
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
