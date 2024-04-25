"use client";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Tooltip } from "antd";

export default function APIButton({ pathname }) {
  return (
    <Tooltip title="Ver en la API - JSON">
      <Button
        type="primary"
        icon={<LinkOutlined id={styles.icon} />}
        size="small"
        href={`${process.env.CLIENT_API}api${pathname.slice(4)}`}
        target="_blank"
        id={styles.api_button}
      >
        API
      </Button>
    </Tooltip>
  );
}
