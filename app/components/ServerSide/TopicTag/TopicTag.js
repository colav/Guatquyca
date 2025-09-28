/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * TopicTag is a function component that displays a topic with its hierarchical information.
 *
 * @param {Object[]} topic - A Primary Topic object. It should have 'domain', 'field', 'subfield', and 'display_name' properties.
 * @returns {JSX.Element} A <div> containing a Tooltip and a Tag with the topic information.
 */
export default function TopicTag({ topic }) {
  return (
    <div className={styles.topicsTags_container}>
      <Tooltip
        color="white"
        title={
          <ul className={styles.topicsList}>
            <li>
              <b>Domain:</b> {topic.domain.display_name}
            </li>
            <li>
              <b>Field:</b> {topic.field.display_name}
            </li>
            <li>
              <b>Subfield:</b> {topic.subfield.display_name}
            </li>
          </ul>
        }
      >
        <Tag bordered>{topic.display_name}</Tag>
      </Tooltip>
    </div>
  );
}
