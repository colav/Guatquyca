import React from "react";

/* Libraries */
import { Column } from "@ant-design/charts";

const StackedColumnChart = ({ data }) => {
  let config_normal = {
    data: data,
    xField: "x",
    yField: "y",
    appendPadding: [10, 10, 10, 10],
    legend: { layout: "vertical", position: "right" },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
  };

  let config_stacked = {
    data: data,
    isStack: true,
    xField: "x",
    yField: "y",
    seriesField: "type",
    appendPadding: [10, 10, 10, 10],
    legend: { layout: "vertical", position: "right" },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
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
