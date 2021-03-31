import React, { useEffect } from "react";
import ErrorWarning from "../ErrorWarning";
import FacultyTitleCard from "./FacultiesTitleCard";
import LoadingCard from "../LoadingCard";
import LogoU from "./LogoU";
import ProductionListCard from "../ProductionListCard";
import TabListsCard from "../TabListsCard";
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";
import { tabListMaker } from "../../helpers/tabListMaker";
const Row = require("antd/lib/row").default;

const Faculties = ({ currentURL, setCurrentURL }) => {
  const [state, setUrl] = APIRequest(currentURL);

  window.addEventListener("popstate", () => {
    setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    setUrl(currentURL);
  }, [currentURL, setUrl]);

  const tabList = ["departments", "groups", "authors"];
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
        <FacultyTitleCard
          title={state.data.name}
          abbreviation={state.data.abbreviations}
          external_urls={state.data.external_urls}
          subtitle={state.data.institution[0].name}
          setCurrentURL={setCurrentURL}
        />
        <TabListsCard
          tabObjects={tabObjects}
          tabContent={tabContent}
          setCurrentURL={setCurrentURL}
        />
        <ProductionListCard
          type={state.data.type}
          setCurrenURL={setCurrentURL}
        />
      </Row>
    </div>
  );
};

export default Faculties;
