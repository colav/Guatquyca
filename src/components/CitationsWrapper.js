import React, { useEffect, useState } from "react";
import history from "../history";
import ErrorWarning from "./ErrorWarning";
import NetworkChart from "./NetworkChart";
import YearlyCitationsChart from "./YearlyCitationsChart";
import { APIRequest } from "../apis/clustercien";
const queryString = require("query-string");

const CitationsWrapper = () => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "citations";
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [productionURL] = useState(builtURL);
  const [state, setUrl] = APIRequest(builtURL);

  useEffect(() => {
    setUrl(productionURL);
  }, [setUrl, productionURL]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return "";
  }
  const data = {
    yearly_citations: state.data.data.yearly_citations,
    citations: state.data.data.citations,
    H5: state.data.data.H5,
  };
  return (
    <>
      <YearlyCitationsChart
        data={data}
        isLoading={state.isLoading}
        isError={state.isError}
      />
      <NetworkChart
        networkData={state.data.data.network}
        isLoading={state.isLoading}
        isError={state.isError}
      />
    </>
  );
};

export default CitationsWrapper;
