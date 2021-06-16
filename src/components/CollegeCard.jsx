import React from "react";

import CollegeModal from "./CollegeModal";

/* Charts */
import LineChartNoCard from "./charts/LineChart";
import WordCloudChart from "./charts/WordCloudChart";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Modal = require("antd/lib/modal").default;
const Row = require("antd/lib/row").default;

/* Icons */
const ExpandAltOutlined =
  require("@ant-design/icons/ExpandAltOutlined").default;

const CollegeCard = ({ data, core }) => {
  const gridStyle = {
    width: "10%",
    textAlign: "center",
    padding: "10px",
    height: "100px",
  };

  const onClick = (id) => {
    Modal.info({
      width: "1400px",
      closable: true,
      icon: null,
      destroyOnClose: true,
      okText: "Cerrar",
      footer: null,
      style: { top: 20 },
      content: <CollegeModal id={id} core={core} />,
    });
  };
  return (
    <Row gutter={[15, 15]}>
      {data.map((college, i) => (
        <Col span={24} key={college.icid}>
          <Card
            size="small"
            actions={[
              <div onClick={() => onClick(data[i].icid)}>
                <ExpandAltOutlined /> Ver información adicional
              </div>,
            ]}
          >
            <Card.Grid
              style={{ width: "40%", height: "100px", padding: "10px" }}
            >
              <WordCloudChart
                data={data[i].words}
                id={`wc_col_in_${i}`}
                height={84}
              />
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Citas totales:
              <br />
              {college.cites_count}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Artículos totales:
              <br />
              {college.papers_count}
            </Card.Grid>
            <Card.Grid
              style={{ width: "40%", height: "100px", padding: "10px" }}
            >
              <LineChartNoCard
                rawData={data[i].yearly_papers}
                id={`col_in_${i}`}
                height={84}
              />
            </Card.Grid>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CollegeCard;
