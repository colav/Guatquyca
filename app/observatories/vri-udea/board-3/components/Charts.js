"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Components & utils */
import ObservatoryTreemap from "@/app/observatories/components/ObservatoryTreemap";
import TooltipBox from "@/app/observatories/components/TooltipBox";
import { barsDescending, stackedTotal } from "@/lib/observatories/barOrder";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), { ssr: false });
const Line = dynamic(() => import("@ant-design/charts").then((mod) => mod.Line), { ssr: false });
const Scatter = dynamic(() => import("@ant-design/charts").then((mod) => mod.Scatter), { ssr: false });

/* lib */

/* Utils */
const truncate = (text, size) => (text.length > size ? `${text.slice(0, size - 2)}…` : text);
const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Horizontal bars of one series. Rows use a unique key as category because labels can repeat.
 *
 * @param {{ label: string, value: number, text?: string, detail?: string, color?: string }[]} rows - `text` is the label at the end of the bar.
 * @param {string} color - Colour of the bars (from palette.js).
 * @param {string} unit - Name of the value in the tooltip.
 */
function HBars({ rows: given, color, unit, labelSize = 36, keepOrder = false }) {
  const rows = useMemo(() => barsDescending(given, (r) => r.value, keepOrder), [given, keepOrder]);
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    const hasDetail = rows.some((r) => r.detail);
    return {
      data: rows.map((r, i) => ({ key: String(i), name: r.label, value: r.value, text: r.text ?? fmt(r.value), detail: r.detail ?? "", color: r.color ?? color })),
      xField: "key",
      yField: "value",
      animate: false,
      interaction: tooltipInteraction(),
      height: Math.max(180, rows.length * 24 + 50),
      style: { fill: (d) => d.color },
      labels: [{ text: "text", position: "right", textAlign: "start", dx: 4, fontSize: 11 }],
      paddingRight: 150,
      axis: { x: { labelAutoRotate: false, labelFormatter: (key) => labels[key] ?? key }, y: { labelAutoRotate: false } },
      tooltip: { title: (d) => d.name, items: [{ field: "value", name: unit }, ...(hasDetail ? [{ field: "detail", name: "Detalle" }] : [])] },
    };
  }, [rows, color, unit, labelSize]);
  return (
    <TooltipBox>
      <Bar {...config} />
    </TooltipBox>
  );
}
export const HBarsChart = memo(HBars);

/**
 * Horizontal stacked bars. `colors` maps the series label to its colour; the legend shows the series.
 *
 * @param {{ label: string, values: number[] }[]} rows
 * @param {string[]} series - Names of the series, in the order of `values`.
 * @param {Object<string, string>} colors - Series label -> colour.
 */
function StackedBars({ rows: given, series, colors, unit, labelSize = 36, keepOrder = false }) {
  const rows = useMemo(() => barsDescending(given, stackedTotal, keepOrder), [given, keepOrder]);
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    return {
      /* Q-05: the total of the visible segments is written at the end of the bar (on its last segment). */
      data: rows.flatMap((r, i) => {
        const total = r.values.reduce((a, v) => a + v, 0);
        const parts = r.values.map((v, j) => ({ key: String(i), name: r.label, series: series[j], value: v, total, end: "" })).filter((d) => d.value > 0);
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
      height: Math.max(180, rows.length * 24 + 70),
      legend: { color: { position: "top" } },
      scale: { color: { domain: series, range: series.map((s) => colors[s]) } },
      axis: { x: { labelAutoRotate: false, labelFormatter: (key) => labels[key] ?? key }, y: { labelAutoRotate: false } },
      /* Tooltip (F69): the name of each series, the unit and the total of the row. */
      tooltip: { title: (d) => `${d.name} · total ${fmt(d.total)}`, items: [(d) => ({ name: d.series, value: `${fmt(d.value)} ${String(unit).toLowerCase()}` })] },
    };
  }, [rows, series, colors, unit, labelSize]);
  return (
    <TooltipBox>
      <Bar {...config} />
    </TooltipBox>
  );
}
export const StackedBarsChart = memo(StackedBars);

/**
 * Lines per year. The legend of Ant hides and shows each series with a click.
 *
 * @param {number[]} years
 * @param {{ label: string, values: number[] }[]} series
 * @param {Object<string, string>} colors - Series label -> colour.
 */
