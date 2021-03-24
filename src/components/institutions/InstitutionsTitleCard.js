import React from "react";
import { renderedExternal_urls } from "../../helpers/renderedExternal_urls";
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Typography = require("antd/lib/typography").default;

const InstitutionsTitleCard = ({ state, setCurrentURL }) => {
  return (
    <Col xs={24} sm={24} md={18} lg={19} xl={20} xxl={21}>
      <Card actions={renderedExternal_urls(state.external_urls)}>
        <Typography.Title level={2}>{state.name}</Typography.Title>
      </Card>
    </Col>
  );
};

export default InstitutionsTitleCard;
