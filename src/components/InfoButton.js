import React from "react";

/* UI Library Components */
const Tooltip = require("antd/lib/tooltip").default;

/* Icons */
const InfoCircleOutlined =
  require("@ant-design/icons/InfoCircleOutlined").default;

const InfoButton = ({ text }) => {
  return (
    <Tooltip
      placement="topRight"
      arrowPointAtCenter
      trigger="click"
      color="#39658C"
      title={text}
    >
      <InfoCircleOutlined style={{ color: "#063966", fontSize: "20px" }} />
    </Tooltip>
  );
};

export default InfoButton;
