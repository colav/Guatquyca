import React, { useMemo } from "react";

/* Libraries */
import { VennDiagram, extractFromExpression } from "@upsetjs/react";

/* Components */
import InfoButton from "../InfoButton";
import ExportSVGUpSet from "../ExportSVGUpSet";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;

const VennChart = ({ data }) => {
  const { sets, combinations } = useMemo(
    () =>
      extractFromExpression([
        {
          sets: ["Scopus"],
          cardinality: data.scopus,
          color: "#ffe682",
        },
        { sets: ["SciELO"], cardinality: data.scielo, color: "#ffa0f0" },
        {
          sets: ["Google Académico"],
          cardinality: data.scholar,
          color: "#aac8ff",
        },
        { sets: ["Lens"], cardinality: data.lens, color: "#8cffe6" },
        {
          sets: ["Google Académico", "Scopus"],
          cardinality: data.scholar_scopus,
          color: "#ff907a",
        },
        {
          sets: ["Google Académico", "Lens"],
          cardinality: data.scholar_lens,
          color: "#aab482",
        },
        {
          sets: ["Google Académico", "SciELO"],
          cardinality: data.scholar_scielo,
          color: "#8ce675",
        },
        {
          sets: ["Scopus", "Lens"],
          cardinality: data.lens_scopus,
          color: "#aa7df0",
        },
        {
          sets: ["Scopus", "SciELO"],
          cardinality: data.scielo_scopus,
          color: "#8ca0d8",
        },
        {
          sets: ["Lens", "SciELO"],
          cardinality: data.lens_scielo,
          color: "#5dc8e6",
        },
        {
          sets: ["Google Académico", "Scopus", "Lens"],
          cardinality: data.scholar_lens_scopus,
          color: "#aa717a",
        },
        {
          sets: ["Google Académico", "Scopus", "SciELO"],
          cardinality: data.scholar_scielo_scopus,
          color: "#8c906e",
        },
        {
          sets: ["Google Académico", "Lens", "SciELO"],
          cardinality: data.scholar_lens_scielo,
          color: "#5db475",
        },
        {
          sets: ["Scopus", "Lens", "SciELO"],
          cardinality: data.lens_scielo_scopus,
          color: "#5d7dd8",
        },
        {
          sets: ["Google Académico", "Scopus", "Lens", "SciELO"],
          cardinality: data.scholar_lens_scielo_scopus,
          color: "#5d716e",
        },
      ]),
    [data]
  );

  const chart = document.getElementById("venn-chart");

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
      <Card
        size="small"
        title="Fuentes Bibliográficas"
        bodyStyle={{ padding: "10px" }}
        hoverable
        extra={[
          <ExportSVGUpSet key={1} chart={chart} />,
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
                width={370}
                height={290}
                exportButtons={false}
                textColor="#4f5a63"
                fontSizes={{ valueLabel: "8px", setLabel: "13px" }}
                strokeColor="white"
              />
            </div>
          }
          style={{ width: "100%", height: "400px" }}
        ></Card>
      </Card>
    </Col>
  );
};

export default VennChart;
