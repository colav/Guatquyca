import React, { useState, useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import GraphChart from "./GraphChart";

/* Constants */
import { PLOTLIST_GRAPH } from "../../utils/constants";

/* UI Library Components */
import { Card, Empty, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/colav";
import { useLocation, useSearchParams } from "react-router-dom";

const GraphChartHandler = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "person";
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState("collaboration_network");
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
          options={PLOTLIST_GRAPH[type]}
        />
      }
    >
      <div className="chart">
        {state.isLoading ? (
          <LoadingCard height={"100%"} />
        ) : state.data.plot !== null ? (
          <GraphChart data={state.data.plot} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Datos insuficientes"
            style={{ marginTop: "100px" }}
          />
        )}
        {state.isError ? <ErrorWarning /> : ""}
      </div>
    </Card>
  );
};

export default GraphChartHandler;
