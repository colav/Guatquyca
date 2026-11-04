"use client";

/* Next */
import Link from "next/link";
import { useParams } from "next/navigation";

/* APIs */
import { getExportUrl, getTheme } from "@/lib/apis/theme.api";

/* Components */
import Spinner from "@/app/components/ClientSide/Spinner/Spinner";
import ThemeTopicsTable from "../components/ThemeTopicsTable";

/* Hooks */
import { useCallback, useEffect, useState } from "react";

/* Styles */
import styles from "../styles.module.css";

/* Constants & utils */
import { BREADCRUMB_ROOT, SEED_PREVIEW_LINES } from "../lib/constants";
import { errorMessage } from "../lib/errors";
import { formatDate } from "../lib/format";

/* Icons */
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FlagOutlined,
} from "@ant-design/icons";

/* UI Library Components */
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Space,
  Tag,
  Typography,
} from "antd";

const { Paragraph, Text } = Typography;

/**
 * Counts of a theme's topics by status. Prefers the `summary` the backend
 * sends (02 §2); falls back to counting `topics` if it is missing.
 *
 * @param {Object} theme - The theme detail (GET /app/theme/<id>).
 * @returns {{included: number, borderline: number, excluded: number, manual: number}}
 */
function themeCounts(theme) {
  const topics = theme.topics ?? [];
  const count = (predicate) => topics.filter(predicate).length;
  const summary = theme.summary ?? {};
  return {
    included: summary.included ?? count((t) => t.status === "included"),
    borderline: summary.borderline ?? count((t) => t.status === "borderline"),
    excluded: summary.excluded ?? count((t) => t.status === "excluded"),
    manual: summary.manual ?? count((t) => t.method === "manual"),
  };
}

/**
 * ThemeDetailPage is Screen 5 of the Theme Curation flow: the detail of one
 * saved theme (GET /app/theme/<theme_id>) with its header data, counts by
 * status, CSV/JSON export and the table of its classified topics.
 *
 * It follows the topic shape proposed in 02 §9 (D-009: name, hierarchy and
 * the other Candidate fields inside each `topics[]` element). D-009 is
 * deployed in quyca-dev and the screen was checked against it on 22 Oct
 * (11 F11); a backend without those fields still renders, showing the topic
 * ids with a notice. `similarity_score` is not
 * shown (undecided, 01 D-032). There is no reclassification here.
 *
 * @returns {JSX.Element}
 */
export default function ThemeDetailPage() {
  const { themeId } = useParams();

  const [theme, setTheme] = useState(null); // null = initial load in flight
  const [error, setError] = useState(null);

  const loadTheme = useCallback(() => {
    setError(null);
    setTheme(null);
    let cancelled = false;
    getTheme(themeId)
      .then((result) => {
        if (!cancelled) setTheme(result.data ?? null);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            errorMessage(
              e,
              "No se pudo cargar el eje temático.",
              "themeDetail",
            ),
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [themeId]);

  useEffect(() => loadTheme(), [loadTheme]);

  const topics = theme?.topics ?? [];
  // `name` absent on every topic means the backend does not send the topic
  // catalog fields (an older backend, before D-009); null on some means orphans.
  const catalogAvailable =
    topics.length === 0 || topics.some((t) => t.name !== undefined);
  const counts = theme ? themeCounts(theme) : null;

  return (
    <div className={styles.page}>
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { title: <Link href="/theme-curation">{BREADCRUMB_ROOT}</Link> },
          { title: theme?.name ?? "Detalle del eje" },
        ]}
      />

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" onClick={loadTheme}>
              Reintentar
            </Button>
          }
          style={{ marginTop: 16 }}
        />
      )}

      {!theme && !error && (
        <div className={styles.detailLoading}>
          <Spinner />
        </div>
      )}

      {theme && (
        <>
          <div className={styles.listHeader}>
            <div>
              <h1 className={styles.headerTitle}>{theme.name}</h1>
              <p className={styles.headerDescription}>
                <Text type="secondary">
                  {theme.description || "Sin descripción"}
                </Text>
              </p>
            </div>

            <Space wrap>
              <Button
                icon={<DownloadOutlined />}
                href={getExportUrl(theme.theme_id ?? themeId, "csv")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar CSV
              </Button>
              <Button
                icon={<DownloadOutlined />}
                href={getExportUrl(theme.theme_id ?? themeId, "json")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar JSON
              </Button>
            </Space>
          </div>

          <Card size="small" className={styles.detailCard}>
            <Descriptions
              size="small"
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              items={[
                {
                  key: "curator",
                  label: "Curado por",
                  children: theme.curator || "-",
                },
                {
                  key: "created_at",
                  label: "Fecha de creación",
                  children: formatDate(theme.created_at),
                },
                {
                  key: "seed",
                  label: "Semilla",
                  span: "filled",
                  children: theme.seed_text ? (
                    <Paragraph
                      style={{ marginBottom: 0 }}
                      ellipsis={{
                        rows: SEED_PREVIEW_LINES,
                        expandable: "collapsible",
                        symbol: (expanded) =>
                          expanded ? "Ver menos" : "Ver más",
                      }}
                    >
                      {theme.seed_text}
                    </Paragraph>
                  ) : (
                    "-"
                  ),
                },
              ]}
            />
            <div className={styles.summaryTags} style={{ marginTop: 12 }}>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                {counts.included} incluidos
              </Tag>
              <Tag color="warning" icon={<FlagOutlined />}>
                {counts.borderline} frontera
              </Tag>
              <Tag color="error" icon={<CloseCircleOutlined />}>
                {counts.excluded} excluidos
              </Tag>
              {counts.manual > 0 && (
                <Tag>{counts.manual} agregados manualmente</Tag>
              )}
            </div>
          </Card>

          {!catalogAvailable && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="Todavía no se puede mostrar el nombre ni la jerarquía de los tópicos de este eje; mientras tanto se muestra su identificador."
            />
          )}

          <ThemeTopicsTable
            topics={topics}
            catalogAvailable={catalogAvailable}
          />
        </>
      )}
    </div>
  );
}
