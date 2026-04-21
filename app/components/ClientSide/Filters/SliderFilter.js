"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { Row, Slider } from "antd";

/**
 * SliderFilter component for filtering data using a range slider.
 *
 * @component
 * @param {Object} data - Data object containing min/max values for the slider
 * @param {number} [data.min_weeks] - Minimum value for weeks (optional)
 * @param {number} [data.max_weeks] - Maximum value for weeks (optional)
 * @param {number} [data.min_apc] - Minimum value for APC (optional)
 * @param {number} [data.max_apc] - Maximum value for APC (optional)
 * @param {string} filterType - The filter type key used in query params
 * @returns {JSX.Element} The rendered slider filter component
 */
export default function SliderFilter({ data, filterType }) {
  const query = useSearchParams();

  if (!data) {
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  }

  const [value, setValue] = useState(() => {
    const param = query.get(filterType);
    return param ? param.split(",") : null;
  });

  const onChangeComplete = (value) => {
    console.log("onChangeComplete: ", value);
    setValue(value);
  };

  return (
    <>
      <Slider
        min={data.min_weeks || 0}
        max={data.max_weeks || data.max_apc}
        defaultValue={[data.min_weeks || 0, data.max_weeks || data.max_apc]}
        range
        step={1}
        tooltip={{ color: "white", styles: { body: { color: "black" } } }}
        onChangeComplete={onChangeComplete}
      />
      <Row justify="end" style={{ marginTop: 12 }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter value={value} filterType={filterType} query={query} />
      </Row>
    </>
  );
}
