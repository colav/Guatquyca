import React from "react";

/* Components */
import InfoButton from "../InfoButton";
import ExportSVGAnyChart from "../ExportSVGAnyChart";
import ExportXLSXAnyChart from "../ExportXLSXAnyChart";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* UI Library Components */
const Card = require("antd/lib/card").default;

const DoughnutChart = ({ data, title, id, currency = false, height = 400 }) => {
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
  chart.innerRadius("50%");
  chart.labels().position("outside");
  currency
    ? chart.labels().format("{%value}{numDecimals:1,groupsSeparator:\\,} USD")
    : chart.labels().format("{%value}");
  chart.tooltip().format("{%PercentValue}{numDecimals:1}%");
  chart.selected().outline().width("3");
  chart.selected().outline().fill("#455a64");
  chart.selected().outline().stroke(null);
  chart.selected().outline().offset(2);

  let label = anychart.standalones.label();
  currency
    ? label.text(
        `$${parseInt(
          Object.values(data).reduce((a, b) => a + b, 0),
          10
        ).toLocaleString("en")}`
      )
    : label.text(`${Object.values(data).reduce((a, b) => a + b, 0)}`);
  label.width("100%");
  label.height("100%");
  label.fontColor("#60727b");
  label.hAlign("center");
  label.vAlign("middle");

  chart.center().content(label);
  chart.background().stroke("#EAEAE6");
  chart.outsideLabelsCriticalAngle(160);

  return (
    <Card
      size="small"
      title={title}
      bodyStyle={{ padding: "10px" }}
      hoverable
      extra={[
        <ExportXLSXAnyChart key={0} chart={chart} />,
        <ExportSVGAnyChart key={1} chart={chart} />,
        <InfoButton
          key={2}
          text={"Texto informativo para la tarjeta de Open Access"}
        />,
      ]}
    >
      <Card
        bordered={false}
        type="inner"
        style={{ width: "100%", height: height }}
        cover={
          <div
            id={`${id}Doughnut_ChartContainer`}
            style={{ width: "100%", height: height }}
          >
            <AnyChart
              container={`${id}Doughnut_ChartContainer`}
              instance={chart}
            />
          </div>
        }
      ></Card>
    </Card>
  );
};

export default DoughnutChart;
