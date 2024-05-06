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
  return (
    <div className={styles.productTypeTags_container}>
      {productsTypeList.map((type, i) => {
        return (
          <Tooltip title={`Fuente: ${type.source}`} key={type.name + i}>
            <Tag bordered={false}>
              {type.name === "article" ? "Artículo" : type.name}
            </Tag>
          </Tooltip>
        );
      })}
    </div>
  );
}
