import React, { useState, useEffect } from "react";

/* Components */
import AuthorsHorizontalList from "./AuthorsHorizontalList";
import DocumentModal from "./DocumentModal";
import DownloadCSVButton from "./DownloadCSVButton";
import DownloadJSONButton from "./DownloadJSONButton";
import ErrorWarning from "./ErrorWarning";
import LoadingCard from "./LoadingCard";
import OpenAccessStatus from "./OpenAccessStatus";
import VennChart from "./VennChart";

/* Utilities */
import history from "../history";
import { APIRequest } from "../apis/clustercien";
import { renderedTitle } from "../helpers/renderedTitle";

/* Icons */
import { CitationsIcon } from "../icons/citations";
import OpenAccessChart from "./OpenAccessChart";
import SortProduction from "./SortProduction";
const CalendarOutlined = require("@ant-design/icons/CalendarOutlined").default;
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const List = require("antd/lib/list").default;
const Modal = require("antd/lib/modal").default;
const Space = require("antd/lib/space").default;
const Typography = require("antd/lib/typography").default;

/* Utilities */
const queryString = require("query-string");

/* UI Library Sub-components */
const { Link } = Typography;

const ProductionWrapper = ({ type, core }) => {
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

  const docInfo = (title, id, status) => {
    Modal.info({
      width: "1200px",
      title: [
        title,
        " ",
        status ? <OpenAccessStatus status={status} key={2} /> : "",
      ],
      closable: true,
      icon: null,
      okText: "Cerrar",
      content: <DocumentModal documentID={id} />,
      onOk() {},
    });
  };

  if (!state.isLoading) {
    setTimeout(() => {
      core.setFilters(state.data.filters);
    }, 50);
  }

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return (
      <>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <LoadingCard title="Open Access" height={"431px"} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <LoadingCard title="Fuentes Bibliográficas" height={"431px"} />
        </Col>
        <Col xs={24}>
          <LoadingCard title="Producción de la Facultad" height={"431px"} />
        </Col>
      </>
    );
  }
  return (
    <>
      <OpenAccessChart data={state.data.open_access} />
      <VennChart data={state.data.venn_source} />
      <Col span={24}>
        <Card
          extra={[
            state.data.total_results
              ? state.data.total_results + " resultados"
              : null,
            <SortProduction key={1} core={core} />,
          ]}
          actions={
            state.data.total_results > 0
              ? [
                  <DownloadCSVButton
                    data={state.data.data}
                    isLoading={state.isLoading}
                  />,
                  <DownloadJSONButton
                    data={state.data.data}
                    isLoading={state.isLoading}
                  />,
                ]
              : ""
          }
          title={`Producción ${renderedTitle(type)}`}
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
                  key={item._id || item.id}
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
                    title={[
                      <Link
                        key={1}
                        onClick={() =>
                          docInfo(
                            item.title,
                            item._id || item.id,
                            item.open_access_status
                          )
                        }
                      >
                        {item.title}
                      </Link>,
                      " ",
                      item.open_access_status ? (
                        <OpenAccessStatus
                          status={item.open_access_status}
                          key={2}
                        />
                      ) : (
                        ""
                      ),
                    ]}
                    description={
                      <div>
                        <ReadOutlined id={item._id} /> {item.source.name}
                      </div>
                    }
                  />
                  Autores:{" "}
                  {AuthorsHorizontalList(item.authors, core.setCurrentURL)}
                </List.Item>
              )}
            ></List>
          </div>
        </Card>
      </Col>
    </>
  );
};

export default ProductionWrapper;
