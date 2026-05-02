"use client";

import React from "react";

/* Icons */
import { open_access_icon } from "@/app/components/icons/open_access";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * OpenAccessStatus is a client-side function component that displays a tag with an icon and color based on the status of open access.
 *
 * @param {string} status - A string representing the status of open access. It should be one of the following:
 * 'hybrid', 'green', 'gold', 'closed', 'bronze'.
 * @returns {JSX.Element} A Tooltip containing a Tag with an icon and color based on the status of open access.
 */
export default function OpenAccessStatus({ status }) {
  const OA_STATUS = {
    hybrid: { label: "Híbrido", color: "lime" },
    green: { label: "Verde", color: "green" },
    gold: { label: "Dorado", color: "gold" },
    closed: { label: "Cerrado", color: "red" },
    bronze: { label: "Bronce", color: "volcano" },
    diamond: { label: "Diamante", color: "cyan" },
  };

  if (!status || !OA_STATUS[status]) {
    return null;
  }

  return (
    <Tooltip
      color="white"
      styles={{ body: { color: "black" } }}
      title={`${status !== "closed" ? "Ruta:" : "Acceso"} ${
        OA_STATUS[status].label
      }`}
    >
      <Tag color={OA_STATUS[status].color} id={styles.OATag}>
        <span
          style={{
            display: "inline-flex",
            position: "relative",
            top: 2,
            marginRight: 5,
          }}
        >
          {React.createElement(open_access_icon)}
        </span>
        {status === "closed" ? "Acceso Cerrado" : "Acceso Abierto"}
      </Tag>
    </Tooltip>
  );
}
