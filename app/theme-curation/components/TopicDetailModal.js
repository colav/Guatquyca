"use client";

/* Icons */
import { FileSearchOutlined, LinkOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Flex, Modal, Tag, Typography } from "antd";

/* Styles */
import styles from "../styles.module.css";

/* Constants & utils */
import { PRODUCTION_LINK_TITLE } from "../lib/constants";
import { topicProductionPath } from "../lib/format";

const { Paragraph, Text } = Typography;

/**
 * OpenAlex's topic hierarchy has three fixed levels, from broadest to
 * narrowest. Keeping the label alongside its value (instead of a flat
 * array of names) means a topic missing a level — e.g. no subfield_name —
 * just drops that one step without misaligning the others.
 */
const HIERARCHY_LEVELS = (topic) => [
  { label: "Dominio", value: topic.domain_name },
  { label: "Campo", value: topic.field_name },
  { label: "Subcampo", value: topic.subfield_name },
];

/**
 * TopicDetailModal shows everything about a single topic that doesn't fit
 * in the review table's row: the full hierarchy path, summary, keywords,
 * a link to the ImpactU production filtered by the topic (01 D-101; always
 * shown when the topic has an id) and a link to its Wikipedia reference.
 *
 * All of these fields already come back from /app/theme/candidates and
 * /app/theme/search (02 §2 and §3.1-3.2) — opening this modal never triggers a new API call, it just
 * surfaces data the topic object already carries.
 *
 * @param {boolean} open
 * @param {Object|null} topic - null while closed.
 * @param {function} onClose
 * @returns {JSX.Element|null}
 */
export default function TopicDetailModal({ open, topic, onClose }) {
  if (!topic) return null;

  const productionPath = topicProductionPath(topic.topic_id);
  const hierarchy = HIERARCHY_LEVELS(topic).filter((level) => level.value);
  const keywordList = (topic.keywords || "")
    .split(";")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <Modal title={topic.name} open={open} onCancel={onClose} footer={null}>
      {hierarchy.length > 0 && (
        <div className={styles.detailSection}>
          <Text type="secondary" className={styles.detailLabel}>
            Jerarquía:
          </Text>
          <Flex align="end" gap={4} wrap>
            {hierarchy.map((level, i) => (
              <Flex key={level.label} align="end" gap={4}>
                <Flex vertical gap={2}>
                  <Text type="secondary" className={styles.hierarchyLevelLabel}>
                    {level.label}
                  </Text>
                  <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                    {level.value}
                  </Tag>
                </Flex>
                {i < hierarchy.length - 1 && (
                  <span className={styles.hierarchySeparator}>›</span>
                )}
              </Flex>
            ))}
          </Flex>
        </div>
      )}

      <div className={styles.detailSection}>
        <Text type="secondary" className={styles.detailLabel}>
          Resumen:
        </Text>
        <Paragraph style={{ marginBottom: 0 }}>
          {topic.summary || "No hay resumen disponible para este tópico."}
        </Paragraph>
      </div>

      {keywordList.length > 0 && (
        <div className={styles.detailSection}>
          <Text type="secondary" className={styles.detailLabel}>
            Palabras clave:
          </Text>
          <Flex gap="6px 0" wrap>
            {keywordList.map((kw) => (
              <Tag key={kw}>{kw}</Tag>
            ))}
          </Flex>
        </div>
      )}

      {productionPath && (
        <div className={styles.detailSection}>
          <a
            href={productionPath}
            target="_blank"
            rel="noopener noreferrer"
            title={PRODUCTION_LINK_TITLE}
          >
            <FileSearchOutlined /> Ver producción asociada
          </a>
        </div>
      )}

      {topic.wikipedia_url && (
        <div className={styles.detailSection}>
          <a
            href={topic.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkOutlined /> Ver tópico en Wikipedia
          </a>
        </div>
      )}
    </Modal>
  );
}
