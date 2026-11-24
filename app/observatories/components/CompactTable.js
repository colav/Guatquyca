"use client";

/* Hooks */
import { useMemo } from "react";

/* lib */
import { TABLE_ROW } from "@/lib/observatories/layout";

/* UI Library Components */
import { Table } from "antd";

const CELL = {
  height: TABLE_ROW.height,
  padding: `${TABLE_ROW.paddingY}px ${TABLE_ROW.paddingX}px`,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

/**
 * Table with the same fixed height in every row (header included): the text that does not fit is
 * cut with "…" and the full text stays in the `title`; the content is centred vertically.
 * Same props as the Ant Design table.
 */
export default function CompactTable({ columns, ...props }) {
  const fixed = useMemo(
    () => columns.map((c) => ({ ellipsis: true, ...c, onCell: () => ({ style: CELL }), onHeaderCell: () => ({ style: CELL }) })),
    [columns],
  );
  return <Table size="small" pagination={false} tableLayout="fixed" {...props} columns={fixed} />;
}
