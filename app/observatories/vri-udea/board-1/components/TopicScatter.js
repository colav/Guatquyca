"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useCallback, useMemo, useRef } from "react";

/* Components */
import { useTooltipInside } from "@/app/observatories/components/useTooltipInside";

/* lib */
import { CATEGORY_MARKS, BRAND, darken } from "@/lib/observatories/palette";
import { pointRadius } from "@/lib/observatories/scatterSize";
import { WIDE_TOOLTIP, tooltipInteraction } from "@/lib/observatories/tooltipStyle";
import { star, xmark } from "@/lib/observatories/shapes";

/* Libraries */
const Scatter = dynamic(
  () =>
    import("@ant-design/charts").then((mod) => {
      /* G2 has no star. The point shape "bowtie" (filled, not used anywhere else in the app) takes its
         outline from the symbol of the same name: registering the star under that name makes
         that shape a star, with no new dependency. */
      mod.register("symbol.bowtie", star);
      /* Same for the X of punctual presence (F46): the shape "cross" is only used here and draws an X. */
      mod.register("symbol.cross", xmark);
      return mod.Scatter;
    }),
  { ssr: false },
);

/* Constants: colour and shape of every category come from the shared map (palette.js). */
const CATEGORIES = Object.keys(CATEGORY_MARKS);
const COLORS = Object.values(CATEGORY_MARKS).map((m) => m.color);
const G2_SHAPE = { star: "bowtie", x: "cross" };
const SHAPES = Object.values(CATEGORY_MARKS).map((m) => G2_SHAPE[m.shape] || m.shape);

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
 * @param {string} [dimension] - "topic", "subfield" or "field": decides which hierarchy lines the tooltip has.
 * @param {string} [referent] - "Colombia" or "Mundo": name of the reference of the capacity ratio in the tooltip.
 */
function TopicScatter({ points, selectedId, onSelect, dimension = "topic", referent = "Colombia", height = 400, fwciName = "FWCI" }) {
  const config = useMemo(
    () => ({
      /* The most capable categories are drawn last, so a leader is never hidden behind grey points. */
      data: [...points].sort((a, b) => CATEGORIES.indexOf(b.category) - CATEGORIES.indexOf(a.category)).map((p) => ({
        id: p.id,
        name: p.label,
        x: p.products,
        y: p.citations + 1,
        /* Radius in px already (identity scale): the one of the FWCI, 70 % smaller for punctual presence (F46b). */
        size: pointRadius(Number.isFinite(p.fwci) ? p.fwci : 0, p.category === "punctual"),
        cls: p.category,
        products: p.products,
        citations: p.citations,
        fwciLine: p.fwciLine,
        trendLine: p.trendLine,
        yearsLine: p.yearsLine,
        ratioText: p.ratioText,
        productsLine: p.productsLine,
        citationsLine: p.citationsLine,
        subfield: p.subfield,
        field: p.field,
        categoryLabel: p.categoryLabel,
      })),
      xField: "x",
      yField: "y",
      sizeField: "size",
      colorField: "cls",
      shapeField: "cls",
      animate: false,
      legend: false,
      interaction: tooltipInteraction(WIDE_TOOLTIP),
      height,
      scale: {
        x: { type: "log", base: 10, nice: true },
        y: { type: "log", base: 10, nice: true },
        size: { type: "identity" },
        color: { domain: CATEGORIES, range: COLORS },
        shape: { domain: CATEGORIES, range: SHAPES },
      },
      axis: {
        x: { title: "Número de productos (escala log)" },
        y: { title: "Citas (escala log)" },
      },
      style: {
        fill: (d) => CATEGORY_MARKS[d.cls].color,
        fillOpacity: 0.9,
        stroke: (d) => (d.id === selectedId ? BRAND.selected : darken(CATEGORY_MARKS[d.cls].color)),
        lineWidth: (d) => (d.id === selectedId ? 2.5 : 1),
      },
      /* One labelled line per datum (F34/F35): hierarchy by dimension, products and citations, FWCI,
         trend, products per year of the window, capacity ratio and category. */
      tooltip: {
        title: false,
        items: [
          ...(dimension === "topic"
            ? [{ field: "name", name: "Tópico" }, { field: "subfield", name: "Subcampo" }, { field: "field", name: "Campo" }]
            : dimension === "subfield"
              ? [{ field: "name", name: "Subcampo" }, { field: "field", name: "Campo" }]
              : [{ field: "name", name: "Campo" }]),
          { field: "productsLine", name: "Productos" },
          { field: "citationsLine", name: "Citas" },
          { field: "fwciLine", name: fwciName },
          { field: "trendLine", name: "Tendencia" },
          { field: "yearsLine", name: "Productos por año (2010–2025)" },
          { field: "ratioText", name: `Razón de capacidad (${referent})` },
          { field: "categoryLabel", name: "Categoría" },
        ],
      },
    }),
    [points, selectedId, dimension, referent, height, fwciName],
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

  const wrapper = useTooltipInside();
  return (
    <div ref={wrapper}>
      <Scatter {...config} onReady={onReady} />
    </div>
  );
}

export default memo(TopicScatter);
