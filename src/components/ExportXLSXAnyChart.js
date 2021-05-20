import React from "react";

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const FileExcelOutlined =
  require("@ant-design/icons/FileExcelOutlined").default;

const ExportXLSXAnyChart = ({ chart }) => {
  return (
    <Button
      size="small"
      style={{
        color: "#9D3715",
        backgroundColor: "#ffe9cc",
        border: "none",
        marginRight: "10px",
      }}
      onClick={() => chart.saveAsXlsx()}
      icon={<FileExcelOutlined />}
    >
      xlsx
    </Button>
  );
};

export default ExportXLSXAnyChart;
