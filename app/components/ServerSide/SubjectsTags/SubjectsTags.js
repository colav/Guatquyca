/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Space, Tag } from "antd";

/**
 * SubjectsTags is a function component that receives a list of subjects as props
 * and renders each subject as a Tag component from the Ant Design library.
 *
 * @param {Object[]} subjectsList - An array of subject objects. Each object should have an 'id' and a 'name' property.
 * @returns {JSX.Element} A div containing a spaced component, which in turn contains a list of Tag components.
 */
export default function SubjectsTags({ subjectsList }) {
  return (
    <div className={styles.subjectsTags_container}>
      <Space size={[0, 8]} wrap>
        {subjectsList.map((subject) => {
          return (
            <Tag bordered={false} key={subject.id}>
              {subject.name}
            </Tag>
          );
        })}
      </Space>
    </div>
  );
}
