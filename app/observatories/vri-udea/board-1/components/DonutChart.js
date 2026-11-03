"use client";

/* Next */
import dynamic from "next/dynamic";

/* Hooks */
import { memo, useMemo } from "react";

/* Libraries */
const Pie = dynamic(() => import("@ant-design/charts").then((mod) => mod.Pie), { ssr: false });

/**
 * Donut of a distribution (product type, Scimago quartile or access route).
 *
 * @param {string[]} labels - Label of each part.
 * @param {number[]} values - Count of each part (zeros are not drawn).
 * @param {string[]} colors - Colour of each part, from the palettes of lib/constants.js.
 */
function DonutChart({ labels, values, colors }) {
  const config = useMemo(() => {
    const total = values.reduce((a, b) => a + b, 0) || 1;
    return {
      data: labels
        .map((name, i) => ({ name, color: colors[i], value: values[i], percent: `${((values[i] / total) * 100).toFixed(0)} %` }))
        .filter((d) => d.value > 0),
      scale: { color: { domain: labels.filter((_, i) => values[i] > 0), range: colors.filter((_, i) => values[i] > 0) } },
      angleField: "value",
      colorField: "name",
      innerRadius: 0.62,
      animate: false,
      label: false,
      height: 220,
      legend: { color: { position: "bottom", layout: { justifyContent: "center" } } },
      tooltip: { title: (d) => d.name, items: [{ field: "value", name: "Productos" }, { field: "percent", name: "Porcentaje" }] },
    };
  }, [labels, values, colors]);

  return <Pie {...config} />;
}

export default memo(DonutChart);
