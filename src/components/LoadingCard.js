import React from "react";
const Card = require("antd/lib/card").default;
const Spin = require("antd/lib/spin").default;
const Loading3QuartersOutlined = require("@ant-design/icons/Loading3QuartersOutlined")
  .default;

const LoadingCard = () => {
  const antIcon = <Loading3QuartersOutlined style={{ fontSize: 40 }} spin />;
  return (
    <Card
      style={{
        height: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin indicator={antIcon} />
    </Card>
  );
};

export default LoadingCard;
