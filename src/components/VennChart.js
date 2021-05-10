import React, { useMemo } from "react";

/* Libraries */
import { VennDiagram, extractFromExpression } from "@upsetjs/react";

/* Components */
import InfoButton from "./InfoButton";
import SVGDownloader from "./SVGDownloader";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;

const VennChart = ({ data }) => {
  const { sets, combinations } = useMemo(
    () =>
      extractFromExpression([
        { sets: ["Scholar"], cardinality: data.scholar, color: "#ffe682" },
        { sets: ["Scopus"], cardinality: data.scopus, color: "#ffa0f0" },
        { sets: ["M.A."], cardinality: 2, color: "#aac8ff" },
        { sets: ["SciELO"], cardinality: 3, color: "#8cffe6" },
        {
          sets: ["Scholar", "Scopus"],
          cardinality: 4,
          color: "#ff907a",
        },
        { sets: ["Scholar", "M.A."], cardinality: 5, color: "#aab482" },
        { sets: ["Scholar", "SciELO"], cardinality: 6, color: "#8ce675" },
        { sets: ["Scopus", "M.A."], cardinality: 7, color: "#aa7df0" },
        { sets: ["Scopus", "SciELO"], cardinality: 8, color: "#8ca0d8" },
        { sets: ["M.A.", "SciELO"], cardinality: 9, color: "#5dc8e6" },
        {
          sets: ["Scholar", "Scopus", "M.A."],
          cardinality: 10,
          color: "#aa717a",
        },
        {
          sets: ["Scholar", "Scopus", "SciELO"],
          cardinality: 11,
          color: "#8c906e",
        },
        {
          sets: ["Scholar", "M.A.", "SciELO"],
          cardinality: 12,
          color: "#5db475",
        },
        {
          sets: ["Scopus", "M.A.", "SciELO"],
          cardinality: 13,
          color: "#5d7dd8",
        },
        {
          sets: ["Scholar", "Scopus", "M.A.", "SciELO"],
          cardinality: 14,
          color: "#5d716e",
        },
      ]),
    [data]
  );

  const chart = document.getElementById("venn-chart");

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <Card
        title="Fuentes Bibliográficas"
        bodyStyle={{ padding: "10px" }}
        hoverable
        extra={[
          <SVGDownloader key={1} chart={chart} />,
          <InfoButton
            key={2}
            text={"Texto informativo para la tarjeta de Fuentes Bibliográficas"}
          />,
        ]}
      >
        <Card
          bordered={false}
          type="inner"
          cover={
            <div id="VennChartContainer">
              <VennDiagram
                id="venn-chart"
                sets={sets}
                combinations={combinations}
                width={390}
                height={300}
                exportButtons={false}
                textColor="#4f5a63"
              />
            </div>
          }
          style={{ width: "100%", height: "350px" }}
        ></Card>
      </Card>
    </Col>
  );
};

export default VennChart;
