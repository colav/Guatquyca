import React from "react";

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const FileImageOutlined =
  require("@ant-design/icons/FileImageOutlined").default;

const ExportSVGAnyChart = ({ chart }) => {
  return (
    <Button
      size="small"
      style={{
        color: "#9D3715",
        backgroundColor: "#ffe9cc",
        border: "none",
        marginRight: "10px",
      }}
      onClick={() => chart.saveAsSvg()}
      icon={<FileImageOutlined />}
    >
      svg
    </Button>
  );
};

export default ExportSVGAnyChart;
