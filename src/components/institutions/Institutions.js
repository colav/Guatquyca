import React, { useEffect, useState } from "react";

/* Components */
import CitationsWrapper from "../CitationsWrapper";
import CoauthorsWrapper from "../CoauthorsWrapper";
import CommonTitleCard from "../CommonTitleCard";
import ErrorWarning from "../ErrorWarning";
import ProductionWrapper from "../ProductionWrapper";
import ListCard from "../ListCard";

/* Utilities */
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Tabs = require("antd/lib/tabs").default;

/* UI Library Sub-components */
const { TabPane } = Tabs;

const Institutions = ({ core }) => {
  const [state, setUrl] = APIRequest(core.currentURL);
  const [key, setKey] = useState("0");

  window.addEventListener("popstate", () => {
    core.setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    setUrl(core.currentURL);
  }, [core.currentURL, setUrl]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return "";
  }
  return (
    <Row gutter={[15, 15]}>
      <CommonTitleCard
        title={state.data.name}
        abbreviation={state.data.abbreviations}
        external_urls={state.data.external_urls}
        institution={state.data.logo}
        setCurrentURL={core.setCurrentURL}
      />
      <Col xs={24}>
        <Tabs defaultActiveKey={key} type="card" tabBarGutter={5} animated>
          <TabPane tab="Producción" key="0" forceRender>
            <ProductionWrapper
              type={state.data.type}
              core={core}
              setKey={setKey}
            />
          </TabPane>
          <TabPane tab="Citaciones" key="1" forceRender>
            <CitationsWrapper />
          </TabPane>
          <TabPane tab="Afiliaciones" key="2">
            <Row gutter={15}>
              <ListCard
                title={"departments"}
                list={state.data.departments}
                setCurrentURL={core.setCurrentURL}
              />
              <ListCard
                title={"faculties"}
                list={state.data.faculties}
                setCurrentURL={core.setCurrentURL}
              />
            </Row>
          </TabPane>
          <TabPane tab="Coautorías" key="3" forceRender>
            <CoauthorsWrapper core={core} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Institutions;
