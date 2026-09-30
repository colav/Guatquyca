"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";
import Flag from "../../ServerSide/Flag/Flag";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Row, Select, Space, Tag } from "antd";
import { TITLES } from "@/lib/constants";

/* Utils */
import { formatNumber } from "@/lib/utils/formatNumber";

/**
 * CountrySelectFilter is a client-side functional component that provides a select filter for selecting multiple items.
 * It allows users to apply and delete filters based on the selected items.
 *
 * @param {Array} data - The data for the Select component.
 * @param {string} filterType - The type of filter to apply.
 * @returns {JSX.Element} The SelectFilter component.
 */
export default function CountrySelectFilter({ data, filterType }) {
  if (!data.length)
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  const query = useSearchParams();
  const [value, setValue] = useState(
    query.has(filterType) ? query.get(filterType)?.split(",") : null,
  );

  const onChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Select
        size="small"
        mode="multiple"
        optionFilterProp="label"
        showSearch
        style={{ width: "100%" }}
        value={value}
        listHeight={400}
        placeholder={`Selecciona uno o más ${TITLES[filterType]}`}
        onChange={onChange}
        options={data}
        optionRender={(item) => (
          <Row justify="space-between" style={{ width: "100%" }}>
            <Col span={19} className={styles.optionLabel}>
              <Space>
                <Flag
                  country={item.label}
                  countryCode={item.value}
                  size="20x15"
                />{" "}
                {item.label}
              </Space>
            </Col>
            <Tag bordered={false} style={{ marginRight: 2 }}>
              {formatNumber(item.data.count)}
            </Tag>
          </Row>
        )}
      />
      <Row justify="end" style={{ marginTop: "12px" }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter value={value} filterType={filterType} query={query} />
      </Row>
    </>
  );
}
