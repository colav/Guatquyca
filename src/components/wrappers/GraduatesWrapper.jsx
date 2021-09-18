import React from "react";

/* Charts */
import DoughnutChart from "../charts/DoughnutChart";
import MapChart from "../charts/MapChart";
import NetworkChart from "../charts/NetworkChart";
import TreeMapChart from "../charts/TreeMapChart";

/* Components */
import CollegesTable from "../CollegesTable";
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import SingleStatistic from "../SingleStatistic";

/* Utilities */
import history from "../../history";
import { APIRequest } from "../../apis/clustercien";
import { infoTexts } from "../../helpers/infoTexts";
const queryString = require("query-string");

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

const GraduatesWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "graduates";
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
          <LoadingCard title={"Información de egresados"} height={"431px"} />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row gutter={[15, 15]}>
        <Col xs={24} lg={6}>
          <DoughnutChart
            data={state.data.data.count_by_level}
            title="Egresados por nivel"
            id="gra_pro_"
            height={400}
            infoText={infoTexts.GraduatesOrg}
          />
        </Col>
        <Col xs={24} lg={6}>
          <DoughnutChart
            data={state.data.data.count_by_type}
            title="Egresados por tipo de organización"
            id="gra_lev_"
            height={400}
            infoText={infoTexts.GraduatesOrg}
          />
        </Col>
        <Col xs={24} lg={12}>
          <MapChart
            rawData={state.data.data.geo}
            title="Localización de egresados autores"
            id="gra_in_"
            height={400}
            infoText={infoTexts.GraduatesGeo}
          />
        </Col>
        <Col span={24}>
          <TreeMapChart
            rawData={state.data.data.count_by_program}
            id="gra_pro_"
            title="Egresados por programa"
            infoText=""
            height={500}
          />
        </Col>

        <Col xs={24} lg={8}>
          <SingleStatistic
            data={state.data.data.papers_count}
            title="Producción total"
            margin={15}
            icon="file"
            infoText={infoTexts.TotalProduction}
          />
          <DoughnutChart
            data={state.data.data.products_by_level}
            title="Producción por nivel educativo"
            id="gra_pro_lev"
            height={459}
            infoText={infoTexts.GraduatesOrg}
          />
        </Col>
        <Col xs={24} lg={16}>
          <TreeMapChart
            rawData={state.data.data.products_by_program}
            id="gra_products_"
            title="Productos por programa"
            infoText=""
            height={578}
          />
        </Col>

        <Col xs={24} lg={12}>
          <NetworkChart
            data={state.data.data.countries_network}
            title="Red de coautoría - Países"
            id="gra_co_"
            height={400}
          />
        </Col>
        <Col xs={24} lg={12}>
          <NetworkChart
            data={state.data.data.institutions_network}
            title="Red de coautoría - Instituciones"
            id="gra_in_"
            height={400}
          />
        </Col>
        <Col span={24}>
          <CollegesTable
            data={state.data.data.colleges}
            core={core}
            parent="gra"
          />
        </Col>
      </Row>
    );
  }
};

export default GraduatesWrapper;
