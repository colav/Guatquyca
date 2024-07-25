/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * SubjectsTags is a function component that receives a list of subjects as props
 * and renders each subject as a Tag component from the Ant Design library.
 *
 * @param {Object[]} subjectsList - An array of subject objects. Each object should have an 'id' and a 'name' property.
 * @returns {JSX.Element} A div containing a spaced component, which in turn contains a list of Tag components.
 */
export default function SubjectsTags({ productsTypeList }) {
  if (!productsTypeList) return null;
  return (
    <div className={styles.productTypeTags_container}>
      <Tooltip
        title={`Fuente: ${productsTypeList.source}`}
        key={productsTypeList.name}
      >
        <Tag
          bordered={false}
          style={{
            width: "115px",
            textWrap: "wrap",
            textAlign: "center",
          }}
        >
          {productsTypeList.name === "article"
            ? "Artículo"
            : productsTypeList.name}
        </Tag>
      </Tooltip>
    </div>
  );
}
