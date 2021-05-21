import React from "react";

/* Components */
import InfoButton from "./InfoButton";
import ExportSVGAnyChart from "./ExportSVGAnyChart";
import ExportXLSXAnyChart from "./ExportXLSXAnyChart";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* UI Library Components */
const Card = require("antd/lib/card").default;

const TreeMap = ({ rawData }) => {
  const sum = parseInt(
    Object.values(rawData).reduce((a, b) => a + b, 0),
    10
  ).toLocaleString("en");
  const dataSet = [{ name: `Total: ${sum} USD`, children: [] }];
  for (const key in rawData) {
    dataSet[0].children.push({ name: key, value: rawData[key] });
  }
  console.log(dataSet);

  const chart = anychart.treeMap(dataSet, "as-tree");
  var customColorScale = anychart.scales.linearColor();
  customColorScale.colors(["#00ccff", "#ffcc00"]);

  // set the color scale as the color scale of the chart
  chart.colorScale(customColorScale);
  chart.colorRange().enabled(true);
  chart.colorRange().length("100%");

  chart
    .labels()
    .format("{%name}\n{%value}{numDecimals:0,groupsSeparator:\\,} USD");

  return (
    <Card
      size="small"
      title={"Revistas"}
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
        cover={
          <div id={`treemap_ChartContainer`}>
            <AnyChart container={`treemap_ChartContainer`} instance={chart} />
          </div>
        }
        style={{ width: "100%", height: "700px" }}
      ></Card>
    </Card>
  );
};

export default TreeMap;
