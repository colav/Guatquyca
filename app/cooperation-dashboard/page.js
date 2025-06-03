"use client";

/* React */
import { useState, useEffect } from "react";

/* Charts */
import StackedBarChart from "@/app/components/ClientSide/Charts/DistributionCharts/StackedBarChart";
import MapChart from "../components/ClientSide/Charts/MapCharts/MapChart";
import PieChart from "../components/ClientSide/Charts/PercentageCharts/PieChart";

/* UI Components */
import { Card, Col, Row } from "antd";
import Loading from "../loading";

/* Styles */
import styles from "./styles.module.css";

/* Static Data Import */
import mainDashboardPlots from "@/lib/Data/main_dashboard_plots.json";

/* Constants */
const CARD_HEADER_STYLE = {
  backgroundColor: "#003e65",
  color: "white",
  padding: "6px",
  overflow: "visible",
};
const CARD_BODY_STYLE = { padding: "10px", height: "420px" };

/* Reusable ChartCard Component */
function ChartCard({ title, chartComponent }) {
  return (
    <Card
      size="small"
      styles={{
        header: CARD_HEADER_STYLE,
        body: CARD_BODY_STYLE,
      }}
      hoverable
      title={title}
    >
      <div className={styles.chart}>{chartComponent}</div>
    </Card>
  );
}

export default function CooperationPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(mainDashboardPlots);
  }, []);

  const renderChart = (index, Component, extraProps = {}) => {
    if (!data || !data[index]) {
      return <Loading height={400} />;
    }
    return <Component data={data[index].plot} {...extraProps} />;
  };

  return (
    <>
      <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
        <Col xs={24} sm={24} md={12}>
          <ChartCard
            title="Movilidades por país de destino"
            chartComponent={renderChart(0, MapChart)}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <ChartCard
            title="Financiación nacional"
            chartComponent={renderChart(3, PieChart, { sum: data?.[3]?.sum })}
          />
        </Col>
      </Row>

      <Row gutter={[15, 15]}>
        <Col xs={24} sm={24} md={12}>
          <ChartCard
            title="Instituciones de destino"
            chartComponent={renderChart(1, StackedBarChart)}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <ChartCard
            title="Tipo de movilidad por Institución"
            chartComponent={renderChart(2, StackedBarChart)}
          />
        </Col>
      </Row>
    </>
  );
}
