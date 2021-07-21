import React, { useEffect } from "react";

/* Wrappers */
import CitationsWrapper from "../wrappers/CitationsWrapper";
import CoauthorsWrapper from "../wrappers/CoauthorsWrapper";
import MediaWrapper from "../wrappers/MediaWrapper";
import ProductionWrapper from "../wrappers/ProductionWrapper";

/* Components */
import AuthorsTitleCard from "./AuthorsTitleCard";
import ErrorWarning from "../ErrorWarning";

/* Utilities */
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";
import history from "../../history";
const queryString = require("query-string");

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Tabs = require("antd/lib/tabs").default;

/* UI Library Sub-components */
const { TabPane } = Tabs;

const Authors = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "info";
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [state, setUrl] = APIRequest(builtURL);

  window.addEventListener("popstate", () => {
    core.setCurrentURL(URLBuilder());
  });

  useEffect(() => {
    setUrl(builtURL);
  }, [builtURL, setUrl]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return "";
  }
  return (
    <Row gutter={[15, 15]}>
      <AuthorsTitleCard state={state.data} setCurrentURL={core.setCurrentURL} />
      <Col xs={24}>
        <Tabs
          defaultActiveKey={"production"}
          type="card"
          tabBarGutter={5}
          animated
        >
          <TabPane tab="Producción" key="production" forceRender>
            <ProductionWrapper core={core} />
          </TabPane>
          <TabPane tab="Citaciones" key="citations" forceRender>
            <CitationsWrapper />
          </TabPane>
          <TabPane tab="Coautorías" key="coauthors" forceRender>
            <CoauthorsWrapper core={core} />
          </TabPane>
          <TabPane tab="Noticias" key="news">
            <MediaWrapper />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Authors;
