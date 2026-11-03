"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useCallback, useMemo, useRef } from "react";

/* lib */
import { CATEGORY } from "@/lib/observatories/capacity";
import { BRAND, NEUTRAL, SCATTER_COLORS } from "@/lib/observatories/palette";

/* Libraries */
const Scatter = dynamic(() => import("@ant-design/charts").then((mod) => mod.Scatter), {
  ssr: false,
});

/* Constants */
const FWCI_CAP = 8;
const COLORS = { highlight: SCATTER_COLORS.highlight, consolidating: SCATTER_COLORS.consolidating, other: SCATTER_COLORS.other };
/* Shape per class, so the classes are not told apart by colour alone. */
const SHAPES = { highlight: "point", consolidating: "triangle", other: "point" };

/** Class of a point: highlight = consolidated or leader, consolidating = in consolidation, other = the rest. */
const colorClass = (category) => {
  if (category === CATEGORY.LEADER || category === CATEGORY.CONSOLIDATED) return "highlight";
  if (category === CATEGORY.CONSOLIDATING) return "consolidating";
  return "other";
};

/**
 * Scatter of topics (production vs. citations, log scales, size = FWCI).
 *
 * It is isolated in its own component on purpose (decision of Luis, 3 Nov 2026): with
 * Ant Design Charts it is the most expensive panel (≈ 7 times the SVG at 3,000 points, see the
 * diagnostic report) and may be replaced by a custom canvas without touching the board.
 *
 * @param {Object[]} points - Units with production: { id, label, products, citations, fwci, category, categoryLabel, fwciText }.
 * @param {string|null} selectedId - Id of the pinned unit.
 * @param {Function} onSelect - Called with the id of the clicked point.
 */
function TopicScatter({ points, selectedId, onSelect }) {
  const config = useMemo(
    () => ({
      data: points.map((p) => ({
        id: p.id,
        name: p.label,
        x: p.products,
        y: p.citations + 1,
        size: Math.min(Number.isFinite(p.fwci) ? p.fwci : 0, FWCI_CAP),
        cls: colorClass(p.category),
        products: p.products,
        citations: p.citations,
        fwciText: p.fwciText,
        categoryLabel: p.categoryLabel,
      })),
      xField: "x",
      yField: "y",
      sizeField: "size",
      colorField: "cls",
      shapeField: "cls",
      animate: false,
      legend: false,
      height: 400,
      scale: {
        x: { type: "log", base: 10, nice: true },
        y: { type: "log", base: 10, nice: true },
        size: { type: "sqrt", range: [3, 14] },
        color: { domain: Object.keys(COLORS), range: Object.values(COLORS) },
        shape: { domain: Object.keys(SHAPES), range: Object.values(SHAPES) },
      },
      axis: {
        x: { title: "Número de productos (escala log)" },
        y: { title: "Citas (escala log)" },
      },
      style: {
        fill: (d) => COLORS[d.cls],
        fillOpacity: 0.9,
        stroke: (d) => (d.id === selectedId ? BRAND.selected : NEUTRAL.border),
        lineWidth: (d) => (d.id === selectedId ? 2.5 : 0.8),
      },
      tooltip: {
        title: (d) => d.name,
        items: [
          { field: "products", name: "Productos" },
          { field: "citations", name: "Citas" },
          { field: "fwciText", name: "FWCI" },
          { field: "categoryLabel", name: "Categoría" },
        ],
      },
    }),
    [points, selectedId],
  );

  /* The wrapper's onEvent relay does not deliver G2 clicks (checked on the page), so the click is
     attached to the G2 chart itself; the ref keeps the latest handler without re-attaching. */
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onReady = useCallback((plot) => {
    plot.chart.on("element:click", (event) => {
      const datum = event?.data?.data;
      if (datum) onSelectRef.current(datum.id);
    });
  }, []);

  return <Scatter {...config} onReady={onReady} />;
}

export default memo(TopicScatter);
