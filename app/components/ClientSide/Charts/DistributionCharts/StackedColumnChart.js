"use client";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const Column = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Column),
  {
    ssr: false,
  }
);

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Empty } from "antd";

/* Utils */
import { PALETTE } from "@/lib/constants";
import limitItemsPerYear from "@/lib/Utils/limitItemsPerYear";

/**
 * StackedColumnChart is a client-side function component that displays a stacked column chart.
 *
 * @param {Object[]} data - The data to display in the chart. Each object should have 'x', 'y', and 'type' properties.
 * @returns {JSX.Element} A Column chart if data is available, otherwise an Empty component.
 */
export default function StackedColumnChart({ data }) {
  const filteredData = limitItemsPerYear(data);

  const config = {
    data: filteredData,
    stack: true,
    xField: "x",
    yField: "y",
    colorField: "type",
    slider: { x: {}, y: {} },
    scale: {
      color: {
        palette: PALETTE,
      },
    },
    transform: [{ type: "sortX" }],
    axis: { x: { labelSpacing: 4, labelAutoRotate: false } },
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
    <Column {...config} />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Datos insuficientes"
      style={{ marginTop: "170px" }}
    />
  );
}
