import React from "react";

/* Components */
import InfoButton from "./InfoButton";

/* Icons */
import { CitationsIcon } from "../icons/citations";
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;
const FileOutlined = require("@ant-design/icons/FileOutlined").default;
const ShareAltOutlined = require("@ant-design/icons/ShareAltOutlined").default;
const UserOutlined = require("@ant-design/icons/UserOutlined").default;
const BankOutlined = require("@ant-design/icons/BankOutlined").default;
const LineChartOutlined =
  require("@ant-design/icons/LineChartOutlined").default;

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Statistic = require("antd/lib/statistic").default;

const SingleStatistic = ({
  loading,
  data,
  title,
  height = null,
  margin = 0,
  icon,
  suffix = null,
  infoText,
}) => {
  const prefixIcon = {
    file: <FileOutlined />,
    line: <LineChartOutlined />,
    source: <ReadOutlined />,
    share: <ShareAltOutlined />,
    user: <UserOutlined />,
    institution: <BankOutlined />,
    citations: React.createElement(CitationsIcon),
  };

  return (
    <Card
      title={title}
      size="small"
      style={{ marginBottom: margin, height: height }}
      extra={[<InfoButton key={2} text={infoText} title={title} />]}
    >
      <Row>
        <Col span={21}>
          <Statistic
            loading={loading}
            value={data}
            valueStyle={{ color: "#3f8600" }}
            prefix={prefixIcon[icon]}
            suffix={suffix}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SingleStatistic;
