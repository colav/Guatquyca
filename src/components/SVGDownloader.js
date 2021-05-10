import React from "react";

/* Libraries */
import { exportSVG } from "@upsetjs/react";

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const FileImageOutlined = require("@ant-design/icons/FileImageOutlined")
  .default;

const PDFDownloader = ({ chart }) => {
  function svg() {
    exportSVG(chart, { type: "svg" });
  }

  return (
    <Button
      size="small"
      style={{
        color: "#9D3715",
        backgroundColor: "#ffe9cc",
        border: "none",
        marginRight: "20px",
      }}
      onClick={svg}
      icon={<FileImageOutlined />}
    >
      svg
    </Button>
  );
};

export default PDFDownloader;
