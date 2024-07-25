"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

/* Components */
import Error from "@/app/error";
import InfoButton from "../InfoButton/InfoButton";
import Loading from "@/app/loading";
import PieChart from "./PieChart";
import TreemapChart from "./TreemapChart";

/* lib */
import { PLOTLIST_PIE } from "@/lib/constants";
import { APIRequest } from "@/lib/APIS/clientAPI";
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Select, Empty } from "antd";

/**
 * PercentageChartsHandler is a client-side function component that handles the selection and display of different percentage charts.
 *
 * @param {Object} entity - The entity for which the percentage chart is being displayed.
 *
 * @returns {JSX.Element} A Card component containing a Select component for choosing the percentage chart and either a PieChart or TreemapChart component for displaying the chosen chart.
 * If the API request is loading, a Loading component is displayed.
 * If the API request has an error, an Error component is displayed.
 * If there is no data for the plot, an Empty component is displayed.
 */
export default function PercentageChartsHandler({ entity }) {
  const [selectedPlot, setSelectedPlot] = useState(PLOTLIST_PIE[entity][0]);
  const pathname = usePathname();
  const URL = URLBuilder(`/app${pathname}`, { plot: selectedPlot.value });
  const [state, setUrl] = APIRequest(URL);

  const handleChange = (value, option) => {
    setSelectedPlot(option);
    setUrl(URLBuilder(`/app${pathname}`, { plot: option.value }));
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
    if (state.data.plot.length > 5)
      return <TreemapChart data={state.data.plot} />;
    return <PieChart data={state.data.plot} sum={state.data.sum} />;
  };

  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white", padding: "6px" },
        body: { padding: "10px", height: "420px" },
      }}
      hoverable
      /* title={<InfoButton label={selectedPlot.label} text={selectedPlot.text} />} */
      extra={
        <Select
          size="small"
          defaultValue={selectedPlot}
          className={styles.select}
          onChange={handleChange}
          options={PLOTLIST_PIE[entity]}
        />
      }
    >
      <div className={styles.chart}>{renderChart()}</div>
    </Card>
  );
}
