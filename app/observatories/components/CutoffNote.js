"use client";

/* Hooks */
import { useEffect, useState } from "react";

/* APIs */
import { getCutoff } from "@/lib/apis/observatory.api";

/* UI Library Components */
import { Alert } from "antd";

/** Fixed text used until /cut answers and when it fails (D-108, confirmed by Luis); the API `texto` replaces it. */
export const CUTOFF_FOOTER = "Datos consultados en octubre de 2026.";

/**
 * The only box of methodological notes at the foot of each board (Q-24, F91): the numbered notes of the board and, as the last one,
 * the cut-off date of the data. The date comes from GET /observatories/vri-udea/cut (02 §3.12, field `texto`); if the call fails
 * the fixed text stays.
 *
 * @param {string[]} [notes] - Notes of the board, in order (without the date).
 */
export default function CutoffNote({ notes = [] }) {
  const [text, setText] = useState(CUTOFF_FOOTER);

  useEffect(() => {
    const controller = new AbortController();
    getCutoff("vri-udea", { signal: controller.signal })
      .then((cut) => {
        if (cut && typeof cut.texto === "string" && cut.texto) setText(cut.texto);
      })
      .catch(() => {
        /* The fixed text stays: the footer is not worth an error message. */
      });
    return () => controller.abort();
  }, []);

  return (
    <Alert
      type="info"
      showIcon
      data-testid="method-notes"
      style={{ marginTop: 16 }}
      message="Notas metodológicas"
      description={<ol style={{ margin: 0, paddingLeft: 18 }}>{[...notes, text].map((n) => <li key={n.slice(0, 40)}>{n}</li>)}</ol>}
    />
  );
}
