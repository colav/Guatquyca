"use client";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const Treemap = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Treemap),
  {
    ssr: false,
  }
);

/* lib */
import { PALETTE } from "@/lib/constants";

/* Styles */
import styles from "./styles.module.css";

/**
 * TreemapChart is a client-side function component that displays a Treemap chart.
 *
 * @param {Object[]} data - The data to display in the Treemap chart. Each object should have a 'value' and a 'name' property.
 * @param {number} sum - The total value of all data points. This is displayed in the center of the Treemap chart.
 * @returns {JSX.Element} A Treemap chart component.
 */
export default function TreemapChart({ data }) {
  const config = {
    data: {
      name: "root",
      children: data,
    },
    valueField: "value",
    legend: false,
    scale: { color: { range: PALETTE } },
    margin: 0,
    style: { fillOpacity: 0.7, labelFontSize: 15 },
    interaction: {
      tooltip: {
        render: (event, { title, items }) =>
          items.map((item, i) => (
            <div key={i} className={styles.font}>
              <p className={styles.title}>
                <span
                  style={{ backgroundColor: item.color }}
                  className={styles.bullet}
                />
                {title.substring(5)}
              </p>
              <p className={styles.value}>Cantidad: {item.value}</p>
            </div>
          )),
      },
    },
  };

  return <Treemap {...config} />;
}
