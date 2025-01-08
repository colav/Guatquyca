"use client";

/* Next */
import { useRouter, usePathname } from "next/navigation";

/* lib */
import URLBuilder from "@/lib/Utils/URLBuilder";

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

  /**
   * onChange is a function that gets called when the page or page size changes.
   *
   * @param {number} page - The new page number.
   * @param {number} pageSize - The new page size.
   */
  const onChange = (page, pageSize) => {
    const URL = URLBuilder(pathname, searchParams, {
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

  return (
    <Row justify="end" id={styles.pagination_container}>
      <Pagination
        size="small"
        total={totalItems}
        current={parseInt(searchParams.page)}
        pageSize={parseInt(searchParams.max)}
        onChange={onChange}
      />
    </Row>
  );
}
