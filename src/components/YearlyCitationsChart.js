import React from "react";
import AnyChart from "anychart-react";
import anychart from "anychart";
import InfoButton from "./InfoButton";
const Card = require("antd/lib/card").default;
const Button = require("antd/lib/button").default;
const Col = require("antd/lib/col").default;
const DownloadOutlined = require("@ant-design/icons/DownloadOutlined").default;

const YearlyCitationsChart = ({ data }) => {
  const chartData = Object.entries(data.yearly_citations);

  let chart = anychart.column();
  chart.background().stroke("#EAEAE6");
  chart.tooltip().format("Citas: {%y}");
  chart.tooltip().titleFormat("Año: {%x}");
  let series = chart.column(chartData);
  series.normal().fill(["#50B100", "#ABF370"], 90);
  series.normal().stroke("#ABF370");

  function pdf() {
    chart.saveAsPdf();
  }

  const gridStyle = {
    width: "50%",
    height: "40px",
    marginTop: "10px",
    paddingTop: "8px",
    textAlign: "center",
  };

  return (
    <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
      <Card
        title="Citas"
        extra={[
          <InfoButton
            key={1}
            text={"Texto informativo para la tarjeta de citas"}
          />,
          " ",
          <Button
            key={2}
            shape="round"
            style={{
              color: "#9D3715",
              backgroundColor: "#FFE1BB",
              border: "2px solid #063966",
            }}
            onClick={pdf}
            icon={<DownloadOutlined />}
          >
            pdf
          </Button>,
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
        <Card.Grid style={gridStyle}>Citas Totales: {data.citations}</Card.Grid>
        <Card.Grid style={gridStyle}>Índice H5: {data.H5}</Card.Grid>
      </Card>
    </Col>
  );
};

export default YearlyCitationsChart;
