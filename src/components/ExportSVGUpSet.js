import React from "react";

/* Libraries */
import { exportSVG } from "@upsetjs/react";

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const FileImageOutlined =
  require("@ant-design/icons/FileImageOutlined").default;

const ExportSVGUpSet = ({ chart }) => {
  return (
    <Button
      size="small"
      style={{
        color: "#9D3715",
        backgroundColor: "#ffe9cc",
        border: "none",
        marginRight: "10px",
      }}
      onClick={() => exportSVG(chart, { type: "svg" })}
      icon={<FileImageOutlined />}
    >
      svg
    </Button>
  );
};

export default ExportSVGUpSet;
