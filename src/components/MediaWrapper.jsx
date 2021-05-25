import React from "react";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Empty = require("antd/lib/empty").default;

const MediaWrapper = () => {
  return (
    <Card
      title="Información de medios de comunicación"
      style={{ height: "400px" }}
    >
      <Empty description={"En construcción."} style={{ marginTop: 65 }} />
    </Card>
  );
};

export default MediaWrapper;
