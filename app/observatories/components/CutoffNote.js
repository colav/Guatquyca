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
 * Note with the cut-off date of the data, at the end of the three boards. The text comes from
 * GET /observatories/vri-udea/cut (02 §3.12, field `texto`); if the call fails the fixed text stays.
 */
export default function CutoffNote() {
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

  return <Alert type="info" showIcon style={{ marginTop: 16 }} message={text} />;
}
