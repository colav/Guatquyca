/* Hooks */
import { usePathname, useRouter } from "next/navigation";

/* Icons */
import { DeleteOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button } from "antd";

/* Utils */
import { getQueryParamsAsObject } from "@/lib/Utils/getQueryParamsAsObject";
import URLBuilder from "@/lib/Utils/URLBuilder";

/**
 * DeleteFilter component provides a button to remove a specific filter from the query parameters.
 *
 * @param {string} filterType - The type of filter to remove.
 * @param {URLSearchParams} queryParams - The current query parameters.
 * @returns {JSX.Element} The DeleteFilter component.
 */
export default function DeleteFilter({ filterType, queryParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const query = getQueryParamsAsObject(queryParams);

  const onClick = () => {
    delete query[filterType];
    const URL = URLBuilder(pathname, query);
    router.push(URL);
  };

  return (
    <Button
      disabled={!queryParams.has(filterType)}
      className={styles.deleteButton}
      size="small"
      icon={<DeleteOutlined />}
      onClick={onClick}
    />
  );
}
