"use client";

/* UI Library Components */
import { Alert } from "antd";

/** Cut-off date of the data, shown at the end of the three boards (D-108, confirmed by Luis). It changes in this one place. */
export const CUTOFF_FOOTER = "Datos consultados en octubre de 2026.";

/** Note with the cut-off date of the data. */
export default function CutoffNote() {
  return <Alert type="info" showIcon style={{ marginTop: 16 }} message={CUTOFF_FOOTER} />;
}
