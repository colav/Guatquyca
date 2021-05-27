import React from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import CoauthorsList from "../CoauthorsList";
import LoadingCard from "../LoadingCard";

/* Charts */
import MapChart from "../charts/MapChart";
import NetworkChart from "../charts/NetworkChart";

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
  } else {
    return (
      <Row gutter={[15, 15]}>
        {state.data.data.geo.length > 0 ? (
          <MapChart
            rawData={state.data.data.geo}
            title="Alcance Geográfico"
            id="coa_in_"
          />
        ) : (
          ""
        )}
        <CoauthorsList
          data={state.data.data.coauthors || state.data.data.institutions}
          setCurrentURL={core.setCurrentURL}
        />
        {state.data.data.institution_network ||
        state.data.data.institutions_network ? (
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <NetworkChart
              data={
                state.data.data.institution_network ||
                state.data.data.institutions_network
              }
              setup={{
                title: "Red de coautoría - Instituciones",
                id: "coa_in_",
              }}
            />
          </Col>
        ) : (
          ""
        )}
        {state.data.data.faculties_network ? (
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <NetworkChart
              data={state.data.data.faculties_network}
              setup={{
                title: "Red de coautoría - Facultades",
                id: "coa_fa_",
              }}
            />
          </Col>
        ) : (
          ""
        )}
        {state.data.data.coauthors_network ? (
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <NetworkChart
              data={state.data.data.coauthors_network}
              setup={{
                title: "Red de coautoría - Autores",
                id: "coa_au_",
              }}
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
