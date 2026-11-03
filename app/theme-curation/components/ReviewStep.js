"use client";

/* Styles */
import styles from "../styles.module.css";

/* Hooks */
import { useMemo, useState } from "react";

/* Icons */
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FlagOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

/* Components */
import ManualTopicSearch from "./ManualTopicSearch";
import TopicDetailModal from "./TopicDetailModal";
import TopicKeywords from "./TopicKeywords";

/* Constants & utils */
import {
  CLASSIFICATION_STATUSES,
  SEED_TRUNCATED_MESSAGE,
} from "../lib/constants";
import { computeCounts } from "../lib/classification";

/* UI Library Components */
import {
  Alert,
  Button,
  Card,
  Input,
  Popconfirm,
  Popover,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";

const { Text } = Typography;
const { TextArea } = Input;

/**
 * ReviewStep is Screen 2 of the Theme Curation flow: the curator reviews
 * every candidate topic returned by /app/theme/candidates, classifies each
 * as included/excluded/borderline, and can search the full catalog to add
 * topics the embedding search missed.
 *
 * Classification here is entirely client-side state (see lib/classification.js
 * for why) — nothing is PATCHed to the backend until Screen 3 creates the
 * theme and persists every classification against its theme_id.
 *
 * Classifying is inline: the "Incluido"/"Frontera"/"Excluido" traffic-light
 * buttons in each row set the status directly, with "Frontera" opening a
 * small popover just for the required justification text. Clicking the
 * topic's name opens a detail modal (summary, keywords, Wikipedia link,
 * hierarchy) — those fields already come back from candidates/search, so
 * no extra API call happens there.
 *
 * @param {Object[]} candidates - Candidates from /app/theme/candidates, assumed sorted by similarity.
 * @param {Object[]} manualTopics - Topics added via manual search.
 * @param {Object.<string, {status: string, justification?: string}>} classifications - Keyed by topic_id.
 * @param {boolean} [truncated] - True when /candidates reported that the backend truncated the seed; shows the long-seed warning.
 * @param {function} onClassify - (topicId, {status, justification}) => void
 * @param {function} onAddManualTopic - (topic) => void
 * @param {function} onBack - Go back to Screen 1.
 * @param {function} onContinue - Go to Screen 3.
 * @returns {JSX.Element}
 */
export default function ReviewStep({
  candidates,
  manualTopics,
  classifications,
  truncated = false,
  onClassify,
  onAddManualTopic,
  onBack,
  onContinue,
}) {
  const [detailTopic, setDetailTopic] = useState(null);
  const [borderlineTopicId, setBorderlineTopicId] = useState(null);
  const [borderlineDraft, setBorderlineDraft] = useState("");

  const candidateIds = useMemo(
    () => new Set(candidates.map((c) => c.topic_id)),
    [candidates],
  );

  const allTopics = useMemo(
    () => [...candidates, ...manualTopics],
    [candidates, manualTopics],
  );

  const existingTopicIds = useMemo(
    () => new Set(allTopics.map((t) => t.topic_id)),
    [allTopics],
  );

  // Rank is computed independently of table sort/filter/pagination, from a
  // score-sorted copy of the ORIGINAL candidates — so "#1" always means
  // "highest similarity in this search", not "first row on screen".
  const rankByTopicId = useMemo(() => {
    const sorted = [...candidates].sort(
      (a, b) =>
        (b.similarity_score ?? -Infinity) - (a.similarity_score ?? -Infinity),
    );
    const map = {};
    sorted.forEach((topic, i) => {
      map[topic.topic_id] = i + 1;
    });
    return map;
  }, [candidates]);

  // Bar width is normalized to THIS batch's own min/max, not a fixed 0-1
  // scale — raw cosine scores sit far from 1 and their range depends on the
  // embedding model (02 §1.2), so scaling against an absolute range would
  // visually read as "low confidence" for results that are actually the best
  // matches available.
  const { minScore, maxScore } = useMemo(() => {
    const scores = candidates
      .map((c) => c.similarity_score)
      .filter((s) => typeof s === "number");
    return {
      minScore: scores.length ? Math.min(...scores) : 0,
      maxScore: scores.length ? Math.max(...scores) : 1,
    };
  }, [candidates]);

  const counts = useMemo(
    () => computeCounts(allTopics, classifications),
    [allTopics, classifications],
  );

  const openBorderlinePopover = (topic) => {
    setBorderlineTopicId(topic.topic_id);
    setBorderlineDraft(classifications[topic.topic_id]?.justification || "");
  };

  const closeBorderlinePopover = () => {
    setBorderlineTopicId(null);
    setBorderlineDraft("");
  };

  const handleSaveBorderline = (topicId) => {
    const trimmed = borderlineDraft.trim();
    if (!trimmed) return;
    onClassify(topicId, { status: "borderline", justification: trimmed });
    closeBorderlinePopover();
  };

  const handleQuickClassify = (topicId, status) => {
    if (borderlineTopicId === topicId) closeBorderlinePopover();
    onClassify(topicId, { status, justification: undefined });
  };

  const columns = [
    {
      title: "Tópico",
      dataIndex: "name",
      key: "name",
      render: (name, topic) => {
        const classification = classifications[topic.topic_id];
        const isManual = !candidateIds.has(topic.topic_id);
        return (
          <div>
            <Button
              type="link"
              className={styles.topicNameLink}
              onClick={() => setDetailTopic(topic)}
            >
              {name}
            </Button>
            {isManual && <Tag style={{ marginLeft: 8 }}>manual</Tag>}
            <TopicKeywords topic={topic} />
            {classification?.status === "borderline" &&
              classification.justification && (
                <div className={styles.justificationPreview}>
                  <Text type="secondary">
                    Justificación: {classification.justification}
                  </Text>
                </div>
              )}
          </div>
        );
      },
    },
    {
      title: "Similitud",
      key: "similarity",
      width: 130,
      render: (_, topic) => {
        if (typeof topic.similarity_score !== "number") {
          return (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Agregado manualmente
            </Text>
          );
        }

        const rank = rankByTopicId[topic.topic_id];
        const width =
          maxScore > minScore
            ? Math.max(
                8,
                ((topic.similarity_score - minScore) / (maxScore - minScore)) *
                  100,
              )
            : 100;

        return (
          <div>
            <Text strong>#{rank}</Text>{" "}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {topic.similarity_score.toFixed(2)}
            </Text>
            <div className={styles.similarityBarTrack}>
              <div
                className={styles.similarityBarFill}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: <span className={styles.classificationHeader}>Clasificación</span>,
      key: "classification",
      width: 150,
      align: "center",
      filters: [
        { text: "Incluido", value: "included" },
        { text: "Frontera", value: "borderline" },
        { text: "Excluido", value: "excluded" },
        { text: "Sin clasificar", value: "unclassified" },
      ],
      onFilter: (value, topic) =>
        (classifications[topic.topic_id]?.status ?? "unclassified") === value,
      render: (_, topic) => {
        const status = classifications[topic.topic_id]?.status;
        return (
          <Space size={10}>
            <Tooltip title="Incluido: pertenece claramente al eje.">
              <Button
                shape="circle"
                size="small"
                aria-label="Marcar como incluido"
                className={`${styles.statusBtn} ${styles.statusIncluded} ${
                  status === "included" ? styles.statusActive : ""
                }`}
                icon={<CheckCircleOutlined />}
                onClick={() => handleQuickClassify(topic.topic_id, "included")}
              />
            </Tooltip>

            <Tooltip title="Frontera: está relacionado pero no es central para el eje.">
              <Popover
                open={borderlineTopicId === topic.topic_id}
                onOpenChange={(next) =>
                  next ? openBorderlinePopover(topic) : closeBorderlinePopover()
                }
                trigger="click"
                title="Justificación (caso frontera)"
                content={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Explica brevemente por qué este tópico es un caso límite.
                    </Text>
                    <TextArea
                      value={borderlineDraft}
                      onChange={(e) => setBorderlineDraft(e.target.value)}
                      autoSize={{ minRows: 2, maxRows: 4 }}
                      placeholder="Ej: el tópico toca el tema solo tangencialmente..."
                      style={{ marginTop: 8 }}
                    />
                    <div className={styles.borderlinePopoverActions}>
                      <Button size="small" onClick={closeBorderlinePopover}>
                        Cancelar
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        disabled={!borderlineDraft.trim()}
                        onClick={() => handleSaveBorderline(topic.topic_id)}
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                }
              >
                <Button
                  shape="circle"
                  size="small"
                  aria-label="Marcar como frontera"
                  className={`${styles.statusBtn} ${styles.statusBorderline} ${
                    status === "borderline" ? styles.statusActive : ""
                  }`}
                  icon={<FlagOutlined />}
                />
              </Popover>
            </Tooltip>

            <Tooltip title="Excluido: no pertenece al eje.">
              <Button
                shape="circle"
                size="small"
                aria-label="Marcar como excluido"
                className={`${styles.statusBtn} ${styles.statusExcluded} ${
                  status === "excluded" ? styles.statusActive : ""
                }`}
                icon={<CloseCircleOutlined />}
                onClick={() => handleQuickClassify(topic.topic_id, "excluded")}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Card className={styles.stepCard}>
      {truncated && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={SEED_TRUNCATED_MESSAGE}
        />
      )}

      <div className={styles.reviewHeader}>
        <Text strong className={styles.reviewHeaderTitle}>
          Tópicos candidatos (ordenados por similitud)
        </Text>
        <ManualTopicSearch
          existingTopicIds={existingTopicIds}
          onAdd={onAddManualTopic}
        />
      </div>

      <Table
        rowKey="topic_id"
        columns={columns}
        dataSource={allTopics}
        size="small"
        bordered
        pagination={{ defaultPageSize: 20 }}
        scroll={{ x: 700 }}
        className={styles.reviewTable}
      />

      <div className={styles.summaryBar}>
        <div className={styles.summaryTags}>
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {counts.included} incluidos
          </Tag>
          <Tag color="warning" icon={<FlagOutlined />}>
            {counts.borderline} frontera
          </Tag>
          <Tag color="error" icon={<CloseCircleOutlined />}>
            {counts.excluded} excluidos
          </Tag>
          <Tag icon={<MinusCircleOutlined />}>
            {counts.unclassified} sin clasificar
          </Tag>
        </div>

        <div className={styles.summaryActions}>
          <Button onClick={onBack}>Volver</Button>
          {counts.unclassified > 0 ? (
            <Popconfirm
              title="Aún tienes tópicos sin clasificar"
              description={`${counts.unclassified} tópico(s) quedarán fuera del eje. ¿Continuar de todas formas?`}
              onConfirm={onContinue}
              okText="Continuar"
              cancelText="Seguir revisando"
            >
              <Button type="primary">Continuar y guardar eje</Button>
            </Popconfirm>
          ) : (
            <Button type="primary" onClick={onContinue}>
              Continuar y guardar eje
            </Button>
          )}
        </div>
      </div>

      <TopicDetailModal
        open={!!detailTopic}
        topic={detailTopic}
        onClose={() => setDetailTopic(null)}
      />
    </Card>
  );
}
