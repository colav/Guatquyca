"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";
import Flag from "../../ServerSide/Flag/Flag";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { Row, Select, Space, Tooltip } from "antd";
import { TITLES } from "@/lib/constants";

/**
 * SelectFilter is a client-side functional component that provides a select filter for selecting multiple items.
 * It allows users to apply and delete filters based on the selected items.
 *
 * @param {Array} data - The data for the Select component.
 * @param {string} filterType - The type of filter to apply.
 * @returns {JSX.Element} The SelectFilter component.
 */
export default function SelectFilter({ data, filterType }) {
  if (!data.length)
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  const query = useSearchParams();
  const [value, setValue] = useState(
    query.has(filterType) ? query.get(filterType)?.split(",") : null
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
        maxTagCount="responsive"
        optionRender={(item) => (
          <Space>
            <Flag country={item.label} countryCode={item.value} size="20x15" />{" "}
            {item.label}
          </Space>
        )}
        maxTagPlaceholder={(omittedValues) => (
          <Tooltip
            overlayStyle={{
              pointerEvents: "none",
            }}
            title={omittedValues.map(({ label }) => label).join(", ")}
          >
            <span>Ver más</span>
          </Tooltip>
        )}
      />
      <Row justify="end" style={{ marginTop: "12px" }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter value={value} filterType={filterType} query={query} />
      </Row>
    </>
  );
}
