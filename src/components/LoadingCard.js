import React from "react";
const Card = require("antd/lib/card").default;
const Spin = require("antd/lib/spin").default;
const LoadingOutlined = require("@ant-design/icons/LoadingOutlined").default;

const LoadingCard = ({ title, height }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  return (
    <Card
      title={title}
      style={{
        height: height,
        textAlign: "center",
      }}
    >
      <Spin indicator={antIcon} style={{ marginTop: "130px" }} />
    </Card>
  );
};

export default LoadingCard;
