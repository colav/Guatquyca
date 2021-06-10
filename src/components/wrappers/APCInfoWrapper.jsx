import React from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* Charts */
import DoughnutChart from "../charts/DoughnutChart";
import LineChartCard from "../charts/LineChartCard";
import TreeMapChart from "../charts/TreeMapChart";

/* Utilities */
import history from "../../history";
import { APIRequest } from "../../apis/clustercien";
const queryString = require("query-string");

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;

const APCInfoWrapper = () => {
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
      facultyData[name.replace("Facultad de", "Fac.")] =
        state.data.data.faculty[key].value;
    }

    const departmentData = {};
    for (const key in state.data.data.department) {
      let name = state.data.data.department[key].name;
      departmentData[name.replace("Departamento de", "Depto.")] =
        state.data.data.department[key].value;
    }

    return (
      <Row gutter={[15, 15]}>
        <LineChartCard rawData={state.data.data.yearly} />
        <Col xs={24} sm={24} md={24} lg={8}>
          <DoughnutChart
            data={state.data.data.openaccess}
            title="Pagos de APC - tipo de acceso"
            id="apc_oa_"
            currency={true}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <DoughnutChart
            data={facultyData}
            title="Pagos de APC - Facultades"
            id="apc_fa_"
            currency={true}
            height={500}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <DoughnutChart
            data={departmentData}
            title="Pagos de APC - Departamentos"
            id="apc_de_"
            currency={true}
            height={500}
          />
        </Col>
        <Col span={24}>
          <TreeMapChart
            rawData={state.data.data.group}
            id="apc_gr_"
            title="Pagos de APC - Grupos"
          />
        </Col>
        <Col span={24}>
          <TreeMapChart
            rawData={state.data.data.publisher}
            id="apc_pu_"
            title="Pagos de APC - Editoriales"
          />
        </Col>
      </Row>
    );
  }
};

export default APCInfoWrapper;
