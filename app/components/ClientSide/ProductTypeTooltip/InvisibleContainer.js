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
 * @description This component renders an invisible clickable area that triggers a tooltip. The tooltip displays a list of
 * product types and their corresponding sources, with translations applied where available.
 *
 * @param {Array} typesList - An array of objects representing types and their sources. Each object should have a `name`
 * (product type for example) and `source` (data source).
 *
 * @returns {JSX.Element|null} A tooltip-triggering invisible container or null if no source is provided.
 */
export default function InvisibleContainer({
  typesList,
  type,
  layout = "small",
}) {
  if (!typesList || typesList.length === 0) {
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
                Tipo de {SINGULAR_TITLES[type]} según fuente:
              </h4>
            </Col>
          </Row>
          <Divider className={styles.divider} />
          <div className={styles.tooltipContent}>
            {typesList.map((item, index) => (
              <div className={styles.tooltipItem} key={index}>
                • {PRODUCT_TYPES[item.name] || item.name || item.type}{" "}
                <span className={styles.tooltipSource}>
                  según {DB[item.source] || item.source}
                </span>
              </div>
            ))}
          </div>
        </>
      }
    >
      <div
        className={
          layout === "wide"
            ? styles.invisibleContainerWide
            : styles.invisibleContainer
        }
      ></div>
    </Tooltip>
  );
}
