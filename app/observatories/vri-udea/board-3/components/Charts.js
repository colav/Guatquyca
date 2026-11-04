"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), { ssr: false });
const Line = dynamic(() => import("@ant-design/charts").then((mod) => mod.Line), { ssr: false });
const Scatter = dynamic(() => import("@ant-design/charts").then((mod) => mod.Scatter), { ssr: false });
const Treemap = dynamic(() => import("@ant-design/charts").then((mod) => mod.Treemap), { ssr: false });

/* lib */
import { BRAND } from "@/lib/observatories/palette";

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
function HBars({ rows, color, unit, labelSize = 36 }) {
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    return {
      data: rows.map((r, i) => ({ key: String(i), name: r.label, value: r.value, text: r.text ?? fmt(r.value), detail: r.detail ?? "", color: r.color ?? color })),
      xField: "key",
      yField: "value",
      animate: false,
      height: Math.max(180, rows.length * 24 + 50),
      style: { fill: (d) => d.color },
      labels: [{ text: "text", position: "right", textAlign: "start", dx: 4, fontSize: 11 }],
      paddingRight: 150,
      axis: { x: { labelAutoRotate: false, labelFormatter: (key) => labels[key] ?? key }, y: { labelAutoRotate: false } },
      tooltip: { title: (d) => d.name, items: [{ field: "value", name: unit }, { field: "detail", name: "Detalle" }] },
    };
  }, [rows, color, unit, labelSize]);
  return <Bar {...config} />;
}
export const HBarsChart = memo(HBars);

/**
 * Horizontal stacked bars. `colors` maps the series label to its colour; the legend shows the series.
 *
 * @param {{ label: string, values: number[] }[]} rows
 * @param {string[]} series - Names of the series, in the order of `values`.
 * @param {Object<string, string>} colors - Series label -> colour.
 */
function StackedBars({ rows, series, colors, unit, labelSize = 36 }) {
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    return {
      data: rows.flatMap((r, i) => r.values.map((v, j) => ({ key: String(i), name: r.label, series: series[j], value: v })).filter((d) => d.value > 0)),
      xField: "key",
      yField: "value",
      colorField: "series",
      stack: true,
      animate: false,
      height: Math.max(180, rows.length * 24 + 70),
      legend: { color: { position: "top" } },
      scale: { color: { domain: series, range: series.map((s) => colors[s]) } },
      axis: { x: { labelAutoRotate: false, labelFormatter: (key) => labels[key] ?? key }, y: { labelAutoRotate: false } },
      tooltip: { title: (d) => d.name, items: [{ field: "value", name: unit }] },
    };
  }, [rows, series, colors, unit, labelSize]);
  return <Bar {...config} />;
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
      height,
      scale: { color: { domain: series.map((s) => s.label), range: series.map((s) => colors[s.label]) } },
      legend: legend ? { color: { position: "top" } } : false,
      tooltip: { items: [{ channel: "y", name: unit }] },
    }),
    [years, series, colors, unit, height, legend],
  );
  return <Line {...config} />;
}
export const LinesChart = memo(Lines);

/**
 * Treemap of the OECD areas (the artifact draws the areas with a value only).
 *
 * @param {{ name: string, value: number }[]} items
 * @param {Object<string, string>} colors - Area -> colour.
 */
function AreasTreemap({ items, colors }) {
  const config = useMemo(() => {
    const shown = items.filter((i) => i.value > 0);
    const total = shown.reduce((a, i) => a + i.value, 0) || 1;
    return {
      data: { name: "root", children: shown.map((i) => ({ name: i.name, value: i.value, percent: `${((i.value / total) * 100).toFixed(1).replace(".", ",")} %` })) },
      valueField: "value",
      colorField: "name",
      animate: false,
      height: 280,
      legend: false,
      scale: { color: { domain: shown.map((i) => i.name), range: shown.map((i) => colors[i.name]) } },
      layout: { padding: 2 },
      style: { fill: (d) => colors[d.data?.name ?? d.name], labelText: (d) => `${d.data?.name ?? d.name} · ${fmt(d.data?.value ?? d.value)}`, labelFill: BRAND.white, labelFontSize: 12 },
      tooltip: { title: (d) => d.data?.name ?? d.name, items: [{ field: "value", name: "Investigadores" }, { field: "percent", name: "Porcentaje" }] },
    };
  }, [items, colors]);
  return <Treemap {...config} />;
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
      height: 340,
      legend: false,
      scale: {
        x: { domain: areas },
        y: { domain: categories },
        size: { type: "sqrt", range: [8, 30] },
        color: { domain: areas, range: areas.map((a) => colors[a]) },
      },
      axis: { x: { labelAutoRotate: false, labelFormatter: (a) => truncate(a, 16) } },
      style: { fill: (d) => colors[d.area], fillOpacity: 0.85, stroke: (d) => colors[d.area] },
      labels: [{ text: "text", fontSize: 11 }],
      tooltip: { title: (d) => `${d.area} · ${d.category}`, items: [{ field: "value", name: "Grupos" }] },
    }),
    [cells, areas, categories, colors],
  );
  return <Scatter {...config} />;
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
      height: 300,
      scale: { size: { type: "sqrt", range: [6, 22] }, color: { domain: groups, range: groups.map((g) => colors[g]) } },
      axis: { x: { title: "productos artísticos por profesor (obras + registros en la base)" }, y: { title: "profesores" } },
      legend: { color: { position: "top" } },
      style: { fill: (d) => colors[d.group], fillOpacity: 0.8, stroke: (d) => colors[d.group] },
      tooltip: { title: (d) => `${d.group} · ${d.productsLabel} productos`, items: [{ field: "professors", name: "Profesores" }] },
    }),
    [points, groups, colors],
  );
  return <Scatter {...config} />;
}
export const ArtsScatterChart = memo(ArtsScatter);
