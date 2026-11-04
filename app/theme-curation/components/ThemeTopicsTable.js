"use client";

/* Styles */
import styles from "../styles.module.css";

/* Hooks */
import { useMemo, useState } from "react";

/* Components */
import TopicDetailModal from "./TopicDetailModal";
import TopicKeywords from "./TopicKeywords";

/* Constants & utils */
import {
  CLASSIFICATION_ORDER,
  CLASSIFICATION_STATUSES,
  METHOD_LABELS,
} from "../lib/constants";
import { formatDate, hierarchyPath, normalizeSearchText } from "../lib/format";

/* Icons */
import { SearchOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Button, Input, Table, Tag, Tooltip, Typography } from "antd";

const { Text } = Typography;

/**
 * Sorts topics by status (included, borderline, excluded), then named
 * topics before orphans (no name), then by name (by topic_id for orphans).
 * The server's order is not defined (02 §3.5), so the client always sorts.
 *
 * @param {Object[]} topics
 * @returns {Object[]}
 */
function sortTopics(topics) {
  const statusRank = (topic) => {
    const index = CLASSIFICATION_ORDER.indexOf(topic.status);
    return index === -1 ? CLASSIFICATION_ORDER.length : index;
  };
  return [...topics].sort(
    (a, b) =>
      statusRank(a) - statusRank(b) ||
      (a.name ? 0 : 1) - (b.name ? 0 : 1) ||
      (a.name ?? a.topic_id ?? "").localeCompare(b.name ?? b.topic_id ?? ""),
  );
}

/**
 * ThemeTopicsTable lists the topics classified in one theme (Screen 5): name
 * (opens the topic detail modal), hierarchy, status, method, justification
 * and classification date, with a name search and status/method filters.
 *
 * Each topic follows the shape proposed in 02 §9 for GET /app/theme/<id>:
 * the ThemeTopic fields plus the same flat fields as a Candidate, so the
 * element goes straight into TopicDetailModal. `similarity_score` is
 * deliberately NOT shown (undecided, 01 D-032; see 30 "Decisiones
 * propuestas"). Filtering and pagination are client-side.
 *
 * A topic whose `name` is null is an orphan (its topic_id is not in the
 * catalog, per the proposed LEFT JOIN): it shows the id and no modal.
 *
 * @param {Object[]} topics - The `topics` array of the theme detail.
 * @param {boolean} catalogAvailable - False when the backend does not send topic names (a backend without D-009): ids are shown without calling them orphans.
 * @returns {JSX.Element}
 */
export default function ThemeTopicsTable({ topics, catalogAvailable }) {
  const [query, setQuery] = useState("");
  const [detailTopic, setDetailTopic] = useState(null);

  const sorted = useMemo(() => sortTopics(topics), [topics]);

  const filtered = useMemo(() => {
    const needle = normalizeSearchText(query.trim());
    if (!needle) return sorted;
    return sorted.filter((topic) =>
      normalizeSearchText(
        `${topic.name ?? ""} ${topic.topic_id ?? ""}`,
      ).includes(needle),
    );
  }, [sorted, query]);

  const columns = [
    {
      title: "Tópico",
      key: "name",
      render: (_, topic) => {
        if (topic.name) {
          return (
            <div>
              <Button
                type="link"
                className={styles.topicNameLink}
                onClick={() => setDetailTopic(topic)}
              >
                {topic.name}
              </Button>
              <TopicKeywords topic={topic} />
            </div>
          );
        }
        return (
          <div>
            <Text>{topic.topic_id}</Text>
            {catalogAvailable && (
              <div>
                <Text type="secondary">
                  Tópico no encontrado en el catálogo
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Subcampo de conocimiento",
      key: "hierarchy",
      width: 220,
      render: (_, topic) => {
        const path = hierarchyPath(topic);
        if (!path) return <Text type="secondary">—</Text>;
        return (
          <Tooltip title={path}>
            <Tag color="blue" className={styles.hierarchyTag}>
              {topic.subfield_name ?? topic.field_name ?? topic.domain_name}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: CLASSIFICATION_ORDER.map((status) => ({
        text: CLASSIFICATION_STATUSES[status].label,
        value: status,
      })),
      onFilter: (value, topic) => topic.status === value,
      render: (status) => {
        const config = CLASSIFICATION_STATUSES[status];
        return config ? (
          <Tag color={config.color}>{config.label}</Tag>
        ) : (
          <Text type="secondary">{status ?? "—"}</Text>
        );
      },
    },
    {
      title: "Método",
      dataIndex: "method",
      key: "method",
      width: 110,
      filters: Object.entries(METHOD_LABELS).map(([value, text]) => ({
        text,
        value,
      })),
      onFilter: (value, topic) => topic.method === value,
      render: (method) => METHOD_LABELS[method] ?? method ?? "—",
    },
    {
      title: "Justificación",
      dataIndex: "justification",
      key: "justification",
      width: 260,
      render: (justification) =>
        justification ? (
          <Text
            className={styles.justificationCell}
            ellipsis={{ tooltip: justification }}
          >
            {justification}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Clasificado",
      dataIndex: "classified_at",
      key: "classified_at",
      width: 120,
      render: formatDate,
    },
  ];

  return (
    <>
      <Input
        size="large"
        placeholder="Buscar tópico por nombre..."
        allowClear
        prefix={<SearchOutlined />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.themeSearchInput}
      />

      <Table
        rowKey="topic_id"
        columns={columns}
        dataSource={filtered}
        bordered
        size="small"
        scroll={{ x: 900 }}
        pagination={{ defaultPageSize: 20, showSizeChanger: false }}
        locale={{
          emptyText: query.trim()
            ? "No hay tópicos que coincidan con la búsqueda."
            : "Este eje todavía no tiene tópicos clasificados.",
        }}
      />

      <TopicDetailModal
        open={!!detailTopic}
        topic={detailTopic}
        onClose={() => setDetailTopic(null)}
      />
    </>
  );
}
