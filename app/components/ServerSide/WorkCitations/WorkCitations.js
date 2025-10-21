/* Components */
import OpenAlexBadge from "@/app/components/ClientSide/OpenAlexBadge/OpenAlexBadge";
import Dimensions from "@/app/components/ClientSide/Dimensions/Dimensions";
import LineChart from "@/app/components/ClientSide/Charts/DistributionCharts/LineChart";
import AlmetricsContainer from "@/app/components/ClientSide/AltMetrics/AlmetricsContainer";

/* Icons */
import { CommentOutlined, LineChartOutlined } from "@ant-design/icons";
import CitationsIcon from "@/public/media/citations";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Row, Space } from "antd";

/**
 * WorkCitations component displays citation metrics and altmetrics for an academic work.
 *
 * This includes:
 * - Total citation count (OpenAlex)
 * - Dimensions badge (if DOI is present)
 * - Citations by year as a line chart
 * - Altmetrics (if DOI is present)
 * - Fallback messages when data is missing
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array|null} props.citationsCount - Array with citation count objects (usually [{ count: number }])
 * @param {Array|null} props.citationsByYear - Array of yearly citation data for the line chart
 * @param {string|null} props.doi - DOI string for the work (optional)
 *
 * @returns {JSX.Element} Section with citation and altmetric information
 *
 */
export default function WorkCitations({
  citationsCount,
  citationsByYear,
  doi,
}) {
  const citationNumber = citationsCount?.[0]?.count || 0;
  const hasChartData =
    citationsByYear &&
    Array.isArray(citationsByYear) &&
    citationsByYear.length > 0;

  return (
    <>
      <h4 style={{ marginTop: 0 }}>
        <CitationsIcon aria-label="Citations Icon" /> Citaciones:
      </h4>
      <Row>
        <Space wrap>
          <OpenAlexBadge number={citationNumber} />
          {doi && <Dimensions doi={doi} />}
        </Space>
      </Row>

      <h4 style={{ marginTop: "25px" }}>
        <LineChartOutlined /> Citaciones por año:
      </h4>
      <div className={styles.chart_container}>
        {hasChartData ? (
          <LineChart data={citationsByYear} />
        ) : (
          <div className={styles.fallback_on_chart}>
            No hay datos de citaciones disponibles
          </div>
        )}
      </div>

      <h4 style={{ marginBottom: "7px" }}>
        <CommentOutlined /> Altmétricas:
      </h4>
      {doi ? (
        <AlmetricsContainer doi={doi} />
      ) : (
        <div className={styles.fallback}>
          No hay DOI disponible para mostrar altmétricas
        </div>
      )}
    </>
  );
}
