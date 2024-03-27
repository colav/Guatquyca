import React, { useEffect } from "react";
import ReactDOM from "react-dom";

/* Libraries */
import G6 from "@antv/g6";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Empty } from "antd";

/**
 * GraphChart is a client-side function component that displays a graph chart.
 *
 * @param {Object[]} data - The data to display in the graph chart. Each object should have 'log_count', 'NOMBRE_DPT', 'name', and 'count' properties.
 * @returns {JSX.Element} If data is not provided, an Empty component is returned. Otherwise, a div that will contain the graph chart is returned.
 */
const GraphChart = ({ data }) => {
  if (!data) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "170px" }}
      />
    );
  }
  const ref = React.useRef(null);
  const { innerWidth } = window;
  let graph = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: innerWidth / 2 - 54,
        height: 400,
        renderer: "svg",
        modes: {
          default: [
            {
              type: "drag-node",
              enableOptimize: true,
            },
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
        fitCenter: true,
        fitView: true,
        layout: {
          type: "gForce",
          nodeStrength: 1000,
          edgeStrength: 200,
          workerEnabled: true,
          gpuEnabled: true,
          preventOverlap: true,
          gravity: 20,
        },
        defaultNode: {
          style: { stroke: "#620dd9", fill: "#873bf4", fillOpacity: 0.6 },
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
      graph.data(data);
      graph.render();
    }
  }, []);
  return <div ref={ref} className={styles.graph}></div>;
};
export default GraphChart;
