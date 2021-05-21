import React from "react";

/* Components */
import DoughnutChart from "./DoughnutChart";
import ErrorWarning from "./ErrorWarning";
import LineChart from "./LineChart";
import LoadingCard from "./LoadingCard";
import TreeMap from "./TreeMap";

/* Utilities */
import history from "../history";
import { APIRequest } from "../apis/clustercien";
const queryString = require("query-string");

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

const APCInfoWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "apc";
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
          <LoadingCard title={"Pagos de APC por año"} height={"431px"} />
        </Col>
      </Row>
    );
  } else {
    const facultyData = {};
    for (const key in state.data.data.faculty) {
      let name = state.data.data.faculty[key].name;
      facultyData[name.slice(12)] = state.data.data.faculty[key].value;
    }

    const departmentData = {};
    for (const key in state.data.data.department) {
      departmentData[state.data.data.department[key].name] =
        state.data.data.department[key].value;
    }

    return (
      <Row gutter={[15, 15]}>
        <LineChart rawData={state.data.data.yearly} />
        <Col xs={24} sm={24} md={12} lg={8}>
          <DoughnutChart
            data={state.data.data.openaccess}
            title="Pagos de APC - tipo de acceso"
            id="apc_oa_"
            currency={true}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <DoughnutChart
            data={facultyData}
            title="Pagos de APC - Facultad"
            id="apc_fa_"
            currency={true}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <DoughnutChart
            data={departmentData}
            title="Pagos de APC - Departamento"
            id="apc_de_"
            currency={true}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <DoughnutChart
            data={state.data.data.publisher}
            title="Pagos de APC - Revistas"
            id="apc_pu_"
            currency={true}
          />
        </Col>
        <Col span={24}>
          <TreeMap rawData={state.data.data.publisher} />
        </Col>
      </Row>
    );
  }
};

export default APCInfoWrapper;
