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

const Groups = ({ core }) => {
  const [state, setUrl] = APIRequest(core.currentURL);

  window.addEventListener("popstate", () => {
    core.setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    setUrl(core.currentURL);
  }, [core.currentURL, setUrl]);

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
          setCurrentURL={core.setCurrentURL}
        />
        <CitationsWrapper />
        <TabListsCard
          tabObjects={tabObjects}
          tabContent={tabContent}
          setCurrentURL={core.setCurrentURL}
        />
        <ProductionListCard type={state.data.type} core={core} />
      </Row>
    </div>
  );
};

export default Groups;
