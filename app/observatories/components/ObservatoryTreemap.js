"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useCallback, useMemo, useRef } from "react";

/* Libraries */
const Treemap = dynamic(() => import("@ant-design/charts").then((mod) => mod.Treemap), { ssr: false });

/* Components & lib */
import TooltipBox from "@/app/observatories/components/TooltipBox";
import { BRAND, paletteColor, textOn } from "@/lib/observatories/palette";
import { tooltipInteraction } from "@/lib/observatories/tooltipStyle";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * The treemap of the observatories (F77): the ODS of Board 1 and the OECD areas of Board 3 are the same chart. The area is the
 * value; the colour of each item is `PALETTE[slot]` (lib/constants.js) and nothing else: `slot` is the stable position of the item
 * in the complete list, so the ODS 7 is always the same colour even when a filter hides others. The text takes the colour that
 * reads on its fill (4,5:1 at least).
 *
 * @param {{ key: string|number, name: string, value: number, slot: number }[]} items - Items with a value (the others are not drawn).
 * @param {string} unitName - What the value counts, in the tooltip ("Productos", "Investigadores").
 * @param {number} [height]
 * @param {number} [labelFontSize]
 * @param {boolean} [labelWithValue] - The label shows «name · value».
 * @param {*} [activeKey] - `key` of the item chosen: the others are drawn paler.
 * @param {Function} [onSelect] - Called with the `key` of the item clicked.
 * @param {string} [ariaLabel]
 * @param {string} [testId]
 */
function ObservatoryTreemap({ items, unitName, height = 280, labelFontSize = 12, labelWithValue = false, activeKey = null, onSelect = null, ariaLabel, testId }) {
  const config = useMemo(() => {
    const shown = items.filter((i) => i.value > 0);
    const total = shown.reduce((a, i) => a + i.value, 0) || 1;
    const pick = (d) => d.data ?? d;
    const fills = Object.fromEntries(shown.map((i) => [i.name, paletteColor(i.slot)]));
    return {
      data: { name: "root", children: shown.map((i) => ({ name: i.name, value: i.value, key: i.key, percent: `${((i.value / total) * 100).toFixed(1).replace(".", ",")} %` })) },
      valueField: "value",
      colorField: "name",
      animate: false,
      interaction: tooltipInteraction(),
      height,
      legend: false,
      scale: { color: { domain: shown.map((i) => i.name), range: shown.map((i) => fills[i.name]) } },
      layout: { padding: 2 },
      style: {
        /* the fill is set per item: the scale of colour alone gave one colour to the whole treemap */
        fill: (d) => fills[pick(d).name] ?? BRAND.white,
        fillOpacity: (d) => (activeKey != null && pick(d).key !== activeKey ? 0.35 : 1),
        labelText: (d) => (labelWithValue ? `${pick(d).name} · ${fmt(pick(d).value)}` : `${pick(d).name}`),
        labelFill: (d) => textOn(fills[pick(d).name] ?? BRAND.white),
        labelFontSize,
      },
      tooltip: {
        title: (d) => pick(d).name,
        items: [(d) => ({ name: unitName, value: fmt(pick(d).value) }), (d) => ({ name: "Porcentaje", value: pick(d).percent })],
      },
    };
  }, [items, unitName, height, labelFontSize, labelWithValue, activeKey]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onReady = useCallback((plot) => {
    plot.chart.on("element:click", (event) => {
      const d = event?.data?.data;
      const key = d?.key ?? d?.data?.key;
      if (key != null && onSelectRef.current) onSelectRef.current(key);
    });
  }, []);
  const summary = items.filter((i) => i.value > 0).map((i) => `${i.name}: ${fmt(i.value)}`).join("; ");
  return (
    <TooltipBox>
      <div role="img" aria-label={`${ariaLabel}. ${summary}`} data-testid={testId} style={onSelect ? { cursor: "pointer" } : undefined}>
        <Treemap {...config} onReady={onReady} />
      </div>
    </TooltipBox>
  );
}

export default memo(ObservatoryTreemap);
