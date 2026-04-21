"use client";

/* Components */
import URLBuilder from "@/lib/utils/URLBuilder";

/* Hooks */
import { usePathname } from "next/navigation";

/* Icons */
import { CodeOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Tooltip } from "antd";

/**
 * APIButton component provides a button that links to the API endpoint for the current page.
 *
 * @param {Object} searchParams - The query parameters used to build the API URL.
 * @returns {JSX.Element} The APIButton component.
 */
export default function APIButton({ searchParams, apiExpert }) {
  const pathname = usePathname();
  const URL = URLBuilder(pathname, searchParams);

  return (
    <Tooltip
      color="white"
      title="Ver en la API - JSON"
      styles={{ body: { color: "black" } }}
    >
      <Button
        type="primary"
        icon={<CodeOutlined id={styles.icon} />}
        size="small"
        href={`${process.env.NEXT_PUBLIC_CLIENT_API}${
          apiExpert ? "" : "/app"
        }${URL}`}
        target="_blank"
        id={styles.api_button}
      >
        API
      </Button>
    </Tooltip>
  );
}
