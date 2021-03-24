import React from "react";
import { renderedAffiliation } from "../../helpers/renderedAffiliation";
import { renderedExternal_urls } from "../../helpers/renderedExternal_urls";
const Card = require("antd/lib/card").default;
const Typography = require("antd/lib/typography").default;
const Col = require("antd/lib/col").default;

const FacultyTitleCard = ({
  title,
  abbreviation,
  external_urls,
  subtitle,
  setCurrentURL,
}) => {
  return (
    <Col xs={24} sm={24} md={18} lg={19} xl={20} xxl={21}>
      <Card actions={renderedExternal_urls(external_urls)}>
        <Typography.Title level={2}>
          {title} {abbreviation ? `(${abbreviation})` : ""}
        </Typography.Title>
        <Typography.Title level={3}>
          {renderedAffiliation(subtitle, setCurrentURL)}
        </Typography.Title>
      </Card>
    </Col>
  );
};

export default FacultyTitleCard;
