import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* UI Library Components */
const Card = require("antd/lib/card").default;

const WordCloudChart = ({ data, id }) => {
  let chart = anychart.tagCloud(data);
  chart
    .tooltip()
    .format("Frecuencia: {%value}\nPorcentaje del total: {%yPercentOfTotal}%");
  chart.angles([0]);
  chart.background().stroke("#EAEAE6");
  chart.scale(anychart.scales.log());

  return (
    <Card
      bordered={false}
      type="inner"
      style={{ width: "100%", height: "140px" }}
      cover={
        <div
          style={{ width: "100%", height: "140px" }}
          id={`${id}WordCloud_ChartContainer`}
        >
          <AnyChart
            container={`${id}WordCloud_ChartContainer`}
            instance={chart}
          />
        </div>
      }
    ></Card>
  );
};

export default WordCloudChart;
