/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Breadcrumb, Tag } from "antd";

/**
 * TopicsTags is a function component that receives a list of topics as props
 * and renders each topic as a Breadcrumb component showing the hierarchical structure.
 *
 * @param {Object[]} topicsList - An array of topics objects. Each object should have 'domain', 'field', 'subfield', and 'display_name' properties.
 * @returns {JSX.Element} A div containing breadcrumb components for each topic.
 */
export default function TopicsTags({ topicsList }) {
  return (
    <div className={styles.topicsTags_container}>
      <ul>
        {topicsList.map((topic, index) => {
          return (
            <li key={index}>
              <Breadcrumb
                separator=">"
                items={[
                  { title: `Domain: ${topic.domain.display_name}` },
                  { title: `Field: ${topic.field.display_name}` },
                  { title: `Subfield: ${topic.subfield.display_name}` },
                  { title: `Topic: ${topic.display_name}` },
                ]}
              />
              <Tag bordered={false}>Puntaje: {topic.score}</Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
