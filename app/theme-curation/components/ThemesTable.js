"use client";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "../styles.module.css";

/* Components */
import Spinner from "@/app/components/ClientSide/Spinner/Spinner";

/* Constants & utils */
import { formatDate, normalizeSearchText } from "../lib/format";

/* Icons */
import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Input, Table, Tag, Tooltip, Typography } from "antd";

const { Text } = Typography;

/**
 * Total topic count for a theme, from its `summary` object
 * ({included, excluded, borderline, manual}) — GET /theme started
 * returns this per theme (02 §3.4).
 *
 * `manual` is NOT added on top of included/excluded/borderline: every
 * topic has exactly one status regardless of how it was found (this
 * mirrors Screen 3's own summary, where "Agregados manualmente" is shown
 * as a note alongside the included/borderline/excluded counts, not summed
 * into them) — `manual` is how many of those already-counted topics came
 * from a manual search rather than the automatic candidate list.
 *
 * Defensive against a missing/partial `summary` rather than assuming
 * every row has it.
 *
 * @param {Object} [summary]
 * @returns {number}
 */
function topicCount(summary) {
  if (!summary) return 0;
  const { included = 0, excluded = 0, borderline = 0 } = summary;
  return included + excluded + borderline;
}

/**
 * ThemesTable is the listing table for Screen 4 ("Mis ejes temáticos"): a
 * name search box plus a table of every curated theme from GET /theme.
 *
 * Filtering is name-only and pagination is client-side, since GET
 * /theme has no query params for either (02 §9) — this mirrors the same
 * client-side-filter pattern already used by app/admin/users.
 *
 * The "Tópicos" column reads `theme.summary` (same shape as the `summary`
 * object GET /theme/<id> already returned) — GET /theme includes it
 * per theme (02 §3.4). See topicCount() below for why it isn't a plain sum of every
 * field in `summary`.
 *
 * @param {Object[]|null} themes - null while the initial load is in flight.
 * @param {boolean} loading
 * @param {string} query - Current name search text.
 * @param {function} onQueryChange
 * @returns {JSX.Element}
 */
export default function ThemesTable({ themes, loading, query, onQueryChange }) {
  const needle = normalizeSearchText(query.trim());
  const filtered = (themes ?? []).filter((theme) =>
    normalizeSearchText(theme.name).includes(needle),
  );

  const columns = [
    {
      title: "Eje",
      dataIndex: "name",
      key: "name",
      render: (name, theme) => (
        <Link
          href={`/theme-curation/${theme.theme_id}`}
          className={styles.themeNameLink}
        >
          <span className={styles.themeNameText}>{name}</span>
          <ArrowRightOutlined
            aria-hidden="true"
            className={styles.themeNameArrow}
          />
        </Link>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (description) =>
        description ? (
          description
        ) : (
          <Text type="secondary">Sin descripción</Text>
        ),
    },
    {
      title: "Tópicos",
      key: "topics",
      width: 110,
      sorter: (a, b) => topicCount(a.summary) - topicCount(b.summary),
      render: (_, theme) => {
        const count = topicCount(theme.summary);
        const tag = (
          <Tag color="blue">
            {count} tópico{count === 1 ? "" : "s"}
          </Tag>
        );
        if (!theme.summary) return tag;
        return (
          <Tooltip
            title={`Incluidos: ${theme.summary.included ?? 0} · Frontera: ${
              theme.summary.borderline ?? 0
            } · Excluidos: ${theme.summary.excluded ?? 0}`}
          >
            {tag}
          </Tooltip>
        );
      },
    },
    {
      title: "Curado por",
      dataIndex: "curator",
      key: "curator",
      width: 200,
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      width: 130,
      render: formatDate,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: "descend",
    },
  ];

  return (
    <>
      <Input
        size="large"
        placeholder="Buscar eje por nombre..."
        allowClear
        prefix={<SearchOutlined />}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className={styles.themeSearchInput}
      />

      <Table
        rowKey="theme_id"
        columns={columns}
        dataSource={filtered}
        bordered
        size="small"
        scroll={{ x: 800 }}
        className={styles.themesTable}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        loading={{
          spinning: loading,
          indicator: (
            <span className={styles.tableSpinner}>
              <Spinner />
            </span>
          ),
        }}
        locale={{
          emptyText: loading
            ? " "
            : query.trim()
              ? "No hay ejes que coincidan con la búsqueda."
              : "Todavía no hay ejes temáticos curados.",
        }}
      />
    </>
  );
}
