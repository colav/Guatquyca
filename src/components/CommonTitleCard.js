import React from "react";

/* Utilities */
import { renderedAffiliation } from "../helpers/renderedAffiliation";
import { renderedExternal_urls } from "../helpers/renderedExternal_urls";

/* UI Library Components */
const Avatar = require("antd/lib/avatar").default;
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Typography = require("antd/lib/typography").default;

/* Icons */
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;

/* UI Library Sub-components */
const { Meta } = Card;

const CommonTitleCard = ({
  title,
  abbreviation,
  external_urls,
  institution,
  setCurrentURL,
}) => {
  return (
    <Col span={24}>
      <Card actions={renderedExternal_urls(external_urls)} className="pattern">
        <Meta
          avatar={
            <Avatar
              size={{ xs: 60, sm: 60, md: 150, lg: 150, xl: 150, xxl: 150 }}
              src={
                institution[0].logo || institution ? (
                  institution[0].logo || institution
                ) : (
                  <ReadOutlined style={{ color: "gray", fontSize: "40px" }} />
                )
              }
              style={{
                backgroundColor: "white",
                padding: 10,
                border: "1px solid lightgray",
              }}
            />
          }
          description={
            <>
              <Typography.Title level={2}>
                {title} {abbreviation ? `(${abbreviation})` : ""}
              </Typography.Title>
              <Typography.Title level={3}>
                {renderedAffiliation(institution[0].name, setCurrentURL)}
              </Typography.Title>
            </>
          }
        />
      </Card>
    </Col>
  );
};

export default CommonTitleCard;
