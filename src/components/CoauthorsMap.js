import React from "react";

/* Libraries */
import AnyChart from "anychart-react";
import anychart from "anychart";

/* Components */
import InfoButton from "./InfoButton";
import ExportSVGAnyChart from "./ExportSVGAnyChart";
import ExportXLSXAnyChart from "./ExportXLSXAnyChart";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;

const CoauthorsMap = ({ rawData }) => {
  const data = rawData.map((item) => ({
    id: item.country_code,
    value: item.count,
  }));

  let map = anychart.map();
  map.geoData(anychart.maps.world);
  const series = map.choropleth(data);
  const ordinalScale = anychart.scales.ordinalColor([
    { less: 50 },
    { from: 51, to: 100 },
    { from: 101, to: 300 },
    { from: 301, to: 1000 },
    { from: 1001, to: 2000 },
    { from: 2001, to: 5000 },
    { from: 5001, to: 10000 },
    { from: 10001, to: 15000 },
    { greater: 15001 },
  ]);
  ordinalScale.colors([
    "#f7fcf0",
    "#e0f3db",
    "#ccebc5",
    "#a8ddb5",
    "#7bccc4",
    "#4eb3d3",
    "#2b8cbe",
    "#0868ac",
    "#084081",
  ]);
  series.colorScale(ordinalScale);
  series.stroke("#000 .5");

  return (
    <Col xs={24} lg={16}>
      <Card
        size="small"
        title="Alcance Geográfico"
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
          cover={
            <div id="MapContainer">
              <AnyChart container="MapContainer" instance={map} />
            </div>
          }
          style={{ width: "100%", height: "600px" }}
        ></Card>
      </Card>
    </Col>
  );
};

export default CoauthorsMap;
