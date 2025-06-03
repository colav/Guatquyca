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

/**
 * ColumnChart is a client-side function component that displays a column chart.
 *
 * @param {Object[]} data - The data to display in the chart. Each object should have 'x' and 'y' properties.
 * @returns {JSX.Element} A Column chart if data is available, otherwise an Empty component.
 */
export default function BarChart({ data, chart }) {
  const config = {
    data,
    xField: "type",
    yField: "value",
    slider: { x: { labelFormatter: () => "" } },
    style: {
      fill: "#86d5e5",
    },
    sort: {
      reverse: true,
      by: "y",
    },
    interaction: {
      tooltip: {
        render: (event, { title, items }) =>
          items.map((item, index) => (
            <div key={index} className={styles.font}>
              <p className={styles.title}>
                <span
                  style={{ backgroundColor: item.color }}
                  className={styles.bullet}
                />
                {title}
              </p>
              <div className={styles.container}>
                <div>Cantidad:</div>
                <b className={styles.margin10}>
                  {chart === "annual_apc_expenses"
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.value)
                    : item.value}
                </b>
              </div>
            </div>
          )),
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
