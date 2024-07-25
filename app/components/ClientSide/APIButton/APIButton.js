"use client";

/* Components */
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Tooltip } from "antd";

export default function APIButton({ pathname, queryParams }) {
  const URL = URLBuilder(pathname, queryParams);

  return (
    <Tooltip title="Ver en la API - JSON">
      <Button
        type="primary"
        icon={<LinkOutlined id={styles.icon} />}
        size="small"
        href={`${process.env.NEXT_PUBLIC_CLIENT_API}${URL}`}
        target="_blank"
        id={styles.api_button}
      >
        API
      </Button>
    </Tooltip>
  );
}
