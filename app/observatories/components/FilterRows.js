"use client";

/* UI Library Components */
import { Grid } from "antd";

/** Width of the last column, where the switches go (F77, D-182). */
export const SWITCH_COLUMN = 260;
/** Width of the two years (≈ 90 px each plus the gap). */
export const YEARS_COLUMN = 196;

/**
 * Panel of filters in rows of columns of different width (F77, D-182): each row has its own template, the last column is the
 * same in every row (the switches). Below `lg` the rows break into as many columns as fit.
 *
 * @param {{ columns: string, cells: React.ReactNode[] }[]} rows - `columns` is a `grid-template-columns`; a `null` cell leaves its place empty.
 */
export default function FilterRows({ rows }) {
  const screens = Grid.useBreakpoint();
  const wide = screens.lg !== false; // until the width is known, the wide layout (no jump on a desktop)
  if (!wide) {
    return (
      <div data-testid="filter-rows" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "6px 12px" }}>
        {rows.flatMap((r) => r.cells).filter(Boolean).map((cell, i) => <div key={i} style={{ minWidth: 0 }}>{cell}</div>)}
      </div>
    );
  }
  return (
    <div data-testid="filter-rows" style={{ display: "grid", rowGap: 6 }}>
      {rows.map((r, i) => (
        <div key={i} data-testid="filter-row" style={{ display: "grid", gridTemplateColumns: r.columns, columnGap: 12, alignItems: "start" }}>
          {r.cells.map((cell, j) => <div key={j} style={{ minWidth: 0 }}>{cell}</div>)}
        </div>
      ))}
    </div>
  );
}
