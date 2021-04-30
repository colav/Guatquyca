import React, { useEffect } from "react";

/* Components */
import CitationsWrapper from "../CitationsWrapper";
import ErrorWarning from "../ErrorWarning";
import InstitutionsTitleCard from "./InstitutionsTitleCard";
import LoadingCard from "../LoadingCard";
import LogoU from "../faculties/LogoU";
import ProductionWrapper from "../ProductionWrapper";
import TabListsCard from "../TabListsCard";

/* Utilities */
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";
import { tabListMaker } from "../../helpers/tabListMaker";

/* UI Library Components */
const Avatar = require("antd/lib/avatar").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

/* Icons */
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;

const Authors = ({ core }) => {
  const [state, setUrl] = APIRequest(core.currentURL);

  window.addEventListener("popstate", () => {
    core.setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    setUrl(core.currentURL);
  }, [core.currentURL, setUrl]);

  const tabList = ["faculties", "departments"];
  const { tabObjects, tabContent } = tabListMaker(tabList, state.data);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={[10, 10]}>
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
        <CitationsWrapper />
        <TabListsCard
          tabObjects={tabObjects}
          tabContent={tabContent}
          setCurrentURL={core.setCurrentURL}
        />
        <ProductionWrapper type={state.data.type} core={core} />
      </Row>
    </div>
  );
};

export default Authors;
