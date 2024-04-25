"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

/* Components */
import Error from "@/app/app/error";
import Loading from "@/app/app/loading";
import StackedColumnChart from "./StackedColumnChart";

/* lib */
import { PLOTLIST_STACKED } from "@/lib/constants";
import { APIRequest } from "@/lib/clientAPI";
import URLBuilder from "@/lib/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Empty, Select } from "antd";
import ColumnChart from "./ColumnChart";

/**
 * DistributionChartsHandler is a client-side function component that handles the selection and display of different distribution charts.
 *
 * @param {Object} entity - The entity for which the distribution chart is being displayed.
 *
 * @returns {JSX.Element} A Card component containing a Select component for choosing the distribution chart and either a StackedColumnChart or ColumnChart component for displaying the chosen chart.
 * If the API request is loading, a Loading component is displayed.
 * If the API request has an error, an Error component is displayed.
 */
export default function DistributionChartsHandler({ entity }) {
  const [selectedPlot, setSelectedPlot] = useState(
    PLOTLIST_STACKED[entity][0].value
  );
  const pathname = usePathname();
  const URL = URLBuilder(pathname, { plot: selectedPlot });
  const [state, setUrl] = APIRequest(URL);

  const handleChange = (value) => {
    setSelectedPlot(value);
    setUrl(URLBuilder(pathname, { plot: value }));
  };

  const renderChart = () => {
    if (state.isError) return <Error height="100%" />;
    if (state.isLoading) return <Loading height="100%" />;
    if (!state.data.plot)
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Datos insuficientes"
          style={{ marginTop: "170px" }}
        />
      );
    if (state.data?.plot[0]?.type)
      return <StackedColumnChart data={state.data.plot} />;
    return <ColumnChart data={state.data.plot} />;
  };

  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white", padding: "6px" },
        body: { padding: "10px", height: "420px" },
      }}
      hoverable
      extra={
        <Select
          size="small"
          defaultValue={selectedPlot}
          className={styles.select}
          onChange={handleChange}
          options={PLOTLIST_STACKED[entity]}
        />
      }
    >
      <div className={styles.chart}>{renderChart()}</div>
    </Card>
  );
}
