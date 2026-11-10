"use client";

/* Hooks */
import { useEffect, useState } from "react";

/* APIs */
import { getCutoff } from "@/lib/apis/observatory.api";
import { sourceLines } from "@/lib/observatories/cutSources";

/* UI Library Components */
import { Alert } from "antd";

/** Fixed text used until /cut answers and when it fails (D-108, confirmed by Luis); the API `texto` replaces it. */
export const CUTOFF_FOOTER = "Datos consultados en octubre de 2026.";

/**
 * The only box of methodological notes at the foot of each board (Q-24, F91): the numbered notes of the board and, as the last one,
 * the cut-off date of the data. The date comes from GET /observatories/vri-udea/cut (02 §3.12, field `texto`); if the call fails
 * the fixed text stays.
 *
 * F95 (Q-31, B148): when the API gives `fuentes`, the last note lists the sources that the board uses, each with its real date (a source
 * without a date says its detail; no date is written here and the date of loading of the bundle is not shown). Without `fuentes` (the
 * call fails or the base is older) the fixed text of before stays.
 *
 * @param {string[]} [notes] - Notes of the board, in order (without the last one).
 * @param {1|2|3} [board] - Board that uses the box: it picks its sources.
 */
export default function CutoffNote({ notes = [], board }) {
  const [text, setText] = useState(CUTOFF_FOOTER);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getCutoff("vri-udea", { signal: controller.signal })
      .then((cut) => {
        if (cut && typeof cut.texto === "string" && cut.texto) setText(cut.texto);
        if (cut && board) setSources(sourceLines(cut.fuentes, board));
      })
      .catch(() => {
        /* The fixed text stays: the footer is not worth an error message. */
      });
    return () => controller.abort();
  }, [board]);

  return (
    <Alert
      type="info"
      showIcon
      data-testid="method-notes"
      style={{ marginTop: 16 }}
      message="Notas metodológicas"
      description={<ol style={{ margin: 0, paddingLeft: 18 }}>{notes.map((n) => <li key={n.slice(0, 40)}>{n}</li>)}
          {sources.length ? (
            <li key="sources" data-testid="cut-sources">
              Fuentes y fechas de corte:
              <ul style={{ margin: 0, paddingLeft: 18 }}>{sources.map((s) => <li key={s.slice(0, 40)}>{s}</li>)}</ul>
            </li>
          ) : (
            <li key="cut">{text}</li>
          )}
        </ol>}
    />
  );
}
