"use client";

/* lib */
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Next */
import { usePathname } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Select, Tooltip } from "antd";

/**
 * SortWorkList is a client-side component for sorting a work list based on a selected criteria.
 *
 * @param {Object} queryParams - The current query parameters.
 * @param {Function} setQueryParams - Function to update the query parameters.
 * @param {Function} setUrl - Function to update the URL.
 *
 * @returns {JSX.Element} A dropdown menu to sort the work list by citations or year.
 */
export default function SortWorkList({ queryParams, setQueryParams, setUrl }) {
  const pathname = usePathname();

  const onChange = (value) => {
    const newQueryParams = { ...queryParams, sort: value };
    setQueryParams(newQueryParams);
    const URL = URLBuilder(`/app/${pathname}`, newQueryParams);
    setUrl(URL);
  };

  return (
    <Tooltip title="Ordenar">
      <Select
        size="small"
        className={styles.sort_select}
        value={queryParams.sort || "citations-"}
        onChange={onChange}
        options={[
          { value: "citations-", label: "Más citado" },
          { value: "year-", label: "Más reciente" },
          { value: "alphabetical", label: "Alfabético" },
        ]}
      />
    </Tooltip>
  );
}
