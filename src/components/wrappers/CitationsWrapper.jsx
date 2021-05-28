import React, { useEffect, useState } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import SingleStatistic from "../SingleStatistic";

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
      <Row gutter={[15, 15]}>
        <Col span={24}>
          <LoadingCard title={"Información de citas"} height={"431px"} />
        </Col>
      </Row>
    );
  }
  return (
    <Row gutter={[10, 10]}>
      <Col xs={24} lg={5}>
        <SingleStatistic
          data={state.data.data.citations}
          title="Citas Totales:"
          margin={15}
          icon="citations"
          infoText="Texto informativo para la cantidad de citas totales."
        />
        <SingleStatistic
          data={state.data.data.H}
          title="Índice H:"
          margin={15}
          icon="line"
          infoText="Texto informativo para el índice H"
        />
        <SingleStatistic
          data={state.data.data.H5}
          title="Índice H5:"
          margin={15}
          icon="line"
          infoText="Texto informativo para el índice H5"
        />
      </Col>
      <Col xs={24} lg={19}>
        <YearlyCitationsChart
          data={state.data.data}
          isLoading={state.isLoading}
          isError={state.isError}
        />
      </Col>
    </Row>
  );
};

export default CitationsWrapper;
