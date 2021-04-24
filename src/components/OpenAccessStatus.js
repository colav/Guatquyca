import React from "react";

/* Icons */
import { open_access_icon } from "../icons/open_access";

/* UI Library Components */
const Tag = require("antd/lib/tag").default;
const Tooltip = require("antd/lib/tooltip").default;

const OpenAccessStatus = ({ status }) => {
  const renderedColor = (status) => {
    switch (status) {
      case "green":
        return "green";
      case "hybrid":
        return "geekblue";
      case "gold":
        return "gold";
      case "closed":
        return "gray";
      case "bronze":
        return "volcano";
      default:
        break;
    }
  };

  return (
    <Tooltip title={status}>
      <Tag
        icon={React.createElement(open_access_icon)}
        color={renderedColor(status)}
      >
        Open Access
      </Tag>
    </Tooltip>
  );
};

export default OpenAccessStatus;
