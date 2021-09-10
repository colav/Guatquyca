import React from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import CoauthorsList from "../CoauthorsList";
import LoadingCard from "../LoadingCard";

/* Charts */
import MapChart from "../charts/MapChart";
import GraphChart from "../charts/GraphChart";

/* Utilities */
import history from "../../history";
import { APIRequest } from "../../apis/clustercien";
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
      <Row gutter={[15, 15]}>
        <Col span={24}>
          <LoadingCard title={"Información de Coautorías"} height={"431px"} />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row gutter={[15, 15]}>
        {state.data.data.geo.length > 0 ? (
          <MapChart
            rawData={state.data.data.geo}
            title="Alcance Geográfico"
            id="coa_in_"
            height={639}
          />
        ) : (
          ""
        )}
        <CoauthorsList
          data={state.data.data.coauthors || state.data.data.institutions}
          setCurrentURL={core.setCurrentURL}
          height={700}
        />
        {state.data.data.coauthors_network ? (
          <Col xs={24} lg={12}>
            <GraphChart
              data={state.data.data.coauthors_network}
              title="Red de coautoría - Autores"
              type="authors"
            />
          </Col>
        ) : (
          ""
        )}
        {state.data.data.institution_network ? (
          <Col xs={24} lg={12}>
            <GraphChart
              data={state.data.data.institution_network}
              title="Red de coautoría - Instituciones"
              type="institutions"
            />
          </Col>
        ) : (
          ""
        )}
      </Row>
    );
  }
};

export default CoauthorsWrapper;
