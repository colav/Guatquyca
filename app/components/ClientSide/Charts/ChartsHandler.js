"use client";

/* Hooks */
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* Components */
import Error from "@/app/error";
import InfoButton from "./InfoButton/InfoButton";
import Loading from "@/app/loading";

/* Charts */
import ColumnChart from "./DistributionCharts/ColumnChart";
import GraphChart from "./GraphCharts/GraphChart";
import MapChart from "./MapCharts/MapChart";
import StackedColumnChart from "./DistributionCharts/StackedColumnChart";
import PieChart from "./PercentageCharts/PieChart";
import TreemapChart from "./PercentageCharts/TreemapChart";
import VennChart from "./SetCharts/VennChart";

/* lib */
import { APIRequest } from "@/lib/APIS/clientAPI";
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Empty, TreeSelect } from "antd";

/* Utils */
import { getQueryParamsAsObject } from "@/lib/Utils/getQueryParamsAsObject";

/* Constants */
const CARD_HEADER_STYLE = {
  backgroundColor: "#003e65",
  color: "white",
  padding: "6px",
  overflow: "visible",
};
const CARD_BODY_STYLE = { padding: "10px", height: "420px" };

/**
 * ChartsHandler component to render different types of charts based on the selected plot.
 *
 * @param {Array} plotlist - The list of plots available for selection.
 * @returns {JSX.Element} The rendered component.
 */
export default function ChartsHandler({ plotlist }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParams = getQueryParamsAsObject(searchParams);

  const [selectedPlot, setSelectedPlot] = useState(plotlist[0].children[0]);

  const previousQueryParamsRef = useRef(queryParams);

  const ignoredQueryKeys = ["max", "page", "sort"];

  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([key]) => !ignoredQueryKeys.includes(key)
    )
  );

  const initialURL = URLBuilder(`/app${pathname}`, queryParams, {
    plot: selectedPlot.value,
  });
  const [state, setUrl] = APIRequest(initialURL);

  useEffect(() => {
    const previousQueryParams = previousQueryParamsRef.current;

    if (
      JSON.stringify(filteredQueryParams) !==
      JSON.stringify(previousQueryParams)
    ) {
      const updatedUrl = URLBuilder(`/app${pathname}`, filteredQueryParams, {
        plot: selectedPlot.value,
      });
      setUrl(updatedUrl);
      previousQueryParamsRef.current = filteredQueryParams;
    }
  }, [filteredQueryParams]);

  const handleChange = (value, option) => {
    setSelectedPlot(option);
    setUrl(URLBuilder(`/app${pathname}`, filteredQueryParams, { plot: value }));
  };

  const chartComponents = {
    map: <MapChart data={state.data.plot} />,
    graph: <GraphChart data={state.data.plot} />,
    percentage:
      state.data?.plot && state.data.plot.length > 7 ? (
        <TreemapChart data={state.data.plot} chart={selectedPlot.value} />
      ) : (
        <PieChart data={state.data.plot} sum={state.data.sum} />
      ),
    distribution:
      state.data?.plot && state.data.plot[0]?.type ? (
        <StackedColumnChart data={state.data.plot} />
      ) : (
        <ColumnChart data={state.data.plot} chart={selectedPlot.value} />
      ),
    set: <VennChart data={state.data.plot} />,
  };

  const renderChart = () => {
    if (state.isError) return <Error height="100%" />;
    if (state.isLoading) return <Loading height="100%" />;
    if (!state.data?.plot || state.data?.plot.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Datos insuficientes"
          style={{ marginTop: "170px" }}
        />
      );
    }
    return chartComponents[selectedPlot.type] || null;
  };

  return (
    <Card
      size="small"
      styles={{
        header: CARD_HEADER_STYLE,
        body: CARD_BODY_STYLE,
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
          filterTreeNode={(inputValue, treeNode) =>
            treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
          }
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
