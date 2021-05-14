import React, { useEffect, useState } from "react";

/* Components */
import CitationsWrapper from "../CitationsWrapper";
import CoauthorsWrapper from "../CoauthorsWrapper";
import ErrorWarning from "../ErrorWarning";
import GroupTitleCard from "./GroupsTitleCard";
import LogoU from "../faculties/LogoU";
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

const Groups = ({ core }) => {
  const [state, setUrl] = APIRequest(core.currentURL);
  const [key, setKey] = useState("1");

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
    <Row gutter={[10, 15]}>
      <LogoU />
      <GroupTitleCard
        title={state.data.name}
        external_urls={state.data.external_urls}
        subtitle={state.data.institution[0].name}
        setCurrentURL={core.setCurrentURL}
      />
      <Col xs={24}>
        <Tabs defaultActiveKey={key} type="card" tabBarGutter={5} animated>
          <TabPane tab="Citaciones" key="1" forceRender>
            <CitationsWrapper />
          </TabPane>
          <TabPane tab="Afiliaciones" key="2">
            <Row gutter={[15, 15]}>
              <ListCard
                title={"authors"}
                list={state.data.authors}
                setCurrentURL={core.setCurrentURL}
              />
            </Row>
          </TabPane>
          <TabPane tab="Coautorías" key="3" forceRender>
            <CoauthorsWrapper core={core} />
          </TabPane>
          <TabPane tab="Producción" key="4" forceRender>
            <ProductionWrapper
              type={state.data.type}
              core={core}
              setKey={setKey}
            />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Groups;
