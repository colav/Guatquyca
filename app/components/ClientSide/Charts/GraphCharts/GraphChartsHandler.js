"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

/* Components */
import Error from "@/app/app/error";
import Loading from "@/app/app/loading";

/* lib */
import { PLOTLIST_GRAPH } from "@/lib/constants";
import { APIRequest } from "@/lib/clientAPI";
import URLBuilder from "@/lib/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Select } from "antd";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const GraphChart = dynamic(() => import("./GraphChart"), {
  ssr: false,
});

/**
 * GraphChartsHandler is a client-side function component that handles the selection and display of different graph charts.
 *
 * @param {Object} entity - The entity for which the graph chart is being displayed.
 *
 * @returns {JSX.Element} A Card component containing a Select component for choosing the graph chart and the GraphChart component for displaying the chosen chart.
 * If the API request is loading, a Loading component is displayed.
 * If the API request has an error, an Error component is displayed.
 */
export default function GraphChartsHandler({ entity }) {
  const [selectedPlot, setSelectedPlot] = useState(
    PLOTLIST_GRAPH[entity][0].value
  );
  const pathname = usePathname();
  const URL = URLBuilder(pathname, { plot: selectedPlot });
  const [state, setUrl] = APIRequest(URL);

  const handleChange = (value) => {
    setSelectedPlot(value);
    setUrl(URLBuilder(pathname, { plot: value }));
  };
  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px", height: "420px" },
      }}
      hoverable
      extra={
        <Select
          size="small"
          defaultValue={selectedPlot}
          style={{
            width: "420px",
          }}
          onChange={handleChange}
          options={PLOTLIST_GRAPH[entity]}
        />
      }
    >
      <div className={styles.chart}>
        {state.isError ? (
          <Error height="100%" />
        ) : state.isLoading ? (
          <Loading height="100%" />
        ) : (
          <GraphChart data={state.data.plot} />
        )}
      </div>
    </Card>
  );
}
