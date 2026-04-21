/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Space, Tag, Tooltip } from "antd";

/**
 * TopicsTagList is a function component that receives a list of topics as props
 * and renders each topic as a Tag component from the Ant Design library.
 *
 * @param {Object[]} topics - An array of topic objects. Each object should have an 'id' and a 'display_name' property.
 * @returns {JSX.Element} A div containing a spaced component, which in turn contains a list of Tag components.
 */
export default function TopicsTagList({ topics }) {
  return (
    <div className={styles.topicsTags_container}>
      <Space size={[0, 8]} wrap>
        {topics.map((topic, i) => {
          if (!topic || !topic.display_name) return null;
          return (
            <Tooltip
              color="white"
              title={
                <ul className={styles.topicsList}>
                  <li>
                    <b>Domain:</b> {topic.domain?.display_name}
                  </li>
                  <li>
                    <b>Field:</b> {topic.field?.display_name}
                  </li>
                  <li>
                    <b>Subfield:</b> {topic.subfield?.display_name}
                  </li>
                </ul>
              }
            >
              <Tag bordered key={i}>
                {topic.display_name}
              </Tag>
            </Tooltip>
          );
        })}
      </Space>
    </div>
  );
}
