import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

/* Libraries */
import G6 from "@antv/g6";

const GraphChart = ({ data }) => {
  const ref = useRef(null);
  const { innerWidth } = window;

  useEffect(() => {
    let graph = null;
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: innerWidth / 2 - 57,
        height: 396,
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
          ],
        },
        layout: {
          type: data?.nodes?.length > 220 ? "forceAtlas2" : "gForce",
          preventOverlap: true,
        },
        defaultNode: {
          style: { stroke: "#00A283", fill: "#873bf4", fillOpacity: 0.6 },
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
    graph.data(data);
    graph.render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="chart">
      <div ref={ref}></div>
    </div>
  );
};

export default GraphChart;
