"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { ConfigProvider, DatePicker, Row } from "antd";

/* Utils */
import dayjs from "dayjs";

/* UI Library Sub-Components */
const { RangePicker } = DatePicker;

/**
 * YearRangeFilter component allows users to filter products by a range of years using a DatePicker component.
 * The user can select a range of years and apply the filter to see only the products that match the selected range.
 *
 * @param {Object} data - The data containing the min and max years.
 * @returns {JSX.Element} The YearRangeFilter component.
 */
export default function YearRangeFilter({ data }) {
  if (Object.keys(data).length === 0)
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  const query = useSearchParams();
  const [value, setValue] = useState(
    query.has("years") ? query.get("years")?.split(",") : null
  );

  const disabledDate = (current) => {
    return current.year() < data.min_year || current.year() > data.max_year;
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Calendar: {
              yearControlWidth: 30,
            },
          },
        }}
      >
        <RangePicker
          size="small"
          style={{ width: "100%" }}
          picker="year"
          placeholder={["Desde", "Hasta"]}
          allowClear={false}
          disabledDate={disabledDate}
          defaultValue={value ? [dayjs(value[0]), dayjs(value[1])] : null}
          onChange={(dates) => {
            setValue(dates.map((date) => date.year()));
          }}
        />
      </ConfigProvider>
      <Row justify="end" style={{ marginTop: "12px" }}>
        <DeleteFilter filterType="years" queryParams={query} />
        <ApplyFilter value={value} filterType="years" query={query} />
      </Row>
    </>
  );
}
