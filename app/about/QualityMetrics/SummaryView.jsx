"use client";

/* Components */
import { CompareGrid } from "./grids";

/* UI Library Components */
import { Card } from "antd";

/* Utils */
import { SUMMARY_DEFS } from "./rowBuilders";
import { dig } from "./utils";

/**
 * Renders the summary view for the quality metrics dashboard.
 *
 * The component transforms the predefined summary definitions into rows for
 * comparison and displays them using the shared comparison grid.
 *
 * @param {Array<Object>} history - Historical quality metric entries
 * used to populate the summary rows.
 * @returns {JSX.Element} A card containing the summary comparison grid.
 */
export function SummaryView({ history }) {
  const rows = SUMMARY_DEFS.map((def) => ({
    key: def.key,
    label: def.label,
    isTotal: true,
    values: history.map((run, i) => ({
      value: dig(run, def.key),
      total: null,
      prevValue:
        i === 0 && history.length > 1 ? dig(history[1], def.key) : null,
    })),
  }));

  return (
    <Card size="small" styles={{ body: { padding: 0 } }}>
      <CompareGrid rows={rows} history={history} />
    </Card>
  );
}
