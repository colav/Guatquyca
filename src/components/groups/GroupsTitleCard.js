import React from "react";
import { renderedAffiliation } from "../../helpers/renderedAffiliation";
const Card = require("antd/lib/card").default;
const Typography = require("antd/lib/typography").default;
const Col = require("antd/lib/col").default;
const LinkOutlined = require("@ant-design/icons/LinkOutlined").default;

const GroupsTitleCard = ({ title, extlink, subtitle, gruplac }) => {
  return (
    <Col
      xs={24}
      sm={24}
      md={18}
      lg={19}
      xl={20}
      xxl={21}
      style={{ padding: 0 }}
    >
      <Card
        actions={[
          extlink
            ? [
                <a href={extlink} key={1} className="extLink">
                  Página Oficial <LinkOutlined />
                </a>,
              ]
            : "",
          gruplac
            ? [
                <a href={gruplac} key={2} className="extLink">
                  GrupLAC <LinkOutlined />
                </a>,
              ]
            : "",
        ]}
      >
        <Typography.Title level={2}>{title}</Typography.Title>
        <Typography.Title level={3}>
          {renderedAffiliation(subtitle)}
        </Typography.Title>
      </Card>
    </Col>
  );
};

export default GroupsTitleCard;
