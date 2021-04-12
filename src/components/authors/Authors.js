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

const Authors = ({ props }) => {
  const [state, setUrl] = APIRequest(props.currentURL);

  window.addEventListener("popstate", () => {
    props.setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    setUrl(props.currentURL);
  }, [props.currentURL, setUrl]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <Row gutter={[10, 10]}>
      <LogoU />
      <AuthorsTitleCard
        state={state.data}
        setCurrentURL={props.setCurrentURL}
      />
      <CitationsWrapper />
      <ProductionListCard
        type={state.data.type}
        setCurrentURL={props.setCurrentURL}
      />
    </Row>
  );
};

export default Authors;
