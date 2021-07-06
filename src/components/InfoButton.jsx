import React from "react";

/* UI Library Components */
const Modal = require("antd/lib/modal").default;

/* Icons */
const InfoCircleOutlined =
  require("@ant-design/icons/InfoCircleOutlined").default;

const InfoButton = ({ text, title = "Información" }) => {
  const info = () => {
    Modal.info({ title: title, content: text, width: "700px" });
  };

  return (
    <InfoCircleOutlined
      onClick={info}
      style={{ color: "#063966", fontSize: "20px" }}
    />
  );
};

export default InfoButton;
