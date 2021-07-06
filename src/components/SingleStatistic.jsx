import React from "react";

/* Components */
import InfoButton from "./InfoButton";

/* Icons */
import { CitationsIcon } from "../icons/citations";
const DatabaseOutlined = require("@ant-design/icons/DatabaseOutlined").default;
const FileOutlined = require("@ant-design/icons/FileOutlined").default;
const ShareAltOutlined = require("@ant-design/icons/ShareAltOutlined").default;
const LineChartOutlined =
  require("@ant-design/icons/LineChartOutlined").default;

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Statistic = require("antd/lib/statistic").default;

const SingleStatistic = ({
  data,
  title,
  margin = 0,
  icon,
  suffix = null,
  infoText,
}) => {
  const prefixIcon = {
    file: <FileOutlined />,
    line: <LineChartOutlined />,
    db: <DatabaseOutlined />,
    share: <ShareAltOutlined />,
    citations: React.createElement(CitationsIcon),
  };

  return (
    <Card style={{ marginBottom: margin }}>
      <Row>
        <Col span={21}>
          <Statistic
            title={title}
            value={data}
            valueStyle={{ color: "#3f8600" }}
            prefix={prefixIcon[icon]}
            suffix={suffix}
          />
        </Col>
        <Col span={3}>
          {infoText ? <InfoButton text={infoText} title={title} /> : ""}
        </Col>
      </Row>
    </Card>
  );
};

export default SingleStatistic;
