"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Components & utils */
import FillHeight from "@/app/observatories/components/FillHeight";
import TooltipBox from "@/app/observatories/components/TooltipBox";
import { barsDescending, segmentsTotal } from "@/lib/observatories/barOrder";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";
import { trendTooltipItem } from "@/lib/observatories/trendTooltip";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), { ssr: false });
const Line = dynamic(() => import("@ant-design/charts").then((mod) => mod.Line), { ssr: false });

/* Utils */
const truncate = (text, size) => (text.length > size ? `${text.slice(0, size - 2)}…` : text);
const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Horizontal bars, simple or stacked. Rows use a unique key as category because labels can repeat;
 * the label is only the axis text.
 *
 * @param {{ label: string, fullLabel?: string, detail?: string, segments: { series: string, value: number }[] }[]} rows
 * @param {Object<string, string>} colors - Series label -> colour (from palette.js).
 * @param {number} [labelSize] - Characters kept in the axis label.
 * @param {boolean} [legend] - Shows the legend of the series.
 * @param {string} [unit] - What the values count, in the tooltip ("productos", "proyectos"); empty = just the figure.
 */
function SegmentedBars({ rows: given, colors, labelSize = 34, legend = false, unit = "", keepOrder = false }) {
  const rows = useMemo(() => barsDescending(given, segmentsTotal, keepOrder), [given, keepOrder]);
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    const series = Object.keys(colors);
    /* Tooltip (F69): the name of each series (type, sector), the unit, the total when a row has several segments, and «Detalle» only when some row has it. */
    const stacked = rows.some((r) => r.segments.filter((s) => s.value > 0).length > 1);
    const hasDetail = rows.some((r) => r.detail);
    return {
      data: rows.flatMap((r, i) => {
        const total = r.segments.reduce((a, s) => a + s.value, 0);
        /* Q-05: the total of the visible segments is written at the end of the bar (on its last segment). */
        const parts = r.segments.filter((s) => s.value > 0).map((s) => ({ key: String(i), name: r.fullLabel || r.label, detail: r.detail || "", series: s.series, value: s.value, total, end: "" }));
        if (parts.length) parts[parts.length - 1].end = fmt(total);
        return parts;
      }),
      labels: [{ text: "end", position: "right", textAlign: "start", dx: 4, fontSize: 11 }],
      paddingRight: 64,
      xField: "key",
      yField: "value",
      colorField: "series",
      stack: true,
      animate: false,
      interaction: tooltipInteraction(),
      height: Math.max(200, rows.length * 24 + 50),
      legend: legend ? { color: { position: "top" } } : false,
      scale: { color: { domain: series, range: series.map((s) => colors[s]) } },
      axis: { x: { labelAutoRotate: false, labelFormatter: (key) => labels[key] ?? key } },
      tooltip: {
        title: (d) => (stacked ? `${d.name} · total ${fmt(d.total)}` : d.name),
        items: [(d) => ({ name: d.series, value: `${fmt(d.value)}${unit ? ` ${unit}` : ""}` }), ...(hasDetail ? [{ field: "detail", name: "Detalle" }] : [])],
      },
    };
  }, [rows, colors, labelSize, legend, unit]);

  return (
    <TooltipBox fill>
      <FillHeight min={config.height} max={Math.round(config.height * 1.8)}>{(h) => <Bar {...config} height={h} />}</FillHeight>
    </TooltipBox>
  );
}

export const SegmentedBarsChart = memo(SegmentedBars);

/**
 * Lines per year. The legend of Ant hides and shows each series with a click.
 *
 * @param {number[]} years
 * @param {{ label: string, values: number[] }[]} series
 * @param {Object<string, string>} colors - Series label -> colour.
 */
function TrendLines({ years, series, colors }) {
  const config = useMemo(
    () => ({
      data: series.flatMap((s) => years.map((y, i) => ({ year: String(y), series: s.label, unit: s.unit || "", value: s.values[i] }))),
      xField: "year",
      yField: "value",
      colorField: "series",
      animate: false,
      interaction: tooltipInteraction(),
      height: 260,
      scale: { color: { domain: series.map((s) => s.label), range: series.map((s) => colors[s.label]) } },
      legend: { color: { position: "top" } },
      /* F85 (N-01): each series says its own name and unit (productos, proyectos, patentes), not «Productos» for all. */
      tooltip: { items: [trendTooltipItem] },
    }),
    [years, series, colors],
  );
  return (
    <TooltipBox fill>
      <FillHeight min={config.height} max={Math.round(config.height * 1.8)}>{(h) => <Line {...config} height={h} />}</FillHeight>
    </TooltipBox>
  );
}

export const TrendLinesChart = memo(TrendLines);
