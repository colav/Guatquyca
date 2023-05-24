import React from "react";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Typography } from "antd";

const ExternalURL = ({ URLList }) => {
  const renderedName = (name) => {
    if (name === "site") {
      return "Sitio Web";
    } else if (name === "wikipedia") {
      return "Wikipedia";
    }
    return name;
  };

  return (
    <>
      <Typography.Title
        className="bold"
        level={4}
        style={{ margin: 0, color: "gray" }}
      >
        <LinkOutlined /> Páginas externas:
      </Typography.Title>
      {URLList?.length
        ? URLList.map(
            (item, idx) =>
              item.source !== "mag" && (
                <div key={idx}>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {renderedName(item.source)}
                  </a>
                </div>
              )
          )
        : "No disponible"}
    </>
  );
};

export default ExternalURL;
