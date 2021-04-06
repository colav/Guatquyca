import React from "react";
const Button = require("antd/lib/button").default;
const DownloadOutlined = require("@ant-design/icons/DownloadOutlined").default;

const DownloadPDFButton = ({ data }) => {
  const csv = "test,1,2,3";

  return (
    <Button
      type="link"
      icon={<DownloadOutlined />}
      shape="round"
      href={`data:text/csv;charset=utf-8, ${csv}`}
      download="production.csv"
    >
      PDF
    </Button>
  );
};

export default DownloadPDFButton;
