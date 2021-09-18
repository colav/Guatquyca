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

const TreeMapChart = ({
  rawData,
  id,
  title,
  infoText,
  usd = false,
  height = 700,
}) => {
  const sum = rawData.reduce((a, b) => a + b.value, 0).toLocaleString("en");
  const len = rawData.length;
  let dataSet = [
    { id: "ALL", parent: null, name: `Total: ${sum} ${usd ? "USD" : ""}` },
    { id: "Set A", parent: "ALL", name: "Set A" },
    { id: "Set B", parent: "ALL", name: "Set B" },
    { id: "Set C", parent: "ALL", name: "Set C" },
  ];
  for (let i = 0; i < len; i++) {
    if (i < len / 5) {
      dataSet.push({
        id: i,
        parent: "Set A",
        name: rawData[i].name,
        value: rawData[i].value,
      });
    } else if (i < (len / 5) * 3) {
      dataSet.push({
        id: i,
        parent: "Set B",
        name: rawData[i].name,
        value: rawData[i].value,
      });
    } else {
      dataSet.push({
        id: i,
        parent: "Set C",
        name: rawData[i].name,
        value: rawData[i].value,
      });
    }
  }

  let chart = anychart.treeMap(dataSet, "as-table");
  let customColorScale = anychart.scales.linearColor();
  customColorScale.colors(["#00ccff", "#ffcc00"]);
  chart.maxDepth(2);
  chart.headers(true);
  chart.normal().headers().fontWeight("bold");
  chart.colorScale(customColorScale);
  chart.colorRange().enabled(true);
  chart.colorRange().length("100%");
  chart.background().stroke("#EAEAE6");
  chart
    .labels()
    .format(
      `{%name}\n{%value}{numDecimals:2,groupsSeparator:\\,} ${usd ? "USD" : ""}`
    );
  chart
    .tooltip()
    .format(`{%value}{numDecimals:2,groupsSeparator:\\,} ${usd ? "USD" : ""}`);

  return (
    <Card
      size="small"
      title={title}
      bodyStyle={{ padding: "10px" }}
      hoverable
      extra={[
        <ExportXLSXAnyChart key={0} chart={chart} />,
        <ExportSVGAnyChart key={1} chart={chart} />,
        <InfoButton key={2} text={infoText} title={title} />,
      ]}
    >
      <Card
        bordered={false}
        type="inner"
        style={{ width: "100%", height: height }}
        cover={
          <div
            id={`${id}TreeMap_ChartContainer`}
            style={{ width: "100%", height: height }}
          >
            <AnyChart
              container={`${id}TreeMap_ChartContainer`}
              instance={chart}
            />
          </div>
        }
      ></Card>
    </Card>
  );
};

export default TreeMapChart;
