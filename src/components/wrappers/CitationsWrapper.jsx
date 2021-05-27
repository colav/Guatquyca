import React, { useEffect, useState } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* Charts */
import YearlyCitationsChart from "../charts/YearlyCitationsChart";

/* Utilities */
import history from "../../history";
import { APIRequest } from "../../apis/clustercien";
const queryString = require("query-string");

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

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
    return (
      <>
        <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
          <LoadingCard title={"Citas"} height={"431px"} />
        </Col>
      </>
    );
  }
  return (
    <Row gutter={10}>
      <YearlyCitationsChart
        data={state.data.data}
        isLoading={state.isLoading}
        isError={state.isError}
      />
    </Row>
  );
};

export default CitationsWrapper;
