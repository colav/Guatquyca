import React from "react";

/* Components */
import { WarningModal } from "./WarningModal";

/* Utilities */
import history from "../history";
import _ from "lodash";
import { BASE_URL } from "../constants/routes";
const queryString = require("query-string");

/* UI Library Components */
const Button = require("antd/lib/button").default;

/* Icons */
const DownloadOutlined = require("@ant-design/icons/DownloadOutlined").default;

const DownloadCSVButton = ({ parsedURL }) => {
  let URL = _.omit(parsedURL, ["max", "page"]);
  URL["data"] = "csv";
  let CSV_URL = `${BASE_URL}${
    history.location.pathname
  }?${queryString.stringify(URL)}`;

  return (
    <Button
      icon={<DownloadOutlined />}
      type="dashed"
      shape="round"
      style={{ color: "#9D3715" }}
      href={CSV_URL}
      onClick={WarningModal}
    >
      CSV
    </Button>
  );
};

export default DownloadCSVButton;
