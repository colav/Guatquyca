"use client";

/* Next */
import dynamic from "next/dynamic";

/* UI Library Components */
import { Empty } from "antd";

/* Styles */
import styles from "./styles.module.css";

/* Charts */
const Area = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Area),
  { ssr: false }
);

/* Quartile mapping */
const QUARTILE_MAP = {
  "Sin cuartil": 0,
  Q4: 1,
  Q3: 2,
  Q2: 3,
  Q1: 4,
};

const QUARTILE_LABELS = {
  0: "Sin cuartil",
  1: "Q4",
  2: "Q3",
  3: "Q2",
  4: "Q1",
};

/**
 * StepAreaChart is a client-side function component that displays a step area chart.
 *
 * @param {Object[]} data - The data to display in the chart. Each object should have 'x' and 'y' properties.
 * @returns {JSX.Element} A StepArea chart if data is available, otherwise an Empty component.
 */
export default function StepAreaChart({ data }) {
  if (!data || !data.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "170px" }}
      />
    );
  }

  const chartData = data.map((item) => ({
    year: String(item.x),
    value: QUARTILE_MAP[item.y] ?? 0,
    quartile: item.y,
  }));

  const config = {
    data: chartData,
    xField: "year",
    yField: "value",

    shapeField: "hvh",
    line: {
      style: {
        lineWidth: 3,
        opacity: 0.6,
      },
    },

    style: {
      opacity: 0.3,
    },

    axis: {
      x: {
        labelAutoRotate: false,
      },
      y: {
        tickCount: 5,
        labelFormatter: (v) => QUARTILE_LABELS[v] ?? "",
      },
    },

    scale: {
      y: {
        min: 0,
        max: 4,
        nice: false,
      },
    },

    interaction: {
      tooltip: {
        render: (_, { title, items }) => {
          const item = items[0];
          return (
            <div className={styles.font}>
              <p className={styles.title}>Año {title}</p>
              <div className={styles.container}>
                <span>Cuartil SCImago:</span>
                <b className={styles.margin10}>{QUARTILE_LABELS[item.value]}</b>
              </div>
            </div>
          );
        },
      },
    },
  };

  return <Area {...config} />;
}
