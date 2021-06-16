import React from "react";

/* Utilities */
import history from "../history";
const queryString = require("query-string");

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const DownloadOutlined = require("@ant-design/icons/DownloadOutlined").default;

const DownloadCSVButton = ({ parsedURL }) => {
  let URL = { ...parsedURL };
  URL["data"] = "csv";
  let CSV_URL = `http://clustercien.udea.edu.co:8888${
    history.location.pathname
  }?${queryString.stringify(URL)}`;

  return (
    <Button
      icon={<DownloadOutlined />}
      type="dashed"
      shape="round"
      style={{ color: "#9D3715" }}
      href={CSV_URL}
    >
      CSV
    </Button>
  );
};

export default DownloadCSVButton;
