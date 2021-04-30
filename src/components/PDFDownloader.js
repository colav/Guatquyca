import React from "react";

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const FilePdfOutlined = require("@ant-design/icons/FilePdfOutlined").default;

const PDFDownloader = ({ chart }) => {
  function pdf() {
    chart.saveAsPdf();
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
      onClick={pdf}
      icon={<FilePdfOutlined />}
    >
      pdf
    </Button>
  );
};

export default PDFDownloader;
