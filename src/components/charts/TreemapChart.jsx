import React from "react";

/* Libraries */
import { Treemap } from "@ant-design/charts";

const TreemapChart = ({ data }) => {
  let config = {
    data: {
      name: "root",
      children: data,
    },
    colorField: "name",
    legend: { layout: "horizontal", position: "top" },
  };

  return <Treemap {...config} />;
};

export default TreemapChart;