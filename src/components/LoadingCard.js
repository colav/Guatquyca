import React from "react";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Spin = require("antd/lib/spin").default;

/* Icons */
const LoadingOutlined = require("@ant-design/icons/LoadingOutlined").default;

const LoadingCard = ({ title, height }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  return (
    <Card size="small" title={title} style={{ height: height }}>
      <div className="loading-card-container">
        <Spin indicator={antIcon} style={{ marginTop: "160px" }} />
      </div>
    </Card>
  );
};

export default LoadingCard;
