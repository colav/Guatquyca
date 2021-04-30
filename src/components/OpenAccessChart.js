import React from "react";

/* Components */
import InfoButton from "./InfoButton";
import PDFDownloader from "./PDFDownloader";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;

const OpenAccessChart = ({ data }) => {
  const bgColor = {
    hybrid: "#6448ff",
    green: "#25ff76",
    gold: "#ffc03c",
    closed: "#b4b4b4",
    bronze: "#f3663f",
  };
  const dataSet = [];
  for (const key in data) {
    dataSet.push({ x: key, value: data[key], fill: bgColor[key] });
  }

  let chart = anychart.pie(dataSet);
  chart.innerRadius("45%");
  chart.labels().position("outside");
  chart.labels().format("{%value}");
  chart.tooltip().format("{%PercentValue}{numDecimals:2}%");
  chart.selected().outline().width("3");
  chart.selected().outline().fill("#455a64");
  chart.selected().outline().stroke(null);
  chart.selected().outline().offset(2);

  let label = anychart.standalones.label();
  label.text(`${Object.values(data).reduce((a, b) => a + b, 0)}`);
  label.width("100%");
  label.height("100%");
  label.fontColor("#60727b");
  label.hAlign("center");
  label.vAlign("middle");

  chart.center().content(label);
  chart.background().stroke("#EAEAE6");

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <Card
        title="Open Access"
        bodyStyle={{ padding: "10px" }}
        hoverable
        extra={[
          <PDFDownloader key={1} chart={chart} />,
          <InfoButton
            key={2}
            text={"Texto informativo para la tarjeta de Open Access"}
          />,
        ]}
      >
        <Card
          bordered={false}
          type="inner"
          cover={
            <div id="OpenAccessChartContainer">
              <AnyChart
                container={"OpenAccessChartContainer"}
                instance={chart}
              />
            </div>
          }
          style={{ width: "100%", height: "350px" }}
        ></Card>
      </Card>
    </Col>
  );
};

export default OpenAccessChart;
