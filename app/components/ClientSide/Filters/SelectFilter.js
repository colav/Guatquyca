"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { Col, Row, Select, Tag } from "antd";
import { TITLES } from "@/lib/constants";

/* Styles */
import styles from "./styles.module.css";

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

  const filteredData = data.filter(
    ({ label, value }) => label != null && value != null
  );

  if (!filteredData.length) {
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  }

  const [value, setValue] = useState(() => {
    const param = query.get(filterType);
    return param ? param.split(",") : null;
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
            <Col xs={19} md={20} className={styles.optionLabel}>
              {item.label}
            </Col>
            <Tag bordered={false} style={{ marginRight: 2 }}>
              {item.data.count}
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
