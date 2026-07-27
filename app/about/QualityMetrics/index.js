"use client";

/* React */
import { useMemo } from "react";

/* UI Library Components */
import { Tabs, Typography, Empty, theme } from "antd";

/* Icons */
import {
  AppstoreOutlined,
  BankOutlined,
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";

/* APIs */
import { APIRequest } from "@/lib/apis/client.api";

/* Components */
import Spinner from "@/app/components/ClientSide/Spinner/Spinner";
import { T } from "./context";
import { SummaryView } from "./SummaryView";
import { WorksView } from "./WorksView";
import { PersonView } from "./PersonView";
import { AffiliationsView } from "./AffiliationsView";
import { SourcesView } from "./SourcesView";

/* Styles */
import styles from "./styles.module.css";

/* Utils */
import { shortDate } from "./utils";

/* UI Library Sub-components */
const { Text } = Typography;

/**
 * Renders the quality metrics dashboard with a tabbed interface.
 *
 * The component fetches the execution history from the API, sorts it by the
 * most recent update, and displays a summary along with dedicated views for
 * works, authors, affiliations, and sources.
 *
 * @returns {JSX.Element} The quality metrics UI, or a loading/empty state
 * depending on the request status.
 */
export default function QualityMetrics() {
  const [state] = APIRequest("/app/info/quality");
  const { token } = theme.useToken();

  const history = useMemo(() => {
    if (!Array.isArray(state?.data)) return [];
    return [...state.data].sort(
      (a, b) => (b.db_update ?? 0) - (a.db_update ?? 0),
    );
  }, [state?.data]);

  if (state?.isLoading) {
    return (
      <div className={styles.loadingState}>
        <Spinner />
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className={styles.emptyState}>
        <Empty description="No hay registros de calidad disponibles." />
      </div>
    );
  }

  const tabs = [
    {
      key: "summary",
      label: (
        <span>
          <AppstoreOutlined /> Resumen
        </span>
      ),
      children: <SummaryView history={history} />,
    },
    {
      key: "works",
      label: (
        <span>
          <FileTextOutlined /> Productos
        </span>
      ),
      children: <WorksView history={history} />,
    },
    {
      key: "person",
      label: (
        <span>
          <UserOutlined /> Autores
        </span>
      ),
      children: <PersonView history={history} />,
    },
    {
      key: "affiliations",
      label: (
        <span>
          <BankOutlined /> Afiliaciones
        </span>
      ),
      children: <AffiliationsView history={history} />,
    },
    {
      key: "sources",
      label: (
        <span>
          <BookOutlined /> Fuentes
        </span>
      ),
      children: <SourcesView history={history} />,
    },
  ];

  return (
    <T.Provider value={token}>
      <div className={styles.container}>
        <div className={styles.summaryWrapper}>
          <Text type="secondary" className={styles.summaryText}>
            {history.length === 1
              ? "Una ejecución registrada. Las comparaciones aparecerán con más de una."
              : `${history.length} ejecuciones registradas, última actualización: ${shortDate(history[0]?.db_update)}.`}
          </Text>
        </div>
        <Tabs items={tabs} type="card" />
      </div>
    </T.Provider>
  );
}
