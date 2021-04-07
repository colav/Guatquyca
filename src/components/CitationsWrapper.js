import React, { useEffect, useState } from "react";
import history from "../history";
import ErrorWarning from "./ErrorWarning";
import LoadingCard from "./LoadingCard";
import NetworkChart from "./NetworkChart";
import YearlyCitationsChart from "./YearlyCitationsChart";
import { APIRequest } from "../apis/clustercien";
const Col = require("antd/lib/col").default;
const queryString = require("query-string");

const CitationsWrapper = () => {
  const w = [24, 24, 12, 8, 8, 8];
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
    return (
      <>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <LoadingCard title={"Citas"} height={"431px"} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <LoadingCard title={"Red de Citaciones"} height={"431px"} />
        </Col>
      </>
    );
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
