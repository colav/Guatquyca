"use client";

/* UI Library Components */
import { Card, Empty } from "antd";

export default function EmptyAffiliations() {
  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No hay afiliaciones para esta entidad"
        style={{ fontSize: "20px" }}
      />
    </div>
  );
}
