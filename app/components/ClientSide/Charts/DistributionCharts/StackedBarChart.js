"use client";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const Bar = dynamic(() => import("@ant-design/charts").then((mod) => mod.Bar), {
  ssr: false,
});

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Empty } from "antd";

/* Utils */
import { PALETTE } from "@/lib/constants";

/**
 * ColumnChart is a client-side function component that displays a column chart.
 *
 * @param {Object[]} data - The data to display in the chart. Each object should have 'x' and 'y' properties.
 * @returns {JSX.Element} A Column chart if data is available, otherwise an Empty component.
 */
export default function StackedBarChart({ data }) {
  const config = {
    data,
    stack: true,
    xField: "y",
    yField: "x",
    colorField: "type",
    slider: { x: {} },
    sort: {
      reverse: true,
      by: "y",
    },
    scale: {
      color: {
        palette: PALETTE,
      },
    },
    interaction: {
      tooltip: {
        render: (e, { title, items }) => (
          <div className={styles.font}>
            <p className={styles.title}>{title}</p>
            {items.map((item, index) => (
              <div key={index} className={styles.container}>
                <div>
                  <span
                    style={{ backgroundColor: item.color }}
                    className={styles.bullet}
                  />
                  <span>{item.name}:</span>
                </div>
                <b className={styles.margin10}>{item.value}</b>
              </div>
            ))}
          </div>
        ),
      },
    },
  };

  return data && data.length ? (
    <Bar {...config} />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Datos insuficientes"
      style={{ marginTop: "170px" }}
    />
  );
}
