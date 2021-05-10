import React from "react";
import AnyChart from "anychart-react";
import anychart from "anychart";
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const notification = require("antd/lib/notification").default;

const NetworkChart = ({ networkData, setup }) => {
  let eCache = "";
  const openNotification = (e) => {
    if (e.index !== eCache.index) {
      eCache = e;
      notification.open({
        style: { width: 550, border: "2px solid #DCDCD5" },
        message: networkData.nodes[e.index].title,
        description: e.id,
      });
    }
  };

  let chart = anychart.graph(networkData);
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
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <Card title={setup.title} bodyStyle={{ padding: "10px" }} hoverable>
        <Card
          bordered={false}
          type="inner"
          cover={
            <div id={`${setup.id}NetworkChartContainer`}>
              <AnyChart
                container={`${setup.id}NetworkChartContainer`}
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

export default NetworkChart;
