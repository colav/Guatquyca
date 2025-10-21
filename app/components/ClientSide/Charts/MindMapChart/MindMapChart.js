"use client";

/* Components */
import Loading from "@/app/loading";
import { MindMap } from "@ant-design/graphs";

/* Hooks */
import { useState, useEffect } from "react";

/* lib */
import ourData from "@/lib/Data/ourData.json";

/* Styles */
import styles from "./styles.module.css";

/**
 * MindMapChart is a client-side function component that displays an interactive mind map visualization.
 *
 * @returns {JSX.Element} A MindMap chart component with collapse/expand functionality and boxed layout.
 */
export default function MindMapChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(ourData);
  }, []);

  if (!data) {
    return <Loading height={400} />;
  }
  const options = {
    type: "boxed",
    autoFit: "view",
    data,
    transforms: (prev) => [
      ...prev.filter(
        (transform) => transform.type !== "collapse-expand-react-node"
      ),
      {
        ...prev.find(
          (transform) => transform.type === "collapse-expand-react-node"
        ),
        enable: true,
      },
    ],
  };

  return (
    <div className={styles.outer_container}>
      <div className={styles.chart}>
        <MindMap {...options} />
      </div>
    </div>
  );
}
