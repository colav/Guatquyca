"use client";

/* Icons */
import { FilterOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, ConfigProvider } from "antd";

export default function FilterPanel() {
  const showDrawer = () => {
    return;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: "0 0 8px 8px",
        },
      }}
    >
      <Button
        size="large"
        icon={<FilterOutlined />}
        onClick={showDrawer}
        id={styles.fixedWidget}
        type="primary"
      >
        Filtros
      </Button>
    </ConfigProvider>
  );
}
