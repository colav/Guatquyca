import React from "react";

/* Components */
import CoauthorsList from "./CoauthorsList";

/* Charts */
import MapChart from "./charts/MapChart";
import NetworkChart from "./charts/NetworkChart";
import WordCloudChartCard from "./charts/WordCloudChartCard";

/* Utilities */
import history from "../history";
import { APIRequest } from "../apis/clustercien";
const queryString = require("query-string");

/* UI Library Components */
const Row = require("antd/lib/row").default;
const Col = require("antd/lib/col").default;
const Spin = require("antd/lib/spin").default;

const CollegeModal = ({ id, core, parent }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parent === "col"
    ? (parsedGlobalURL["data"] = "college")
    : (parsedGlobalURL["data"] = "graduates_college");
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}&icid=${id}`;
  const [state] = APIRequest(builtURL);

  if (state.isLoading) {
    return <Spin />;
  } else if (parent === "col") {
    return (
      <Row gutter={[5, 5]}>
        <MapChart
          rawData={state.data.data.geo}
          title="Mapa de colaboración"
          id="col_in_"
        />
        <CoauthorsList
          data={state.data.data.institution_coauthorship_count}
          setCurrentURL={core.setCurrentURL}
        />
        <Col xs={24} md={12}>
          <NetworkChart
            data={state.data.data.citation_network}
            title="Red de Citaciones"
            id="col_ci_"
          />
        </Col>
        <Col xs={24} md={12}>
          <NetworkChart
            data={state.data.data.coauthors_network}
            title="Red de Coautorías"
            id="col_co_"
          />
        </Col>
      </Row>
    );
  } else if (parent === "gra") {
    return (
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}>
          <NetworkChart
            data={state.data.data.coauthors_network}
            title="Red de Coautorías"
            id="col_co_"
            height={400}
          />
        </Col>
        <Col xs={24} md={12}>
          <WordCloudChartCard
            data={state.data.data.word_cloud}
            title="Nube de palabras"
            id="col_gra_mod"
            height={400}
          />
        </Col>
      </Row>
    );
  }
};

export default CollegeModal;
