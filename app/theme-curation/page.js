"use client";

/* Next */
import Link from "next/link";

/* APIs */
import { listThemes } from "@/lib/apis/theme.api";

/* Components */
import ThemesTable from "./components/ThemesTable";

/* Hooks */
import { useCallback, useEffect, useState } from "react";

/* Styles */
import styles from "./styles.module.css";

/* Constants */
import { BREADCRUMB_ROOT } from "./lib/constants";
import { errorMessage } from "./lib/errors";

/* Icons */
import { PlusOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Alert, Breadcrumb, Button, Typography } from "antd";

const { Text } = Typography;

/**
 * ThemeCurationListPage is Screen 4 of the Theme Curation flow: "Mis ejes
 * temáticos" — a filterable listing of every theme curated so far (GET
 * /app/theme), with a way to open the wizard (/theme-curation/new) to
 * curate a new one.
 *
 * This is the root /theme-curation route. The 3-step creation wizard that
 * used to live here moved to /theme-curation/new so this listing could
 * take over the root — matching the Screen 4 mockup, where "Ejes
 * Temáticos" is the top-level landing, not the seed form.
 *
 * @returns {JSX.Element}
 */
export default function ThemeCurationListPage() {
  const [themes, setThemes] = useState(null); // null = initial load in flight
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const loadThemes = useCallback(() => {
    setError(null);
    listThemes()
      .then((result) => setThemes(result.data ?? []))
      .catch((e) => {
        setThemes((prev) => prev ?? []);
        setError(
          errorMessage(e, "No se pudo cargar el listado de ejes temáticos."),
        );
      });
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[{ title: BREADCRUMB_ROOT }]}
        className={styles.breadcrumb}
      />

      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.headerTitle}>Ejes temáticos curados</h1>
          <p className={styles.headerDescription}>
            <Text type="secondary">
              Consulta, explora y exporta los ejes ya validados por expertos.
            </Text>
          </p>
        </div>

        <Link href="/theme-curation/new">
          <Button type="primary" size="large" icon={<PlusOutlined />}>
            Nuevo eje
          </Button>
        </Link>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" onClick={loadThemes}>
              Reintentar
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      <ThemesTable
        themes={themes}
        loading={themes === null}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}
