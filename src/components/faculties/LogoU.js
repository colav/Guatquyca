import React from "react";
import { LOGOUDEA } from "../../constants/routes";
const Avatar = require("antd/lib/avatar").default;
const Col = require("antd/lib/col").default;

const LogoU = () => {
  return (
    <Col xs={0} sm={0} md={6} lg={5} xl={4} xxl={3}>
      <Avatar
        size={200}
        alt="Logo Universidad"
        src={LOGOUDEA}
        preview="false"
        style={{
          backgroundColor: "white",
          padding: 10,
        }}
      />
    </Col>
  );
};

export default LogoU;
