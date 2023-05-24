import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* Libraries */
import G6 from "@antv/g6";

/* UI Library Components */
import { Card, Select } from "antd";

/* Utilities */
import { APIRequest } from "../../apis/clustercien";
import { useLocation } from "react-router-dom";

const PLOTLIST = [
  { label: "Coautoría institucional", value: "collaboration_network" },
];

const GraphChart = () => {
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState("collaboration_network'");
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&plot=${selectedPlot}`
  );

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}&plot=${selectedPlot}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlot]);

  const ref = useRef(null);

  useEffect(() => {
    let graph = null;
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: 800,
        height: 580,
        modes: {
          default: [
            {
              type: "zoom-canvas",
              enableOptimize: true,
              optimizeZoom: 0.9,
            },
            {
              type: "drag-canvas",
              enableOptimize: true,
            },
            {
              type: "tooltip",
              formatText(model) {
                return `Grado: ${model.degree}`;
              },
            },
            {
              type: "edge-tooltip",
              formatText(model) {
                return `${model.coauthorships} ${
                  model.coauthorships > 1 ? "coautorías" : "coautoría"
                }`;
              },
            },
            "drag-node",
            /* "activate-relations", */
          ],
        },
        layout: {
          type: "gForce" /* data.nodes.length > 50 ? "forceAtlas2" : "gForce" */,
          preventOverlap: true,
        },
        defaultNode: {
          style: { stroke: "#00A283", fill: "#00E4A9", fillOpacity: 0.6 },
          labelCfg: {
            style: { fontSize: 8 },
            position: "bottom",
            offset: 1,
          },
        },
        defaultEdge: {
          style: {
            stroke: "#e8e7e3",
          },
        },
      });
    }
    graph.data(state.data.plot);
    graph.render();
  }, []);

  const handleChange = (value) => {
    setSelectedPlot(value);
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
              width: 420,
            }}
            onChange={handleChange}
            options={PLOTLIST}
          />
        }
      >
        <div className="chart">
          <div ref={ref}></div>
        </div>
      </Card>
    );
};

export default GraphChart;
