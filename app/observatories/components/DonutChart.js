"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Components & utils */
import TooltipBox from "@/app/observatories/components/TooltipBox";
import { ringParts } from "@/lib/observatories/ringText";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";

/* Libraries */
const Pie = dynamic(() => import("@ant-design/charts").then((mod) => mod.Pie), { ssr: false });

/**
 * Donut of a distribution (product type, Scimago quartile or access route) with the total of the parts drawn at the centre of
 * the ring and an own legend underneath, one column: colour, name and percentage on the right (F77, D-182). The centre and the
 * legend are HTML over / under the chart; the ring is the one of Ant Design.
 *
 * @param {string[]} labels - Label of each part.
 * @param {number[]} values - Count of each part (zeros are not drawn nor listed).
 * @param {string[]} colors - Colour of each part, from the palettes of lib/constants.js.
 * @param {string} [centerText] - Text at the centre instead of the total (Q-10: the open-access share).
 */
function DonutChart({ labels, values, colors, centerText = null }) {
  const { total, totalText, parts } = useMemo(() => ringParts(labels, values, colors), [labels, values, colors]);
  const config = useMemo(
    () => ({
      data: parts.map((p) => ({ name: p.name, value: p.value, percent: p.percent })),
      scale: { color: { domain: parts.map((p) => p.name), range: parts.map((p) => p.color) } },
      angleField: "value",
      colorField: "name",
      innerRadius: 0.62,
      animate: false,
      interaction: tooltipInteraction(),
      label: false,
      height: 200,
      legend: false,
      tooltip: { title: (d) => d.name, items: [{ field: "value", name: "Productos" }, { field: "percent", name: "Porcentaje" }] },
    }),
    [parts],
  );

  return (
    <div>
      <TooltipBox>
        <div style={{ position: "relative" }}>
          <Pie {...config} />
          <div data-testid="ring-total" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", fontSize: 20, fontWeight: 600 }}>
            {total > 0 ? (centerText ?? totalText) : ""}
          </div>
        </div>
      </TooltipBox>
      <ul data-testid="ring-legend" style={{ listStyle: "none", margin: "4px auto 0", padding: 0, maxWidth: 260, fontSize: 12 }}>
        {parts.map((p) => (
          <li key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, lineHeight: "20px" }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, flex: "none", background: p.color, borderRadius: 2 }} />
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.name}>{p.name}</span>
            <span style={{ flex: "none", fontVariantNumeric: "tabular-nums" }}>{p.percent}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(DonutChart);
