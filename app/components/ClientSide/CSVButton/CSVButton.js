"use client";

/* Icons */
import { DownloadOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button } from "antd";

export default function CSVButton({ pathname }) {
  return (
    <Button
      type="primary"
      icon={<DownloadOutlined id={styles.icon} />}
      size="small"
      href={`${process.env.CLIENT_API}${pathname}/csv`}
      target="_blank"
      id={styles.csv_button}
    >
      CSV
    </Button>
  );
}
