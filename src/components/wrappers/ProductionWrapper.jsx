import React, { useState, useEffect } from "react";

/* Components */
import DocumentList from "../DocumentList";
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* Charts */
import DoughnutChart from "../charts/DoughnutChart";
import VennChart from "../charts/VennChart";

/* Utilities */
import history from "../../history";
import { APIRequest } from "../../apis/clustercien";

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

/* Utilities */
const queryString = require("query-string");

const ProductionWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "production";
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [productionURL] = useState(builtURL);
  const [state, setUrl] = APIRequest(builtURL);

  useEffect(() => {
    setUrl(productionURL);
  }, [setUrl, productionURL]);

  if (!state.isLoading) {
    setTimeout(() => {
      core.setFilters(state.data.filters);
    }, 10);
  }

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return (
      <Row gutter={[15, 15]}>
        <Col xs={24} sm={24} md={12}>
          <LoadingCard title="Open Access" height={"431px"} />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <LoadingCard title="Fuentes Bibliográficas" height={"431px"} />
        </Col>
        <Col xs={24}>
          <LoadingCard title="Producción de la Facultad" height={"431px"} />
        </Col>
      </Row>
    );
  }
  return (
    <Row gutter={[15, 15]}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <DoughnutChart
          data={state.data.open_access}
          title="Open Access"
          id="pro_oa_"
        />
      </Col>
      <VennChart data={state.data.venn_source} />
      <Col span={24}>
        <DocumentList
          data={state.data}
          core={core}
          parsedURL={parsedGlobalURL}
        />
      </Col>
    </Row>
  );
};

export default ProductionWrapper;
