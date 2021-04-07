import React, { useState, useEffect } from "react";
import AuthorsHorizontalList from "./AuthorsHorizontalList";
import DownloadCSVButton from "./DownloadCSVButton";
import DownloadPDFButton from "./DownloadPDFButton";
import ErrorWarning from "./ErrorWarning";
import history from "../history";
import { APIRequest } from "../apis/clustercien";
import { CitationsIcon } from "../icons/citations";
import { renderedTitle } from "../helpers/renderedTitle";
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const List = require("antd/lib/list").default;
const Space = require("antd/lib/space").default;
const CalendarOutlined = require("@ant-design/icons/CalendarOutlined").default;
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;
const queryString = require("query-string");

const ProductionListCard = ({ type, setCurrenURL }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "production";
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}&max=10&page=1`;
  const [productionURL, setProductionURL] = useState(builtURL);
  const [state, setUrl] = APIRequest(builtURL);
  let parsedLocalURL = queryString.parseUrl(productionURL);

  useEffect(() => {
    setUrl(productionURL);
  }, [setUrl, productionURL]);

  const onPageChange = (page, pageSize) => {
    let newQuery = {
      ...parsedLocalURL.query,
      max: pageSize.toString(),
      page: page.toString(),
    };
    setProductionURL(
      `${parsedLocalURL.url}?${queryString.stringify(newQuery)}`
    );
    window.scrollTo(0, 650);
  };

  if (state.isError) {
    return <ErrorWarning />;
  } else
    return (
      <Col span={24}>
        <Card
          actions={[
            <DownloadCSVButton
              data={state.data.data}
              isLoading={state.isLoading}
            />,
            <DownloadPDFButton
              data={state.data.data}
              isLoading={state.isLoading}
            />,
          ]}
          title={`Producción ${renderedTitle(type)}`}
          loading={state.isLoading}
        >
          <div id="productionListContainer">
            <List
              itemLayout="vertical"
              size="small"
              pagination={{
                size: "small",
                position: "bottom",
                total: state.data.total_results,
                onChange: onPageChange,
                hideOnSinglePage: true,
                current: parseInt(parsedLocalURL.query.page),
                pageSize: parsedLocalURL.query.max,
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
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div>
                        <ReadOutlined id={item._id} /> {item.source.name}
                      </div>
                    }
                  />
                  Autores: {AuthorsHorizontalList(item.authors, setCurrenURL)}
                </List.Item>
              )}
            ></List>
          </div>
        </Card>
      </Col>
    );
};

export default ProductionListCard;
