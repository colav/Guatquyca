"use client";

/* UI Library Components */
import { Card, Empty } from "antd";

/**
 * EmptyAffiliations is a functional component that displays a message indicating
 * that there are no affiliations for the given entity. It uses the Empty component
 * from the antd library and centers it both vertically and horizontally within a
 * div with a light gray background.
 *
 * @component
 * @example
 * return (
 *   <EmptyAffiliations />
 * )
 */
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
