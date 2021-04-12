import React, { useEffect } from "react";
import CitationsWrapper from "../CitationsWrapper";
import ErrorWarning from "../ErrorWarning";
import GroupTitleCard from "./GroupsTitleCard";
import LoadingCard from "../LoadingCard";
import LogoU from "../faculties/LogoU";
import ProductionListCard from "../ProductionListCard";
import TabListsCard from "../TabListsCard";
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";
import { tabListMaker } from "../../helpers/tabListMaker";
const Row = require("antd/lib/row").default;

const Groups = ({ props }) => {
  const [state, setUrl] = APIRequest(props.currentURL);

  window.addEventListener("popstate", () => {
    props.setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    setUrl(props.currentURL);
  }, [props.currentURL, setUrl]);

  const tabList = ["authors"];
  const { tabObjects, tabContent } = tabListMaker(tabList, state.data);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={[10, 10]}>
        <LogoU />
        <GroupTitleCard
          title={state.data.name}
          external_urls={state.data.external_urls}
          subtitle={state.data.institution[0].name}
          setCurrentURL={props.setCurrentURL}
        />
        <CitationsWrapper />
        <TabListsCard
          tabObjects={tabObjects}
          tabContent={tabContent}
          setCurrentURL={props.setCurrentURL}
        />
        <ProductionListCard
          type={state.data.type}
          setCurrentURL={props.setCurrentURL}
        />
      </Row>
    </div>
  );
};

export default Groups;
