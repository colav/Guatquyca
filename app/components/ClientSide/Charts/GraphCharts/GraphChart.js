import React, { useEffect, useRef } from "react";

/* Libraries */
import { Graph } from "@antv/g6";

/* UI Library Components */
import { Empty } from "antd";

/**
 * GraphChart is a client-side function component that displays a graph chart.
 *
 * @param {Object[]} data - The data to display in the graph chart.
 * @returns {JSX.Element} If data is not provided, an Empty component is returned. Otherwise, a div that will contain the graph chart is returned.
 */
const GraphChart = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const { innerWidth } = window;
    /* const divisor = innerWidth < 768 ? 1 : 2; */
    /* const width = innerWidth / divisor - (innerWidth > 768 ? 54 : 88); */
    const divisor = innerWidth < 768 ? 1 : 3;
    const width = innerWidth / divisor - (innerWidth > 768 ? 50 : 88);

    const graph = new Graph({
      container: containerRef.current,
      data,
      width,
      height: 400,
      layout: {
        type: "fruchterman",
        preventOverlap: true,
        workerEnabled: true,
      },
      autoFit: "view",
      animation: false,
      behaviors: ["zoom-canvas", "drag-canvas", "drag-element"],
      zoomRange: [0.1, 5],
      node: {
        style: {
          size: (datum) => datum.size,
          labelText: (datum) => datum.label,
          fill: "#873bf4",
          fillOpacity: 0.6,
          stroke: "#620dd9",
          lineWidth: 1,
          labelFontSize: 6,
        },
      },
      edge: {
        style: { stroke: "#e8e7e3", lineWidth: (datum) => datum.size },
      },
      plugins: [
        {
          type: "tooltip",
          container: (datum) => {
            return;
          },
          getContent: (e, items) => {
            const { coauthorships, degree } = items[0];
            const label = coauthorships ? "Coautorías:" : "Grado:";
            const value = coauthorships || degree;

            return `<div style="display: flex; justify-content: space-between;">
                      <span style="font-size: 13px;">${label}</span>
                      <span style="margin-left: 2em; font-size: 13px;">${value}</span>
                    </div>`;
          },
        },
      ],
    });
    graph.render();

    return () => graph.destroy();
  }, []);

  if (!data) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "170px" }}
      />
    );
  }

  return <div ref={containerRef}></div>;
};

export default GraphChart;
