import React from "react";

/*  Components */
import CollegeModal from "./CollegeModal";

/* Charts */
import LineChart from "./charts/LineChart";
import WordCloudChart from "./charts/WordCloudChart";

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Modal = require("antd/lib/modal").default;
const Table = require("antd/lib/table").default;

/* UI Library Sub-components */
const { Column } = Table;

const CollegesTable = ({ data, core, parent }) => {
  const onClick = (id) => {
    Modal.info({
      width: "1400px",
      closable: true,
      icon: null,
      destroyOnClose: true,
      okText: "Cerrar",
      footer: null,
      style: { top: 20 },
      content: <CollegeModal id={id} core={core} parent={parent} />,
    });
  };

  return (
    <Table
      size="small"
      rowKey="icid"
      dataSource={data}
      bordered={true}
      pagination={{ size: "small", hideOnSinglePage: true }}
    >
      <Column
        title="Colegio Invisible"
        dataIndex={"words"}
        key={"words"}
        align="center"
        width={"35%"}
        render={(data, obj, i) => (
          <WordCloudChart data={data} id={`wc_${parent}_in_${i}`} height={90} />
        )}
      />
      <Column
        title="Total de citas"
        dataIndex="cites_count"
        key="cites_count"
        align="center"
        width={"10%"}
      />
      <Column
        title="Artículos de la institución"
        dataIndex="papers_count"
        key="papers_count"
        align="center"
        width={"10%"}
      />
      <Column
        title="Total de artículos"
        dataIndex="total_papers"
        key="total_papers"
        align="center"
        width={"10%"}
      />
      <Column
        title="Artículos por año"
        dataIndex="yearly_papers"
        key="yearly_papers"
        align="center"
        render={(data, obj, i) => (
          <LineChart rawData={data} id={`lc_${parent}_in_${i}`} height={90} />
        )}
      />
      <Column
        align="center"
        key="button"
        width={"5%"}
        render={(data, obj) => (
          <Button type="primary" onClick={() => onClick(obj.icid)}>
            Ver más
          </Button>
        )}
      />
    </Table>
  );
};

export default CollegesTable;
