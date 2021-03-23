import React, { useEffect } from "react";
import AuthorsTitleCard from "./AuthorsTitleCard";
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import LogoU from "../faculties/LogoU";
import { APIRequest } from "../../apis/clustercien";
const Row = require("antd/lib/row").default;

const Authors = ({ currentURL, setCurrentURL }) => {
  const [state, setUrl] = APIRequest(currentURL);

  useEffect(() => {
    setUrl(currentURL);
  }, [currentURL, setUrl]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={[10, 10]}>
        <LogoU />
        <AuthorsTitleCard state={state.data} setCurrentURL={setCurrentURL} />
      </Row>
    </div>
  );
};

export default Authors;
