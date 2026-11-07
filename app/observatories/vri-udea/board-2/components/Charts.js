"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Components & utils */
import TooltipBox from "@/app/observatories/components/TooltipBox";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), { ssr: false });
const Line = dynamic(() => import("@ant-design/charts").then((mod) => mod.Line), { ssr: false });
const Scatter = dynamic(() => import("@ant-design/charts").then((mod) => mod.Scatter), { ssr: false });

/* lib */
import { NORTH_SOUTH_COLORS } from "@/lib/observatories/palette";

/* Texts */
import { SIDE_LABELS } from "./boardTexts";

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
function SegmentedBars({ rows, colors, labelSize = 34, legend = false, unit = "" }) {
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    const series = Object.keys(colors);
    /* Tooltip (F69): the name of each series (type, sector), the unit, the total when a row has several segments, and «Detalle» only when some row has it. */
    const stacked = rows.some((r) => r.segments.filter((s) => s.value > 0).length > 1);
    const hasDetail = rows.some((r) => r.detail);
    return {
      data: rows.flatMap((r, i) => {
        const total = r.segments.reduce((a, s) => a + s.value, 0);
        return r.segments.filter((s) => s.value > 0).map((s) => ({ key: String(i), name: r.fullLabel || r.label, detail: r.detail || "", series: s.series, value: s.value, total }));
      }),
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
    <TooltipBox>
      <Bar {...config} />
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
      data: series.flatMap((s) => years.map((y, i) => ({ year: String(y), series: s.label, value: s.values[i] }))),
      xField: "year",
      yField: "value",
      colorField: "series",
      animate: false,
      interaction: tooltipInteraction(),
      height: 260,
      scale: { color: { domain: series.map((s) => s.label), range: series.map((s) => colors[s.label]) } },
      legend: { color: { position: "top" } },
      tooltip: { items: [{ channel: "y", name: "Productos" }] },
    }),
    [years, series, colors],
  );
  return (
    <TooltipBox>
      <Line {...config} />
    </TooltipBox>
  );
}

export const TrendLinesChart = memo(TrendLines);

/**
 * Bubbles on the centroids of the countries (schematic map without outlines, as the artifact).
 *
 * @param {{ name: string, region: string, lat: number, lon: number, value: number, north: boolean, label: string }[]} points
 */
function WorldBubbles({ points }) {
  const config = useMemo(
    () => ({
      data: points.map((p) => ({ name: p.name, region: p.region, x: p.lon, y: p.lat, value: p.value, side: p.north ? SIDE_LABELS.north : SIDE_LABELS.south, label: p.label })),
      xField: "x",
      yField: "y",
      sizeField: "value",
      colorField: "side",
      animate: false,
      interaction: tooltipInteraction(),
      height: 400,
      scale: {
        x: { domain: [-170, 180] },
        y: { domain: [-58, 80] },
        size: { type: "sqrt", range: [2, 26] },
        color: { domain: [SIDE_LABELS.north, SIDE_LABELS.south], range: [NORTH_SOUTH_COLORS.north, NORTH_SOUTH_COLORS.south] },
      },
      axis: false,
      legend: { color: { position: "top" } },
      style: {
        fill: (d) => (d.side === SIDE_LABELS.north ? NORTH_SOUTH_COLORS.north : NORTH_SOUTH_COLORS.south),
        fillOpacity: 0.65,
        stroke: (d) => (d.side === SIDE_LABELS.north ? NORTH_SOUTH_COLORS.north : NORTH_SOUTH_COLORS.south),
      },
      labels: [{ text: "label", fontSize: 10, transform: [{ type: "overlapDodgeY" }] }],
      tooltip: { title: (d) => d.name, items: [{ field: "region", name: "Región" }, { field: "value", name: "Productos" }] },
    }),
    [points],
  );
  return (
    <TooltipBox>
      <Scatter {...config} />
    </TooltipBox>
  );
}

export const WorldBubblesChart = memo(WorldBubbles);
