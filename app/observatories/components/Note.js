"use client";

/* UI Library Components */
import { Typography } from "antd";

/** Note under a panel (F77b: moved from Board2Parts.js, used by the boards that repeat the same secondary text). */
export default function Note({ children, ...rest }) {
  return (
    <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }} {...rest}>
      {children}
    </Typography.Paragraph>
  );
}
