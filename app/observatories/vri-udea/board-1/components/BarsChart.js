"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useCallback, useMemo, useRef } from "react";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), { ssr: false });

/* lib */
import { calculatorBarsConfig } from "@/lib/observatories/capacity";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";
import { useTooltipInside } from "@/app/observatories/components/useTooltipInside";
import { RANKING_COLOR } from "@/lib/observatories/palette";

/* Utils */
const truncate = (text, size) => (text.length > size ? `${text.slice(0, size - 2)}…` : text);

/**
 * Horizontal ranking (top N). Categories use a unique key because labels can repeat
 * (e.g. the same Eje Temático name in two agendas); the label is only the axis text.
 *
 * @param {{ id: *, label: string, fullLabel?: string, detail?: string, value: number }[]} rows
 * @param {number} [labelSize] - Characters kept in the axis label.
 * @param {boolean} [complete] - Complete labels (no cut, no hiding) with room at the left for the
 *   longest one, as in the calculator.
 */
function RankingBars({ rows, labelSize = 34, complete = false }) {
  const config = useMemo(() => {
    const labels = Object.fromEntries(rows.map((r, i) => [String(i), complete ? r.label : truncate(r.label, labelSize)]));
    const longest = Math.max(0, ...rows.map((r) => r.label.length));
    return {
      ...(complete ? { paddingLeft: Math.min(320, Math.round(longest * 7 + 16)), paddingRight: 24 } : {}),
      data: rows.map((r, i) => ({ key: String(i), name: r.fullLabel || r.label, detail: r.detail || "", value: r.value })),
      xField: "key",
      yField: "value",
      animate: false,
      interaction: tooltipInteraction(),
      height: Math.max(220, rows.length * 24 + 40),
      axis: {
        x: { labelAutoRotate: false, ...(complete ? { labelAutoEllipsis: false, labelAutoHide: false } : {}), labelFormatter: (key) => labels[key] ?? key },
        y: { labelAutoRotate: false },
      },
      style: { fill: RANKING_COLOR },
      tooltip: {
        title: (d) => d.name,
        items: [{ field: "value", name: "Valor" }, { field: "detail", name: "Detalle" }],
      },
    };
  }, [rows, labelSize, complete]);

  return <Bar {...config} />;
}

export const RankingBarsChart = memo(RankingBars);

/**
 * Horizontal bars of the capacity calculator: one bar per category, from top to bottom in the
 * order given, all starting at zero. The label of each category is complete (no rotation, no
 * truncation) at the left and the figure is always visible at the end of the bar, also for zero
 * and for the very short bars (the figure then sits outside the bar). The scale is linear and
 * starts at zero; it leaves room on the right for the longest figure.
 *
 * @param {{ category: string, label: string, value: number, color: string, pctText: string, rule: string }[]} items
 * @param {string} noun - What is counted ("tópicos", "subcampos" or "campos").
 */
function CalculatorBars({ items, noun, active = [], onSelect }) {
  const config = useMemo(() => calculatorBarsConfig(items, noun, active), [items, noun, active]);
  /* A click on a bar does the same as a click on the legend (F39); the ref keeps the latest handler. */
  const wrapper = useTooltipInside();
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const byLabel = useMemo(() => Object.fromEntries(items.map((i) => [i.label, i.category])), [items]);
  const onReady = useCallback(
    (plot) => {
      plot.chart.on("element:click", (event) => {
        const category = byLabel[event?.data?.data?.label];
        const native = event?.nativeEvent || event?.originalEvent || event;
        if (category && onSelectRef.current) onSelectRef.current(category, !!(native.ctrlKey || native.shiftKey || native.metaKey));
      });
    },
    [byLabel],
  );
  /* The chart is a canvas: the wrapper says the same in text for assistive technology and for the tests. */
  const summary = items.map((i) => `${i.label}: ${i.value.toLocaleString("es-CO")}`).join("; ");
  return (
    <div ref={wrapper} role="img" aria-label={`${noun} por categoría. ${summary}`} data-testid="calculator-bars" style={onSelect ? { cursor: "pointer" } : undefined}>
      <Bar {...config} onReady={onReady} />
    </div>
  );
}

export const CalculatorBarsChart = memo(CalculatorBars);
