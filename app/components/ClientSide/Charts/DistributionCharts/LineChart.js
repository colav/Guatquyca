"use client";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const Line = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Line),
  {
    ssr: false,
  }
);

/* UI Library Components */
import { Empty } from "antd";

/**
 * LineChart is a client-side function component that displays a Line chart.
 *
 * @param {Object[]} data - The data to display in the chart. Each object should have 'year' and 'cited_by_count' properties.
 * @returns {JSX.Element} A Line chart if data is available, otherwise an Empty component.
 */
export default function LineChart({ data }) {
  const config = {
    data,
    xField: "year",
    yField: "cited_by_count",
    interaction: {
      tooltip: {
        render: (event, { title, items }) => (
          <div>
            Año: {title}
            <div>Citaciones: {items[0].value}</div>
          </div>
        ),
      },
    },
    style: {
      lineWidth: 2,
    },
    area: {
      style: {
        fill: "linear-gradient(-90deg, white 0%, #cbe2ffff 100%)",
      },
    },
  };

  return data && data.length ? (
    <Line {...config} />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Datos insuficientes"
      style={{ marginTop: "170px" }}
    />
  );
}
