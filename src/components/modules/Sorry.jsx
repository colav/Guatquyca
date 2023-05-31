import React from "react";

/* UI Library Components */
import { Row, Col, Typography } from "antd";

/* Icons */
import { WarningOutlined } from "@ant-design/icons";

const Sorry = () => {
  return (
    <>
      <Row
        justify={"center"}
        align={"middle"}
        style={{ marginTop: "80px", marginBottom: "30px" }}
      >
        <WarningOutlined
          style={{ fontSize: "150px", color: "#faad14", textAlign: "center" }}
        />
      </Row>
      <Row justify={"center"} align={"middle"} style={{ height: "100px" }}>
        <Col xs={24} lg={12}>
          <Typography.Title
            level={1}
            type="warning"
            style={{ textAlign: "center" }}
          >
            Este perfil aún no se encuentra disponible, podrás consultarlo en
            nuestra próxima actualización.
          </Typography.Title>
        </Col>
      </Row>
    </>
  );
};

export default Sorry;
