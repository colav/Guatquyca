"use client";

/* lib */
import { CARD_SHADOW } from "@/lib/observatories/layout";
import { BRAND } from "@/lib/observatories/palette";

/* UI Library Components */
import { Card, Empty, Typography } from "antd";

/* Constants */
const CARD_HEADER_STYLE = {
  backgroundColor: BRAND.header,
  color: BRAND.white,
  padding: "6px 10px",
  overflow: "visible",
};

/**
 * Card of a panel of the board, with the same header as the charts of the rest of the platform.
 *
 * @param {string} title - Panel title.
 * @param {string} [note] - Short note next to the title.
 * @param {boolean} [empty] - Shows the "no data" state instead of the children.
 */
export default function ChartCard({ title, note, empty = false, children, style }) {
  return (
    <Card
      size="small"
      data-testid="chart-card"
      style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: CARD_SHADOW, ...style }}
      styles={{ header: CARD_HEADER_STYLE, body: { padding: 10, flex: "1 1 auto", display: "flex", flexDirection: "column" } }}
      title={title}
      extra={note ? <span title={typeof note === "string" ? note : undefined} style={{ color: BRAND.white, fontSize: 12, display: "inline-block", maxWidth: "60vw", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>{note}</span> : null}
    >
      {empty ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Typography.Text>Sin datos para este filtro.</Typography.Text>} />
      ) : (
        children
      )}
    </Card>
  );
}
