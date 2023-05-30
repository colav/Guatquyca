import React, { useState, useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import StackedColumnChart from "./StackedColumnChart";

/* Constants */
import { PLOTLIST_STACKED } from "../../utils/constants";

/* UI Library Components */
import { Card, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/colav";
import { useLocation, useSearchParams } from "react-router-dom";

const StackedColumnHandler = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "person";
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState(
    PLOTLIST_STACKED[type][0].value
  );
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
          value={selectedPlot}
          style={{
            width: 420,
          }}
          onChange={handleChange}
          options={PLOTLIST_STACKED[type]}
        />
      }
    >
      <div className="chart">
        {state.isLoading ? (
          <LoadingCard height={"100%"} />
        ) : (
          <StackedColumnChart data={state.data.plot} />
        )}
        {state.isError ? <ErrorWarning /> : ""}
      </div>
    </Card>
  );
};

export default StackedColumnHandler;
