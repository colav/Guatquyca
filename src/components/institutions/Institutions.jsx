import React, { useEffect } from "react";

/* Wrappers */
import APCInfoWrapper from "../wrappers/APCInfoWrapper";
import CitationsWrapper from "../wrappers/CitationsWrapper";
import CoauthorsWrapper from "../wrappers/CoauthorsWrapper";
import GraduatesWrapper from "../wrappers/GraduatesWrapper";
import MediaWrapper from "../wrappers/MediaWrapper";
import ProductionWrapper from "../wrappers/ProductionWrapper";

/* Components */
import CommonTitleCard from "../CommonTitleCard";
import ErrorWarning from "../ErrorWarning";
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
        logo={state.data.logo}
        setCurrentURL={core.setCurrentURL}
      />
      <Col xs={24}>
        <Tabs defaultActiveKey={0} type="card" tabBarGutter={5} animated>
          <TabPane tab="Producción" key="0" forceRender>
            <ProductionWrapper core={core} />
          </TabPane>
          <TabPane tab="Citaciones" key="1" forceRender>
            <CitationsWrapper />
          </TabPane>
          <TabPane tab="Afiliaciones" key="2">
            <Row gutter={15}>
              <Col xs={24} md={12}>
                <ListCard
                  title={"departments"}
                  list={state.data.departments}
                  setCurrentURL={core.setCurrentURL}
                />
              </Col>
              <Col xs={24} md={12}>
                <ListCard
                  title={"faculties"}
                  list={state.data.faculties}
                  setCurrentURL={core.setCurrentURL}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Coautorías" key="3" forceRender>
            <CoauthorsWrapper core={core} />
          </TabPane>
          <TabPane tab="APC" key="4" forceRender>
            <APCInfoWrapper core={core} />
          </TabPane>
          <TabPane tab="Egresados" key="5" forceRender>
            <GraduatesWrapper core={core} />
          </TabPane>
          <TabPane tab="Noticias" key="6" forceRender>
            <MediaWrapper />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Institutions;
