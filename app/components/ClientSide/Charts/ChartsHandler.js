"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

/* Components */
import Error from "@/app/error";
import InfoButton from "./InfoButton/InfoButton";
import Loading from "@/app/loading";

/* Charts */
import StackedColumnChart from "./DistributionCharts/StackedColumnChart";
import ColumnChart from "./DistributionCharts/ColumnChart";
import PieChart from "./PercentageCharts/PieChart";
import TreemapChart from "./PercentageCharts/TreemapChart";
import MapChart from "./MapCharts/MapChart";
import GraphChart from "./GraphCharts/GraphChart";

/* lib */
import { APIRequest } from "@/lib/APIS/clientAPI";
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Empty, TreeSelect } from "antd";

/**
 * ChartsHandler component to render different types of charts based on the selected plot.
 *
 * @param {Object} entity - The entity data.
 * @param {Array} plotlist - The list of plots available for selection.
 * @returns {JSX.Element} The rendered component.
 */
export default function ChartsHandler({ plotlist }) {
  const [selectedPlot, setSelectedPlot] = useState(plotlist[0].children[0]);
  const pathname = usePathname();
  const URL = URLBuilder(`/app${pathname}`, { plot: selectedPlot.value });

  const [state, setUrl] = APIRequest(URL);

  const handleChange = (value, option) => {
    setSelectedPlot(option);
    setUrl(URLBuilder(`/app${pathname}`, { plot: value }));
  };

  /**
   * Render the appropriate chart based on the selected plot type.
   *
   * @returns {JSX.Element|null} The rendered chart component or null.
   */
  const renderChart = () => {
    if (state.isError) return <Error height="100%" />;
    if (state.isLoading) return <Loading height="100%" />;
    if (!state.data?.plot) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Datos insuficientes"
          style={{ marginTop: "170px" }}
        />
      );
    }

    switch (selectedPlot.type) {
      case "map":
        return <MapChart data={state.data.plot} />;
      case "graph":
        return <GraphChart data={state.data.plot} />;
      case "percentage":
        return state.data.plot.length > 5 ? (
          <TreemapChart data={state.data.plot} />
        ) : (
          <PieChart data={state.data.plot} sum={state.data.sum} />
        );
      case "distribution":
        return state.data?.plot[0]?.type ? (
          <StackedColumnChart data={state.data.plot} />
        ) : (
          <ColumnChart data={state.data.plot} />
        );
      default:
        return null;
    }
  };

  const filterTreeNode = (inputValue, treeNode) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <Card
      size="small"
      styles={{
        header: {
          backgroundColor: "#003e65",
          color: "white",
          padding: "6px",
          overflow: "visible",
        },
        body: { padding: "10px", height: "420px" },
      }}
      hoverable
      title={<InfoButton label={selectedPlot.title} text={selectedPlot.text} />}
      extra={
        <TreeSelect
          showSearch
          size="small"
          defaultValue={selectedPlot}
          className={styles.select}
          onSelect={handleChange}
          treeData={plotlist}
          treeLine
          filterTreeNode={filterTreeNode}
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Indicador no encontrado"
            />
          }
        />
      }
    >
      <div className={styles.chart}>{renderChart()}</div>
    </Card>
  );
}
