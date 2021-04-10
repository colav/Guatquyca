import React from "react";
const Button = require("antd/lib/button").default;
const DownloadOutlined = require("@ant-design/icons/DownloadOutlined").default;

const DownloadJSONButton = ({ data }) => {
  const JSON_file = encodeURIComponent(JSON.stringify(data));

  return (
    <Button
      icon={<DownloadOutlined />}
      type="dashed"
      shape="round"
      style={{ color: "#9D3715" }}
      href={`data:text/json;charset=utf-8, ${JSON_file}`}
      download="filename.JSON"
    >
      JSON
    </Button>
  );
};

export default DownloadJSONButton;
