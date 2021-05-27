import React from "react";

/* Icons */
const FileOutlined = require("@ant-design/icons/FileOutlined").default;

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Statistic = require("antd/lib/statistic").default;

const SingleStatistic = ({ data, title }) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={data}
        valueStyle={{ color: "#3f8600" }}
        prefix={<FileOutlined />}
        suffix={data === 1 ? "Artículo." : "Artículos."}
      />
    </Card>
  );
};

export default SingleStatistic;
