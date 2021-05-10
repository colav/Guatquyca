import React from "react";

/* Utilities */
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Table = require("antd/lib/table").default;

/* UI Library Sub-components */
const { Column } = Table;

const CoauthorsList = ({ data, setCurrentURL }) => {
  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <Card
        title="Coautores"
        bodyStyle={{ padding: "10px" }}
        style={{ height: "431px" }}
      >
        <Table
          rowKey="_id"
          dataSource={data}
          scroll={{ y: 220 }}
          bordered={true}
          pagination={{ size: "small" }}
        >
          <Column
            title="Nombre"
            dataIndex="full_name"
            key="_id"
            render={(name, record) => (
              <Link
                to={`/app/authors?${APIKEY}&${DATA}&id=${record._id}`}
                onClick={() =>
                  setCurrentURL(
                    `/app/authors?${APIKEY}&${DATA}&id=${record._id}`
                  )
                }
              >
                {name}
              </Link>
            )}
          />
          <Column
            title="Artículos compartidos"
            dataIndex="count"
            key="count"
            width={130}
            sorter={(a, b) => a.count - b.count}
          />
        </Table>
      </Card>
    </Col>
  );
};

export default CoauthorsList;
