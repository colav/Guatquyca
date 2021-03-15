import React, { useEffect } from "react";
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import LogoU from "./LogoU";
import TabListsCard from "./TabListsCard";
import FacultyTitleCard from "./FacultiesTitleCard";
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";
import { renderedTitle } from "../../helpers/renderedTitle";
const Row = require("antd/lib/row").default;

const Faculties = ({ currentURL, setCurrentURL }) => {
  useEffect(() => {
    setCurrentURL(URLBuilder);
  }, [setCurrentURL]);

  const fixedURL = "/api" + currentURL.slice(4);
  const [state, setUrl] = APIRequest(fixedURL);

  useEffect(() => {
    setUrl(currentURL);
  }, [currentURL, setUrl]);

  const tabList = Object.keys(state.data).filter(
    (key) =>
      key !== "name" &&
      key !== "external_urls" &&
      key !== "id" &&
      key !== "type" &&
      key !== "abbreviations" &&
      key !== "institution"
  );
  let tabObjects = [];
  for (let i = 0; i < tabList.length; i++) {
    tabObjects.push({ key: tabList[i], tab: renderedTitle(tabList[i]) });
  }
  let tabContent = {};
  for (let i = 0; i < tabList.length; i++) {
    tabContent[tabList[i]] = state.data[tabList[i]];
  }

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
          extlink={
            state.data.external_urls[0] !== undefined
              ? state.data.external_urls[0].url
              : ""
          }
          subtitle={state.data.institution[0].name}
        />
        <TabListsCard tabObjects={tabObjects} tabContent={tabContent} />
      </Row>
    </div>
  );
};

export default Faculties;
