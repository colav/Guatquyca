"use client";

/* Next */
import { useRouter, usePathname } from "next/navigation";

/* lib */
import URLBuilder from "@/lib/utils/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Pagination, Row } from "antd";

/**
 * PaginationController is a "client-side" function component that displays a pagination controller.
 *
 * @param {number} totalItems - The total number of items to paginate.
 * @param {Object} searchParams - The search parameters used to fetch the items.
 * @returns {JSX.Element} A Pagination component from Ant Design library that allows users to navigate through pages of items.
 */
export default function PaginationController({ totalItems, searchParams }) {
  const router = useRouter();
  const pathname = usePathname();

  const normalizePaginationValue = (value, fallback) => {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isFinite(parsedValue) && parsedValue > 0
      ? parsedValue
      : fallback;
  };

  const currentPage = normalizePaginationValue(searchParams?.page, 1);
  const pageSize = normalizePaginationValue(searchParams?.max, 10);

  /**
   * onChange is a function that gets called when the page or page size changes.
   *
   * @param {number} page - The new page number.
   * @param {number} pageSize - The new page size.
   */
  const onChange = (page, pageSize) => {
    const URL = URLBuilder(pathname, searchParams ?? {}, {
      max: pageSize,
      page: page,
    });
    router.push(URL, { scroll: false });

    const element = document.getElementById("list");
    const topPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: topPosition - 110,
      behavior: "instant",
    });
  };

  let pageSizeOptions;
  if (totalItems <= 20) {
    pageSizeOptions = ["10", "20"];
  } else if (totalItems <= 50) {
    pageSizeOptions = ["10", "20", "50"];
  } else {
    pageSizeOptions = ["10", "20", "50", "100"];
  }

  return (
    <Row justify="end" id={styles.pagination_container}>
      <Pagination
        size="small"
        total={totalItems}
        current={currentPage}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={totalItems > 10}
        pageSizeOptions={pageSizeOptions}
        locale={{
          items_per_page: "/ pág.",
        }}
      />
    </Row>
  );
}
