import React from "react";
import ErrorWarning from "./ErrorWarning";
import history from "../history";
import AuthorsHorizontalList from "./AuthorsHorizontalList";
import { APIRequest } from "../apis/clustercien";
import { renderedTitle } from "../helpers/renderedTitle";
import { CitationsIcon } from "../icons/citations";
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const List = require("antd/lib/list").default;
const Space = require("antd/lib/space").default;
const CalendarOutlined = require("@ant-design/icons/CalendarOutlined").default;
const queryString = require("query-string");

const ProductionListCard = ({ type, setCurrenURL }) => {
  let parsed = queryString.parse(history.location.search);
  parsed["data"] = "production";
  const productionURL = `${history.location.pathname}?${queryString.stringify(
    parsed
  )}`;
  const [state] = APIRequest(productionURL);

  if (state.isError) {
    return <ErrorWarning />;
  } else
    return (
      <Col span={24}>
        <Card
          title={`Producción ${renderedTitle(type)}`}
          loading={state.isLoading}
        >
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              size: "small",
              position: "bottom",
              hideOnSinglePage: true,
            }}
            dataSource={state.data.data}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                actions={[
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CalendarOutlined)}
                    Publicado: {item.year_published}
                  </Space>,
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CitationsIcon)}
                    {item.citations_count === 1
                      ? `${item.citations_count} citación`
                      : `${item.citations_count} citaciones`}
                  </Space>,
                ]}
              >
                <List.Item.Meta title={item.title} />
                Autores: {AuthorsHorizontalList(item.authors, setCurrenURL)}
              </List.Item>
            )}
          ></List>
        </Card>
      </Col>
    );
};

export default ProductionListCard;
