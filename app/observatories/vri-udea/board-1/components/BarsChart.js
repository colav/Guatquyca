"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), { ssr: false });
const Column = dynamic(() => import("@ant-design/charts").then((mod) => mod.Column), { ssr: false });

/* Utils */
const truncate = (text, size) => (text.length > size ? `${text.slice(0, size - 2)}…` : text);

/**
 * Horizontal ranking (top N). Categories use a unique key because labels can repeat
 * (e.g. the same Eje Temático name in two agendas); the label is only the axis text.
 *
 * @param {{ id: *, label: string, fullLabel?: string, detail?: string, value: number }[]} rows
 * @param {number} [labelSize] - Characters kept in the axis label.
 */
function RankingBars({ rows, labelSize = 34 }) {
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), truncate(r.label, labelSize)]));
    return {
      data: rows.map((r, i) => ({ key: String(i), name: r.fullLabel || r.label, detail: r.detail || "", value: r.value })),
      xField: "key",
      yField: "value",
      animate: false,
      height: Math.max(220, rows.length * 24 + 40),
      axis: { x: { labelAutoRotate: false, labelFormatter: (key) => labels[key] ?? key } },
      style: { fill: "#1f7a3f" },
      tooltip: {
        title: (d) => d.name,
        items: [{ field: "value", name: "Valor" }, { field: "detail", name: "Detalle" }],
      },
    };
  }, [rows, labelSize]);

  return <Bar {...config} />;
}

export const RankingBarsChart = memo(RankingBars);

/**
 * Columns of the capacity calculator: one bar per category with its colour.
 *
 * @param {{ category: string, label: string, value: number, color: string }[]} items
 */
function CalculatorColumns({ items }) {
  const config = useMemo(
    () => ({
      data: items.map((i) => ({ label: i.label, value: i.value })),
      xField: "label",
      yField: "value",
      colorField: "label",
      animate: false,
      legend: false,
      height: 220,
      scale: { color: { domain: items.map((i) => i.label), range: items.map((i) => i.color) } },
      axis: { x: { labelAutoRotate: true } },
      label: { text: "value", position: "top" },
      tooltip: { items: [{ field: "value", name: "Unidades" }] },
    }),
    [items],
  );
  return <Column {...config} />;
}

export const CalculatorColumnsChart = memo(CalculatorColumns);
