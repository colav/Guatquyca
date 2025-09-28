/* Components */
import InvertedIndex from "@/app/components/ClientSide/InvertedIndex/InvertedIndex";
import TopicTag from "@/app/components/ServerSide/TopicTag/TopicTag";

/* Icons */
import { FileUnknownOutlined, TagOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * WorkAbstract component displays the abstract and primary topic information of an academic work.
 *
 * This component handles two main sections:
 * 1. Abstract display using an inverted index format for enhanced text processing
 * 2. Primary topic display with hierarchical academic classification
 *
 * The component gracefully handles missing data by showing appropriate fallback messages
 * when abstract or topic information is unavailable.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object|null} props.abstract - The abstract data in inverted index format
 * @param {Object.<string, number[]>} [props.abstract] - Object where keys are words and values are arrays of word positions
 * @param {Object|null} props.primaryTopic - The primary academic topic classification, it should containts also field, domain and subdomain.
 *
 * @returns {JSX.Element} A section containing the abstract and topic information
 *
 */
export default function WorkAbstract({ abstract, primaryTopic }) {
  const hasAbstract =
    abstract &&
    typeof abstract === "object" &&
    Object.keys(abstract).length > 0;

  const hasTopic =
    primaryTopic &&
    typeof primaryTopic === "object" &&
    primaryTopic.display_name;

  return (
    <>
      <h4 className={styles.abstract_title}>
        <FileUnknownOutlined /> Abstract:
      </h4>
      {hasAbstract ? (
        <InvertedIndex abstract={abstract} full={true} />
      ) : (
        <div className={styles.abstract_fallback}>Abstract no disponible</div>
      )}
      <div className={styles.topic_container}>
        <h4 className={styles.abstract_title}>
          <TagOutlined /> Tópico:
        </h4>
        {hasTopic ? (
          <TopicTag topic={primaryTopic} />
        ) : (
          <div className={styles.abstract_fallback}>
            No hay tópicos disponibles
          </div>
        )}
      </div>
    </>
  );
}
