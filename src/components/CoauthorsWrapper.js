import React from "react";

/* Components */
import ErrorWarning from "./ErrorWarning";
import CoauthorsList from "./CoauthorsList";
import LoadingCard from "./LoadingCard";
import NetworkChart from "./NetworkChart";

/* Utilities */
import history from "../history";
import { APIRequest } from "../apis/clustercien";
const queryString = require("query-string");

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

const CoauthorsWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "coauthors";
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [state] = APIRequest(builtURL);

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return (
      <Row gutter={10}>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <LoadingCard
            title={"Red de coautoría - Instituciones"}
            height={"431px"}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <LoadingCard title={"Coautores"} height={"431px"} />
        </Col>
      </Row>
    );
  }
  return (
    <Row gutter={10}>
      <NetworkChart
        networkData={state.data.data.institution_network}
        setup={{
          title: "Red de coautoría - Instituciones",
          id: "coaInst_",
        }}
      />
      <CoauthorsList
        data={state.data.data.coauthors}
        setCurrentURL={core.setCurrentURL}
      />
    </Row>
  );
};

export default CoauthorsWrapper;
