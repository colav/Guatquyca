import React from "react";

/* Libraries */
import { Column } from "@ant-design/charts";

const StackedColumnChart = ({ data }) => {
  let config_normal = {
    data: data,
    xField: "x",
    yField: "y",
    appendPadding: [10, 10, 10, 10],
    legend: { layout: "horizontal", position: "top" },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
    slider: { start: 0, end: 0.5 },
  };

  let config_stacked = {
    data: data,
    isStack: true,
    xField: "x",
    yField: "y",
    seriesField: "type",
    appendPadding: [10, 10, 10, 10],
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
    legend: { layout: "horizontal", position: "top" },
    slider: { start: 0, end: 0.5 },
  };

  let config = config_normal;

  if (data !== null) {
    if (data[0]?.type) {
      config = config_stacked;
    }
    return (
      <div className="chart">
        <Column {...config} />
      </div>
    );
  }
};

export default StackedColumnChart;
