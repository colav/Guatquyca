import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* Components */
import InfoButton from "./InfoButton";
import ExportSVGAnyChart from "./ExportSVGAnyChart";
import ExportXLSXAnyChart from "./ExportXLSXAnyChart";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;

const YearlyCitationsChart = ({ data }) => {
  const chartData = Object.entries(data.yearly_citations);

  let chart = anychart.column();
  chart.background().stroke("#EAEAE6");
  chart.tooltip().format("Citas: {%y}");
  chart.tooltip().titleFormat("Año: {%x}");
  chart.xAxis().labels().fontSize(11);
  chart.xAxis().labels().rotation(-90);
  chart.xAxis().labels().fontWeight(600);
  chart.yAxis().labels().fontWeight(600);
  let series = chart.column(chartData);
  series.normal().fill(["#50B100", "#ABF370"], 90);
  series.normal().stroke("#ABF370");
  series.labels(true);
  chart.labels().fontSize(10);
  chart.labels().rotation(-90);

  return (
    <Col span={24}>
      <Card
        size="small"
        title="Citas"
        bodyStyle={{ padding: "10px" }}
        extra={[
          <ExportXLSXAnyChart key={0} chart={chart} />,
          <ExportSVGAnyChart key={1} chart={chart} />,
          <InfoButton
            key={2}
            text={"Texto informativo para la tarjeta de citas"}
          />,
        ]}
      >
        <Card
          bordered={false}
          type="inner"
          style={{ width: "100%", height: "300px" }}
          cover={
            <div id="YearlyCitationsContainer">
              <AnyChart
                container={"YearlyCitationsContainer"}
                instance={chart}
              />
            </div>
          }
        ></Card>
        <Card.Grid className="grid-citations-card">
          Citas Totales: {data.citations}
        </Card.Grid>
        <Card.Grid className="grid-citations-card">
          Índice H: {data.H}
        </Card.Grid>
        <Card.Grid className="grid-citations-card">
          Índice H5: {data.H5}
        </Card.Grid>
      </Card>
    </Col>
  );
};

export default YearlyCitationsChart;
