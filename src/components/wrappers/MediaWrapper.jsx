import React from "react";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Empty = require("antd/lib/empty").default;

const MediaWrapper = () => {
  return (
    <Card
      size="small"
      title="Información de medios de comunicación"
      style={{ height: "400px" }}
    >
      <Empty description={"En construcción."} style={{ marginTop: 80 }} />
    </Card>
  );
};

export default MediaWrapper;
