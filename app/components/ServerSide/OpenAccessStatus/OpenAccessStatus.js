import React from "react";

/* Icons */
import { open_access_icon } from "@/app/components/icons/open_access";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * OpenAccessStatus is a function component that displays a tag with an icon and color based on the status of open access.
 *
 * @param {string} status - A string representing the status of open access. It should be one of the following:
 * 'hybrid', 'green', 'gold', 'closed', 'bronze'.
 * @returns {JSX.Element} A Tooltip containing a Tag with an icon and color based on the status of open access.
 */
export default function OpenAccessStatus({ status }) {
  const OA_STATUS = {
    hybrid: { label: "Híbrido", color: "geekblue" },
    green: { label: "Verde", color: "green" },
    gold: { label: "Dorado", color: "gold" },
    closed: { label: "Cerrado", color: "gray" },
    bronze: { label: "Bronce", color: "volcano" },
  };

  return (
    <Tooltip title={OA_STATUS[status].label}>
      <Tag
        icon={React.createElement(open_access_icon)}
        color={OA_STATUS[status].color}
        className={styles.OATag}
      >
        {status === "closed" ? "Acceso Cerrado" : "Acceso Abierto"}
      </Tag>
    </Tooltip>
  );
}
