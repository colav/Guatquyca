"use client";

/* lib */
import { loadErrorSubtitle } from "@/lib/observatories/data/loadError";

/* UI Library Components */
import { Button, Result } from "antd";

/**
 * Error screen of a board whose bundle could not be loaded. "Reintentar" asks for the bundle again
 * without reloading the page. Provisional texts: Luis approves them.
 *
 * @param {Error} error - Failure of the request.
 * @param {Function} onRetry - Starts the load again.
 */
export default function LoadError({ error, onRetry }) {
  return (
    <Result
      status="warning"
      title="No se pudieron cargar los datos del tablero."
      subTitle={loadErrorSubtitle(error)}
      extra={<Button type="primary" onClick={onRetry}>Reintentar</Button>}
    />
  );
}
