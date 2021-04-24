import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* Components */
import InfoButton from "./InfoButton";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Button = require("antd/lib/button").default;
const Col = require("antd/lib/col").default;

/* Icons */
const FilePdfOutlined = require("@ant-design/icons/FilePdfOutlined").default;

const YearlyCitationsChart = ({ data }) => {
  const chartData = Object.entries(data.yearly_citations);

  let chart = anychart.column();
  chart.background().stroke("#EAEAE6");
  chart.tooltip().format("Citas: {%y}");
  chart.tooltip().titleFormat("Año: {%x}");
  chart.xAxis().labels().fontSize(12);
  chart.xAxis().labels().rotation(-90);
  chart.xAxis().labels().fontWeight(600);
  chart.yAxis().labels().fontWeight(600);
  let series = chart.column(chartData);
  series.normal().fill(["#50B100", "#ABF370"], 90);
  series.normal().stroke("#ABF370");
  series.labels(true);
  chart.labels().fontSize(10);

  function pdf() {
    chart.saveAsPdf();
  }
  return (
    <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
      <Card
        title="Citas"
        extra={[
          <Button
            size="small"
            key={1}
            style={{
              color: "#9D3715",
              backgroundColor: "#ffe9cc",
              border: "none",
              marginRight: "20px",
            }}
            onClick={pdf}
            icon={<FilePdfOutlined />}
          >
            pdf
          </Button>,
          <InfoButton
            key={2}
            text={"Texto informativo para la tarjeta de citas"}
          />,
        ]}
        bodyStyle={{ padding: "10px" }}
        hoverable
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
