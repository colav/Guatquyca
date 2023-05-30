import React from "react";

/* Libraries */
import { Pie } from "@ant-design/charts";

/* UI Library Components */
import { Empty } from "antd";

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

  if (data !== null && data.length !== 0) {
    return <Pie {...config} />;
  } else
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "100px" }}
      />
    );
};

export default PieChart;
