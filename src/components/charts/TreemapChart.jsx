import React from "react";

/* Libraries */
import { Treemap } from "@ant-design/charts";

/* UI Library Components */
import { Empty } from "antd";

const TreemapChart = ({ data }) => {
  let config = {
    data: {
      name: "root",
      children: data,
    },
    colorField: "name",
    legend: { layout: "horizontal", position: "top" },
  };

  if (data !== null || data.length !== 0) {
    return <Treemap {...config} />;
  } else
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "100px" }}
      />
    );
};

export default TreemapChart;
