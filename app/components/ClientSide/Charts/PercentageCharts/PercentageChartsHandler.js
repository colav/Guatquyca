"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

/* Components */
import Error from "@/app/app/error";
import Loading from "@/app/app/loading";
import PieChart from "./PieChart";
import TreemapChart from "./TreemapChart";

/* lib */
import { PLOTLIST_PIE } from "@/lib/constants";
import { APIRequest } from "@/lib/clientAPI";
import URLBuilder from "@/lib/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Select } from "antd";

/**
 * PercentageChartsHandler is a client-side function component that handles the selection and display of different percentage charts.
 *
 * @param {Object} entity - The entity for which the percentage chart is being displayed.
 * @param {number} sum - The total sum of the data values. Defaults to 0.
 *
 * @returns {JSX.Element} A Card component containing a Select component for choosing the percentage chart and either a PieChart or TreemapChart component for displaying the chosen chart.
 * If the API request is loading, a Loading component is displayed.
 * If the API request has an error, an Error component is displayed.
 */
export default function PercentageChartsHandler({ entity, sum = 0 }) {
  const [selectedPlot, setSelectedPlot] = useState(
    PLOTLIST_PIE[entity][0].value
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
          options={PLOTLIST_PIE[entity]}
        />
      }
    >
      <div className={styles.chart}>
        {state.isError ? (
          <Error height="100%" />
        ) : state.isLoading ? (
          <Loading height="100%" />
        ) : state.data.plot?.length > 5 ? (
          <TreemapChart data={state.data.plot} />
        ) : (
          <PieChart data={state.data.plot} sum={sum} />
        )}
      </div>
    </Card>
  );
}
