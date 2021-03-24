import React, { useEffect } from "react";
import InstitutionsTitleCard from "./InstitutionsTitleCard";
import TabListsCard from "../faculties/TabListsCard";
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import LogoU from "../faculties/LogoU";
import { APIRequest } from "../../apis/clustercien";
import { tabListMaker } from "../../helpers/tabListMaker";
const Row = require("antd/lib/row").default;

const Authors = ({ currentURL, setCurrentURL }) => {
  const [state, setUrl] = APIRequest(currentURL);

  useEffect(() => {
    setUrl(currentURL);
  }, [currentURL, setUrl]);

  const tabList = ["departments", "faculties"];
  const { tabObjects, tabContent } = tabListMaker(tabList, state.data);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <Row gutter={[0, 10]}>
      <LogoU />
      <InstitutionsTitleCard state={state.data} setCurrentURL={setCurrentURL} />
      <TabListsCard
        tabObjects={tabObjects}
        tabContent={tabContent}
        setCurrentURL={setCurrentURL}
      />
    </Row>
  );
};

export default Authors;
