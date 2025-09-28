/* Constants */
import { DB, PRODUCT_TYPES, SINGULAR_TITLES } from "@/lib/constants";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Row, Tooltip } from "antd";

/**
 * InvisibleContainer is a client-side functional component that displays a tooltip with product type information based on the provided source.
 *
 * @component
 * @description This component renders an invisible clickable area that triggers a tooltip. The tooltip displays a list of product types and their corresponding sources, with translations applied where available.
 *
 * @param {Array} source - An array of objects representing product types and their sources. Each object should have a `name` (product type) and `source` (data source).
 *
 * @returns {JSX.Element|null} A tooltip-triggering invisible container or null if no source is provided.
 */
export default function InvisibleContainer({
  source,
  productType,
  type = "small",
}) {
  if (!source) {
    return null;
  }
  return (
    <Tooltip
      trigger="click"
      color="#ffffff"
      placement="bottomLeft"
      id={styles.tooltip}
      title={
        <>
          <Row justify={"space-between"}>
            <Col>
              <h4 className={styles.tooltipHeader}>
                Tipo de {SINGULAR_TITLES[productType]} según fuente:
              </h4>
            </Col>
          </Row>
          <Divider className={styles.divider} />
          <div className={styles.tooltipContent}>
            {source.map((source, index) => (
              <div className={styles.tooltipItem} key={index}>
                • {PRODUCT_TYPES[source.name] || source.name}{" "}
                <span className={styles.tooltipSource}>
                  según {DB[source.source] || source.source}
                </span>
              </div>
            ))}
          </div>
        </>
      }
    >
      <div
        className={
          type === "wide"
            ? styles.invisibleContainerWide
            : styles.invisibleContainer
        }
      ></div>
    </Tooltip>
  );
}
