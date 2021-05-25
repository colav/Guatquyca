import React from "react";

/* Utilities */
import history from "../history";
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Table = require("antd/lib/table").default;

/* UI Library Sub-components */
const { Column } = Table;

const CoauthorsList = ({ data, setCurrentURL }) => {
  const type = history.location.pathname;

  if (type === "/app/institutions") {
    return (
      <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
        <Card
          size="small"
          title="Lista de Coautorías"
          bodyStyle={{ padding: "10px" }}
          style={{ height: "662px" }}
        >
          <Table
            rowKey="id"
            dataSource={data}
            scroll={{ y: 470 }}
            bordered={true}
            pagination={{ size: "small" }}
          >
            <Column
              title="Nombre"
              dataIndex={"name"}
              key={"id"}
              render={(name, record) => (
                <Link
                  to={`/app/institutions?${APIKEY}&${DATA}&id=${record.id}`}
                  onClick={() =>
                    setCurrentURL(
                      `/app/institutions?${APIKEY}&${DATA}&id=${record.id}`
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
            />
          </Table>
        </Card>
      </Col>
    );
  }

  return (
    <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
      <Card
        size="small"
        title="Lista de Coautorías"
        bodyStyle={{ padding: "10px" }}
        style={{ height: "662px" }}
      >
        <Table
          rowKey="id"
          dataSource={data}
          scroll={{ y: 470 }}
          bordered={true}
          pagination={{ size: "small" }}
        >
          <Column
            title="Nombre"
            dataIndex={"full_name"}
            key={"id"}
            render={(name, record) => (
              <Link
                to={`/app/authors?${APIKEY}&${DATA}&id=${record.id}`}
                onClick={() =>
                  setCurrentURL(
                    `/app/authors?${APIKEY}&${DATA}&id=${record.id}`
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
          />
        </Table>
      </Card>
    </Col>
  );
};

export default CoauthorsList;