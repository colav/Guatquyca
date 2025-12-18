/* UI Library Components */
import { Col } from "antd";

/* icons */
import { CopyOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * ProductsCount is a function component that displays the count of products in a column.
 *
 * @param {Object} props - The component props.
 * @param {number} props.products_count - The count of products to display.
 * @returns {JSX.Element} A Col component that displays the count of products.
 */
export default function ProductsCount({ products_count, size = "default" }) {
  if (size === "small") {
    return (
      <div className={styles.productsCount_small}>
        <CopyOutlined /> Productos:{" "}
        <span className={styles.text}>{products_count || 0}</span>
      </div>
    );
  }
  return (
    <Col xs={24} md={6} lg={7} xl={5}>
      <h2 className={styles.title}>
        <CopyOutlined /> Productos:
      </h2>
      <div className={styles.text}>
        {products_count ? products_count : "No disponible"}
      </div>
    </Col>
  );
}
