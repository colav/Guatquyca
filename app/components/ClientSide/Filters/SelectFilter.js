"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Row, Select, Tag } from "antd";
import { TITLES } from "@/lib/constants";

/* Utils */
import { formatNumber } from "@/lib/utils/formatNumber";

const parseSelectedValues = (param, options) => {
  const selectedValues = [];
  let remainingParam = param;
  const optionValues = options
    .map(({ value }) => String(value))
    .sort((firstValue, secondValue) => secondValue.length - firstValue.length);

  while (remainingParam) {
    const selectedValue = optionValues.find(
      (optionValue) =>
        remainingParam === optionValue ||
        remainingParam.startsWith(`${optionValue},`),
    );

    if (!selectedValue) return param.split(",");

    selectedValues.push(selectedValue);
    remainingParam = remainingParam.slice(selectedValue.length);

    if (remainingParam.startsWith(",")) {
      remainingParam = remainingParam.slice(1);
    }
  }

  return selectedValues;
};

/**
 * SelectFilter is a client-side functional component that provides a select filter
 * for selecting multiple items. It allows users to apply and delete filters.
 *
 * @param {Array} data - The options for the Select component.
 * @param {string} filterType - The filter key used in query parameters.
 * @returns {JSX.Element} The rendered SelectFilter component.
 */
export default function SelectFilter({ data = [], filterType }) {
  const query = useSearchParams();

  const filteredData = data
    .map((item) => ({
      ...item,
      label: item.label ?? item.title,
    }))
    .filter(({ label, value }) => label != null && value != null);

  if (!filteredData.length) {
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  }

  const [value, setValue] = useState(() => {
    const param = query.get(filterType);
    return param ? parseSelectedValues(param, filteredData) : null;
  });

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Select
        size="small"
        mode="multiple"
        showSearch
        optionFilterProp="label"
        style={{ width: "100%" }}
        placeholder={`Selecciona uno o más ${TITLES[filterType] || "ítems"}`}
        value={value}
        onChange={handleChange}
        options={filteredData}
        listHeight={400}
        optionRender={(item) => (
          <Row justify="space-between" style={{ width: "100%" }}>
            <Col span={19} className={styles.optionLabel}>
              {item.label}
            </Col>
            <Tag bordered={false} style={{ marginRight: 2 }}>
              {formatNumber(item.data.count)}
            </Tag>
          </Row>
        )}
      />
      <Row justify="end" style={{ marginTop: 12 }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter value={value} filterType={filterType} query={query} />
      </Row>
    </>
  );
}
