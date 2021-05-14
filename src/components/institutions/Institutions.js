import React, { useEffect, useState } from "react";

/* Components */
import CitationsWrapper from "../CitationsWrapper";
import CoauthorsWrapper from "../CoauthorsWrapper";
import ErrorWarning from "../ErrorWarning";
import InstitutionsTitleCard from "./InstitutionsTitleCard";
import LogoU from "../faculties/LogoU";
import ProductionWrapper from "../ProductionWrapper";
import ListCard from "../ListCard";

/* Utilities */
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";

/* UI Library Components */
const Avatar = require("antd/lib/avatar").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Tabs = require("antd/lib/tabs").default;

/* UI Library Sub-components */
const { TabPane } = Tabs;

/* Icons */
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;

const Institutions = ({ core }) => {
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
    <Row gutter={[15, 15]}>
      {state.data.id === "60120afa4749273de6161883" ? (
        <LogoU />
      ) : (
        <Col xs={0} sm={0} md={6} lg={5} xl={4} xxl={3}>
          <Avatar
            size={200}
            alt="Logo Universidad"
            src={<ReadOutlined style={{ color: "gray", fontSize: "80px" }} />}
            preview="false"
            style={{
              backgroundColor: "white",
              padding: 25,
            }}
          />
        </Col>
      )}
      <InstitutionsTitleCard
        state={state.data}
        setCurrentURL={core.setCurrentURL}
      />
      <Col xs={24}>
        <Tabs defaultActiveKey={key} type="card" tabBarGutter={5} animated>
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

export default Institutions;
