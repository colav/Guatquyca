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
import { InputNumber, Row, Typography } from "antd";

/**
 * NumberRangeFilter allows users to enter the lower and upper bounds of a
 * numeric range directly.
 *
 * @param {Object} data - Data object containing min/max values.
 * @param {number} data.min_authors - Minimum number of authors.
 * @param {number} data.max_authors - Maximum number of authors.
 * @param {string} filterType - The filter type key used in query params.
 * @returns {JSX.Element} The rendered numeric range filter.
 */
export default function NumberRangeFilter({ data, filterType }) {
  const query = useSearchParams();

  const [value, setValue] = useState(() => {
    const param = query.get(filterType);
    const [min, max] = param?.split("-") || [];
    const maxAuthors = data?.max_authors;
    return [
      min && maxAuthors ? Math.min(Number(min), maxAuthors) : null,
      max && maxAuthors ? Math.min(Number(max), maxAuthors) : null,
    ];
  });

  if (!data) {
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  }

  const [minValue, maxValue] = value;
  const hasBothValues = minValue !== null && maxValue !== null;
  const hasValidOrder = !hasBothValues || minValue <= maxValue;

  return (
    <>
      <div className={styles.numberRange}>
        <div className={styles.numberRangeField}>
          <span className={styles.numberRangeLabel}>Min</span>
          <InputNumber
            value={minValue}
            onChange={(nextValue) => setValue([nextValue, maxValue])}
            style={{ width: "100%" }}
          />
        </div>
        <span className={styles.numberRangeSeparator}>a</span>
        <div className={styles.numberRangeField}>
          <span className={styles.numberRangeLabel}>Max</span>
          <InputNumber
            value={maxValue}
            status={!hasValidOrder ? "error" : undefined}
            onChange={(nextValue) => setValue([minValue, nextValue])}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      {!hasValidOrder && (
        <Typography.Text type="danger">
          Ingrese un rango válido.
        </Typography.Text>
      )}
      <Row justify="end" style={{ marginTop: 12 }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter
          value={hasValidOrder ? value : []}
          filterType={filterType}
          query={query}
          separator="-"
        />
      </Row>
    </>
  );
}
