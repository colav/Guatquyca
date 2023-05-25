import React from "react";

/* Libraries */
import { Pie } from "@ant-design/charts";

const PieChart = ({ data, content = null }) => {
  let config = {
    appendPadding: 20,
    data: data,
    angleField: "value",
    colorField: "name",
    pieStyle: { lineWidth: 3 },
    radius: 1,
    innerRadius: 0.4,
    label: {
      type: "spider",
      content: "{value} / {percentage}",
      style: { fontSize: 14 },
    },
    interactions: [{ type: "element-active" }],
  };

  return <Pie {...config} />;
};

export default PieChart;
