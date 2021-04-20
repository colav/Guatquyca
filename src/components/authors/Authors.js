import React, { useEffect } from "react";
import AuthorsTitleCard from "./AuthorsTitleCard";
import CitationsWrapper from "../CitationsWrapper";
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import LogoU from "../faculties/LogoU";
import ProductionListCard from "../ProductionListCard";
import URLBuilder from "../../helpers/URLBuilder";
import { APIRequest } from "../../apis/clustercien";
const Row = require("antd/lib/row").default;

const Authors = ({ core }) => {
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
    return <LoadingCard />;
  }
  return (
    <Row gutter={[10, 10]}>
      <LogoU />
      <AuthorsTitleCard state={state.data} setCurrentURL={core.setCurrentURL} />
      <CitationsWrapper />
      <ProductionListCard type={state.data.type} core={core} />
    </Row>
  );
};

export default Authors;
