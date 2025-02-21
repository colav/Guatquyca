/* Hooks */
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
  const graphRef = useRef(null);

  // If no data, render the empty state and do not mount the graph
  if (!data) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "170px" }}
      />
    );
  }

  // Create the graph instance only once when the component mounts
  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({ container: containerRef.current });
    graphRef.current = graph;

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
        graphRef.current = null;
      }
    };
  }, []);

  // Update the graph options whenever the data prop changes
  useEffect(() => {
    const container = containerRef.current;
    const graph = graphRef.current;
    if (!data || !container || !graph || graph.destroyed) return;

    // Calculate the width based on the current window size
    const { innerWidth } = window;
    const divisor = innerWidth < 768 ? 1 : 2;
    const width = innerWidth / divisor - 54;

    // Define the graph options using your original configuration
    const options = {
      data: data,
      width: width,
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
          size: function (datum) {
            return datum.size;
          },
          labelText: function (datum) {
            return datum.label;
          },
          fill: "#873bf4",
          fillOpacity: 0.6,
          stroke: "#620dd9",
          lineWidth: 1,
          labelFontSize: 6,
        },
      },
      edge: {
        style: {
          stroke: "#e8e7e3",
          lineWidth: function (datum) {
            return datum.size;
          },
        },
      },
      plugins: [
        {
          type: "tooltip",
          container: function (datum) {
            return;
          },
          getContent: function (e, items) {
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
    };

    // Set the new options and render the graph
    graph.setOptions(options);
    graph.render().catch((error) => console.debug(error));
  }, [data]);

  return <div ref={containerRef} />;
};

export default GraphChart;
