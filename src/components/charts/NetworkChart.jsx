import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const notification = require("antd/lib/notification").default;

const NetworkChart = ({ data, title, id, height = 280 }) => {
  let eCache = "";
  const openNotification = (e) => {
    if (e.index !== eCache.index) {
      eCache = e;
      notification.open({
        style: { width: 550, border: "2px solid #DCDCD5" },
        message: data.nodes[e.index].title,
        description: e.id,
      });
    }
  };

  let chart = anychart.graph(data);
  chart.background().stroke("#EAEAE6");
  chart.nodes().fill("#FBDD7E");
  chart.nodes().hovered().fill("#FFC820");
  chart.nodes().selected().fill(openNotification);
  chart.nodes().stroke("0.5px white");
  chart.nodes().hovered().stroke("#39658C");
  chart.nodes().tooltip().format("{%title}");
  /* chart
    .edges()
    .normal()
    .stroke((e) => `${networkData.edges[e.index].weight * 10} #eaeae6`); */
  chart.edges().tooltip().format("De: {%from}\nA: {%to}\nCitas: {%cited}");

  return (
    <Card size="small" title={title} bodyStyle={{ padding: "10px" }} hoverable>
      <Card
        bordered={false}
        type="inner"
        style={{ width: "100%", height: height }}
        cover={
          <div
            id={`${id}Network_ChartContainer`}
            style={{ width: "100%", height: height }}
          >
            <AnyChart
              container={`${id}Network_ChartContainer`}
              instance={chart}
            />
          </div>
        }
      ></Card>
    </Card>
  );
};

export default NetworkChart;
