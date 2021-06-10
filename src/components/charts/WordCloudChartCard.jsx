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

const WordCloudChartCard = ({ data, title, id, height = 400 }) => {
  let chart = anychart.tagCloud(data);
  chart
    .tooltip()
    .format("Frecuencia: {%value}\nPorcentaje del total: {%yPercentOfTotal}%");
  chart.angles([0]);
  chart.background().stroke("#EAEAE6");

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
          text={"Texto informativo para la tarjeta de WordCloud"}
        />,
      ]}
    >
      <Card
        bordered={false}
        type="inner"
        style={{ width: "100%", height: height }}
        cover={
          <div
            id={`${id}WordCloud_ChartContainer`}
            style={{ width: "100%", height: height }}
          >
            <AnyChart
              container={`${id}WordCloud_ChartContainer`}
              instance={chart}
            />
          </div>
        }
      ></Card>
    </Card>
  );
};

export default WordCloudChartCard;
