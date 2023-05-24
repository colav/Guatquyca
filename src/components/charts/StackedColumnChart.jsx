import React, { useState, useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* UI Library Components */
import { Card, Select } from "antd";

/* Libraries */
import { Column } from "@ant-design/charts";

/* Utilities */
import { APIRequest } from "../../apis/clustercien";
import { useLocation } from "react-router-dom";

const PLOTLIST = [
  {
    label: "Producción de las facultades según tipo de producto",
    value: "faculty_type",
  },
  {
    label: "Producción de los departamentos según tipo de producto",
    value: "department_type",
  },
  {
    label: "Producción por grupos de investigación según tipo de producto",
    value: "group_type",
  },
  {
    label:
      "Evolución anual de la producción según la clasificación del Scienti",
    value: "year_type",
  },
  { label: "Cantidad de citas anuales", value: "year_citations" },
  { label: "Gastos anuales en APC", value: "year_apc" },
  {
    label: "Número anual de artículos en acceso abierto y cerrado",
    value: "year_oa",
  },
  {
    label:
      "Número de articulos anuales publicados en las editoriales más usadas",
    value: "year_publisher",
  },
  {
    label: "Índice H anual según datos de citación de Google Scholar",
    value: "year_h",
  },
  {
    label:
      "Número anual de productos según categorización de investigadores Minciencias",
    value: "year_researcher",
  },
  {
    label:
      "Número anual de productos según categorización de grupos de investigación Minciencias",
    value: "year_group",
  },
];

const StackedColumnChart = () => {
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState("faculty_type");
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&plot=${selectedPlot}`
  );

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}&plot=${selectedPlot}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlot]);

  let config_normal = {
    data: state.data.plot,
    xField: "x",
    yField: "y",
    appendPadding: [10, 10, 10, 10],
    legend: { layout: "vertical", position: "right" },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
  };

  let config_stacked = {
    data: state.data.plot,
    isStack: true,
    xField: "x",
    yField: "y",
    seriesField: "type",
    appendPadding: [10, 10, 10, 10],
    legend: { layout: "vertical", position: "right" },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
  };

  let config = config_normal;

  const handleChange = (value) => {
    setSelectedPlot(value);
  };

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return (
      <Card
        size="small"
        headStyle={{ backgroundColor: "#003e65", color: "white" }}
        bodyStyle={{ padding: "10px", height: "420px" }}
      >
        <LoadingCard height={"100%"} />
      </Card>
    );
  } else if (state.data.plot !== null) {
    if (state.data?.plot[0]?.type) {
      config = config_stacked;
    }
    return (
      <Card
        size="small"
        headStyle={{ backgroundColor: "#003e65", color: "white" }}
        bodyStyle={{ padding: "10px", height: "420px" }}
        hoverable
        extra={
          <Select
            size="small"
            value={selectedPlot}
            style={{
              width: 420,
            }}
            onChange={handleChange}
            options={PLOTLIST}
          />
        }
      >
        <div className="chart">
          <Column {...config} />
        </div>
      </Card>
    );
  }
};

export default StackedColumnChart;
