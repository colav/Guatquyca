import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* Components */
import InfoButton from "../InfoButton";
import ExportSVGAnyChart from "../ExportSVGAnyChart";
import ExportXLSXAnyChart from "../ExportXLSXAnyChart";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;

const CoauthorsMap = ({ rawData, title, id, height = 360 }) => {
  const data = rawData.map((item) => ({
    id: item.country_code,
    value: item.log_count,
    count: item.count,
    name: item.country,
  }));
  let map = anychart.map().geoData(anychart.maps.world);

  let series = map.choropleth(data);
  series.tooltip().format("Total: {%count}\nAlfa-2: {%id}");
  series.colorScale(
    anychart.scales.linearColor(
      "#f7fcf0",
      "#e0f3db",
      "#ccebc5",
      "#a8ddb5",
      "#7bccc4",
      "#4eb3d3",
      "#2b8cbe",
      "#0868ac",
      "#084081"
    )
  );
  series.stroke("black 0.5");

  map.listen("pointClick", function (e) {
    map.zoomToFeature(e.point.get("id"));
  });
  map.background().stroke("#EAEAE6");

  return (
    <Col xs={24} lg={16}>
      <Card
        size="small"
        title={title}
        bodyStyle={{ padding: "10px" }}
        hoverable
        extra={[
          <ExportXLSXAnyChart key={0} chart={map} />,
          <ExportSVGAnyChart key={1} chart={map} />,
          <InfoButton
            key={2}
            text={"Texto informativo para la tarjeta mapa de coautorías"}
          />,
        ]}
      >
        <Card
          bordered={false}
          type="inner"
          style={{ width: "100%", height: height }}
          cover={
            <div
              id={`${id}Map_ChartContainer`}
              style={{ width: "100%", height: height }}
            >
              <AnyChart container={`${id}Map_ChartContainer`} instance={map} />
            </div>
          }
        ></Card>
      </Card>
    </Col>
  );
};

export default CoauthorsMap;