function Lines({ years, series, colors, unit, height = 260, legend = true }) {
  const config = useMemo(
    () => ({
      data: series.flatMap((s) => years.map((y, i) => ({ year: String(y), series: s.label, value: s.values[i] }))),
      xField: "year",
      yField: "value",
      colorField: "series",
      animate: false,
      interaction: tooltipInteraction(),
      height,
      scale: { color: { domain: series.map((s) => s.label), range: series.map((s) => colors[s.label]) } },
      legend: legend ? { color: { position: "top" } } : false,
      tooltip: { items: [{ channel: "y", name: unit }] },
    }),
    [years, series, colors, unit, height, legend],
  );
  return (
    <TooltipBox>
      <Line {...config} />
    </TooltipBox>
  );
}
export const LinesChart = memo(Lines);

/**
 * Treemap of the OECD areas (the artifact draws the areas with a value only).
 *
 * @param {{ name: string, value: number }[]} items
 * @param {string[]} areas - The complete list of areas: the position of each one picks its colour in PALETTE (F77).
 */
function AreasTreemap({ items, areas }) {
  const shown = useMemo(() => items.map((i) => ({ key: i.name, name: i.name, value: i.value, slot: areas.indexOf(i.name) })), [items, areas]);
  return <ObservatoryTreemap items={shown} unitName="Investigadores" height={280} labelWithValue ariaLabel="Treemap de áreas OCDE" testId="areas-treemap" />;
}
export const AreasTreemapChart = memo(AreasTreemap);

/**
 * Grid of bubbles (area x category), size proportional to the number of groups.
 *
 * @param {{ area: string, category: string, value: number }[]} cells
 */
function BubbleGrid({ cells, areas, categories, colors }) {
  const config = useMemo(
    () => ({
      data: cells.map((c) => ({ ...c, text: String(c.value) })),
      xField: "area",
      yField: "category",
      sizeField: "value",
      colorField: "area",
      animate: false,
      interaction: tooltipInteraction(),
      height: 340,
      legend: false,
      scale: {
        x: { domain: areas },
        y: { domain: categories },
        size: { type: "sqrt", range: [8, 30] },
        color: { domain: areas, range: areas.map((a) => colors[a]) },
      },
      /* Q-03 (D-202): the six names are always there and complete (they go to another line if they do not fit), and the number sits in the middle of its bubble. */
      axis: { x: { labelAutoRotate: false, labelAutoHide: false, labelAutoEllipsis: false, labelAutoWrap: true } },
      style: { fill: (d) => colors[d.area], fillOpacity: 0.85, stroke: (d) => colors[d.area] },
      labels: [{ text: "text", fontSize: 11, position: "inside", textAlign: "center", textBaseline: "middle" }],
      tooltip: { title: (d) => `${d.area} · ${d.category}`, items: [{ field: "value", name: "Grupos" }] },
    }),
    [cells, areas, categories, colors],
  );
  return (
    <TooltipBox>
      <Scatter {...config} />
    </TooltipBox>
  );
}
export const BubbleGridChart = memo(BubbleGrid);

/**
 * Scatter of the arts panel: products per professor (x) and number of professors (y), by contract.
 *
 * @param {{ group: string, products: number, professors: number }[]} points
 */
function ArtsScatter({ points, groups, colors }) {
  const config = useMemo(
    () => ({
      data: points.map((p) => ({ ...p, productsLabel: p.products === 20 ? "20 o más" : String(p.products) })),
      xField: "products",
      yField: "professors",
      sizeField: "professors",
      colorField: "group",
      animate: false,
      interaction: tooltipInteraction(),
      height: 300,
      /* Q-08 (D-202): room above the biggest value and at the left of the first one for the radius of the biggest bubble (18 px), so none climbs into the legend or the axis, with any filter. */
      scale: {
        size: { type: "sqrt", range: [6, 18] },
        color: { domain: groups, range: groups.map((g) => colors[g]) },
        x: { domainMin: 0, domainMax: Math.max(2, ...points.map((p) => p.products)) + 1 },
        y: { domainMin: 0, domainMax: Math.ceil(Math.max(1, ...points.map((p) => p.professors)) * 1.4) },
      },
      axis: { x: { title: "productos artísticos por profesor (obras + registros en la base)" }, y: { title: "profesores" } },
      legend: { color: { position: "top" } },
      style: { fill: (d) => colors[d.group], fillOpacity: 0.8, stroke: (d) => colors[d.group] },
      tooltip: { title: (d) => `${d.group} · ${d.productsLabel} productos`, items: [{ field: "professors", name: "Profesores" }] },
    }),
    [points, groups, colors],
  );
  return (
    <TooltipBox>
      <Scatter {...config} />
    </TooltipBox>
  );
}
export const ArtsScatterChart = memo(ArtsScatter);
