"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

/* Components */
import Error from "@/app/error";
import InfoButton from "../InfoButton/InfoButton";
import Loading from "@/app/loading";

/* lib */
import { PLOTLIST_MAP } from "@/lib/constants";
import { APIRequest } from "@/lib/clientAPI";
import URLBuilder from "@/lib/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Select } from "antd";

/* Next */
import dynamic from "next/dynamic";

/* Libraries */
const MapChart = dynamic(() => import("./MapChart"), {
  ssr: false,
});

/**
 * MapChartsHandler is a client-side function component that handles the selection and display of different map charts.
 *
 * @returns {JSX.Element} A Card component containing a Select component for choosing the map chart and the MapChart component for displaying the chosen chart.
 * If the API request is loading, a Loading component is displayed.
 * If the API request has an error, an Error component is displayed.
 */
export default function MapChartsHandler() {
  const [selectedPlot, setSelectedPlot] = useState(PLOTLIST_MAP[0]);
  const pathname = usePathname();
  const URL = URLBuilder(`/app${pathname}`, { plot: selectedPlot.value });
  const [state, setUrl] = APIRequest(URL);

  const handleChange = (value, option) => {
    setSelectedPlot(option);
    setUrl(URLBuilder(`/app${pathname}`, { plot: option.value }));
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
          options={PLOTLIST_MAP}
        />
      }
    >
      <div className={styles.chart}>
        {state.isError ? (
          <Error height="100%" />
        ) : state.isLoading ? (
          <Loading height="100%" />
        ) : (
          <MapChart data={state.data.plot} />
        )}
      </div>
    </Card>
  );
}
