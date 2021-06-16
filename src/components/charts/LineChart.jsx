import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* UI Library Components */
const Card = require("antd/lib/card").default;

const LineChartNoCard = ({ rawData, id = "", height = "200px" }) => {
  const data = [];
  for (const key in rawData) {
    data.push({ x: key, value: rawData[key] });
  }
  const chart = anychart.line();
  let series = chart.line(data);
  //series.markers(true);
  series.normal().fill(["#ffca38", "#ffdb38"], 90);
  series.normal().stroke("3 #ffca38");
  chart.xAxis(null);
  chart.yAxis(null);
  /*   chart.xAxis().labels().fontSize(11);
  chart.xAxis().labels().rotation(-90);
  chart.xAxis().labels().fontWeight(600);
  chart.yAxis().labels().fontWeight(600); */
  chart.yAxis().title("Artículos");
  chart.tooltip().format("Total: {%value}");
  chart.background().stroke("#EAEAE6");

  return (
    <Card
      bordered={false}
      type="inner"
      style={{ width: "100%", height: height }}
      cover={
        <div
          id={`${id}Line_ChartContainer`}
          style={{ width: "100%", height: height }}
        >
          <AnyChart container={`${id}Line_ChartContainer`} instance={chart} />
        </div>
      }
    ></Card>
  );
};

export default LineChartNoCard;
