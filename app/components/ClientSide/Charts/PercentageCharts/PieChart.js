"use client";

/* Components */
import Error from "@/app/error";

/* Constants */
import { OPEN_ACCESS_PALETTE } from "@/lib/constants";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const Pie = dynamic(() => import("@ant-design/charts").then((mod) => mod.Pie), {
  ssr: false,
});

/**
 * PieChart is a client-side function component that displays a pie chart.
 *
 * @param {Object[]} data - The data to display in the pie chart. Each object should have a 'value' and a 'name' property.
 * @param {number} sum - The total value of all data points. This is displayed in the center of the pie chart.
 * @returns {JSX.Element} A Pie chart component.
 */
export default function PieChart({ data, sum, isOA = false }) {
  if (!data || !data.length) return <Error height={400} />;

  const config = {
    data,
    angleField: "value",
    colorField: "name",
    radius: 0.85,
    innerRadius: 0.45,
    label: {
      text: (d) => `${d.value.toLocaleString("es-CO")} / ${d.percentage}%`,
      position: "outside",
      transform: [
        {
          type: "overlapDodgeY",
        },
      ],
    },
    legend: {
      color: {
        position: "bottom",
        itemMarkerFill: (item) => {
          return isOA
            ? (item.color = OPEN_ACCESS_PALETTE[item.label])
            : undefined;
        },
      },
    },
    style: {
      stroke: "#fff",
      inset: 1,
      radius: 10,
      fill: isOA ? ({ name }) => OPEN_ACCESS_PALETTE[name] : undefined,
    },
    scale: {
      color: {
        palette: "spectral",
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: sum ? `Total:\n${sum.toString()}` : null,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 24,
          fontStyle: "bold",
          fill: "#3e535e",
        },
        tooltip: false,
      },
    ],
    tooltip: false,
  };

  return <Pie {...config} />;
}
