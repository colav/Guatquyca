"use client";

/* lib */
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
      style={style}
      styles={{ header: CARD_HEADER_STYLE, body: { padding: 10 } }}
      title={title}
      extra={note ? <span style={{ color: BRAND.white, fontSize: 12 }}>{note}</span> : null}
    >
      {empty ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Typography.Text>Sin datos para este filtro.</Typography.Text>} />
      ) : (
        children
      )}
    </Card>
  );
}
