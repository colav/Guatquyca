"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useEffect, useMemo, useRef, useState } from "react";

/* Components & utils */
import FillHeight from "@/app/observatories/components/FillHeight";
import TooltipBox from "@/app/observatories/components/TooltipBox";
import { ringParts } from "@/lib/observatories/ringText";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";

/* Libraries */
const Pie = dynamic(() => import("@ant-design/charts").then((mod) => mod.Pie), { ssr: false });

/**
 * Donut of a distribution (product type, Scimago quartile or access route) with the total of the parts drawn at the centre of
 * the ring and an own legend, one column: colour, name and percentage on the right (F77, D-182). Q-26: the legend goes at the RIGHT
 * of the ring when the container is at least `WIDE` px wide (or when `legend` is "right"), and underneath when it is narrower or
 * `legend` is "below". The centre and the legend are HTML over / beside the chart; the ring is the one of Ant Design.
 *
 * @param {string[]} labels - Label of each part.
 * @param {number[]} values - Count of each part (zeros are not drawn nor listed).
 * @param {string[]} colors - Colour of each part, from the palettes of lib/constants.js.
 * @param {string} [centerText] - Text at the centre instead of the total (Q-10: the open-access share).
 * @param {"auto"|"right"|"below"} [legend] - Where the legend goes (auto: at the right from `WIDE` px of container).
 */
const WIDE = 420;
const LEGEND_WIDTH = 200;
/* Q-32 (F94): the body of the card already has 10 px of padding; with these 4 px (and the 1 px border) the legend is 15 px from the right edge of the panel. */
const EDGE_GAP = 4;

function DonutChart({ labels, values, colors, centerText = null, legend = "auto" }) {
  const rootRef = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => setWidth(Math.round(node.clientWidth)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const right = legend === "right" || (legend === "auto" && width >= WIDE);
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

  /* Q-04: the ring takes the height that the panel has left (200 to 320 px); the legend stays under it. */
  return (
    <div ref={rootRef} data-testid="ring-root" data-legend={right ? "right" : "below"} style={{ flex: "1 1 auto", display: "flex", flexDirection: right ? "row" : "column", alignItems: right ? "center" : "stretch", gap: right ? 12 : 0 }}>
      <div style={{ flex: "1 1 0", minWidth: 0, alignSelf: "stretch", display: "flex", flexDirection: "column" }}>
      <TooltipBox fill>
        <FillHeight min={200} max={480}>
          {(h) => (
            <div style={{ position: "relative", height: h }}>
              <Pie {...config} height={h} />
              <div data-testid="ring-total" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", fontSize: 20, fontWeight: 600 }}>
                {total > 0 ? (centerText ?? totalText) : ""}
              </div>
            </div>
          )}
        </FillHeight>
      </TooltipBox>
      </div>
      <ul data-testid="ring-legend" style={right ? { listStyle: "none", margin: 0, padding: 0, flex: `0 0 ${LEGEND_WIDTH}px`, width: LEGEND_WIDTH, marginRight: EDGE_GAP, fontSize: 12 } : { listStyle: "none", margin: "4px auto 0", padding: 0, maxWidth: 260, width: "100%", fontSize: 12 }}>
        {parts.map((p) => (
          <li key={p.name} style={{ display: "flex", alignItems: right ? "flex-start" : "center", gap: 8, lineHeight: "20px", marginBottom: right ? 4 : 0 }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, flex: "none", background: p.color, borderRadius: 2, marginTop: right ? 5 : 0 }} />
            <span style={right ? { flex: 1, minWidth: 0, overflowWrap: "anywhere" } : { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.name}>{p.name}</span>
            <span style={{ flex: "none", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{p.percent}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(DonutChart);
