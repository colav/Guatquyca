import React, { useState, useEffect } from "react";
import Graphin, { Behaviors, GraphinContext } from "@antv/graphin";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* UI Library Components */
import { Card, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/clustercien";
import { useLocation } from "react-router-dom";

/* Library Sub-components */
const { ZoomCanvas, ActivateRelations, Hoverable } = Behaviors;

const PLOTLIST = [
  { label: "Coautoría institucional", value: "collaboration_network" },
];

const Graph = () => {
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

  // Styles.
  const defaultNode = {
    type: "graphin-circle",
    style: {
      keyshape: {
        stroke: "#3996C8",
        fill: "#52C5E6",
        fillOpacity: 0.7,
      },
      label: {
        fontSize: 8,
      },
    },
  };

  const defaultEdge = {
    type: "graphin-line",
    style: {
      keyshape: {
        type: "poly",
        poly: { distance: 30 },
        endArrow: null,
        stroke: "#e8e7e3",
      },
    },
  };

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return (
      <Card
        size="small"
        title="Redes"
        headStyle={{ backgroundColor: "#003e65", color: "white" }}
        bodyStyle={{ padding: "10px", height: "420px" }}
      >
        <LoadingCard height={"100%"} />
      </Card>
    );
  } else
    return (
      <Card
        size="small"
        title="Redes"
        headStyle={{ backgroundColor: "#003e65", color: "white" }}
        bodyStyle={{ padding: "10px", height: "420px" }}
        hoverable
        extra={
          <Select
            size="small"
            defaultValue={selectedPlot}
            style={{
              width: 520,
            }}
            onChange={handleChange}
            options={PLOTLIST}
          />
        }
      >
        <div className="chart">
          <Graphin
            data={state.data.plot}
            defaultNode={defaultNode}
            defaultEdge={defaultEdge}
          >
            <Hoverable bindType="node" />
            <ZoomCanvas enableOptimize />
            <ActivateRelations />
          </Graphin>
        </div>
      </Card>
    );
};

export default Graph;
