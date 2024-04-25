"use client";

import { useState, useEffect } from "react";

/* Next */
import { usePathname } from "next/navigation";

/* lib */
import URLBuilder from "@/lib/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Pagination, Row } from "antd";

/**
 * PaginationOnWorkList is a client-side function component for managing pagination on a work list.
 *
 * @param {number} totalItems - The total number of items.
 * @param {Object} queryParams - The current query parameters.
 * @param {Function} setQueryParams - Function to update the query parameters.
 * @param {Function} setUrl - Function to update the URL.
 *
 * @returns {JSX.Element} The rendered Pagination component from antd.
 */
export default function PaginationOnWorkList({
  totalItems,
  queryParams,
  setQueryParams,
  setUrl,
}) {
  const pathname = usePathname();

  const [topPosition, setTopPosition] = useState(0);

  useEffect(() => {
    const topElement = document.getElementById("work_list");
    if (topElement) {
      setTopPosition(
        topElement.getBoundingClientRect().top + window.pageYOffset
      );
    }
  }, []);

  /**
   * Function to handle changes in the Pagination component.
   *
   * @param {number} page - The new page number.
   * @param {number} pageSize - The new page size.
   */
  const onChange = (page, pageSize) => {
    const newQueryParams = { ...queryParams, page: page, max: pageSize };
    setQueryParams(newQueryParams);
    const URL = URLBuilder(pathname, newQueryParams);
    setUrl(URL);
    window.scrollTo({
      top: topPosition - 110,
      behavior: "smooth",
    });
  };

  return (
    <Row justify="end" id={styles.pagination_container}>
      <Pagination
        size="small"
        total={totalItems}
        current={parseInt(queryParams.page)}
        pageSize={parseInt(queryParams.max)}
        onChange={onChange}
      />
    </Row>
  );
}
