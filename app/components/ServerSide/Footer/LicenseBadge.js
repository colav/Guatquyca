"use client";

/* Hooks */
import { useState } from "react";

/* UI Library Components */
import { Tooltip } from "antd";

/* Constants */
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
// Same official 88x31 badge that Licenses shows for "CC BY" in the sources lists.
const BADGE_SRC = "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png";
const LICENSE_NAME = "Licencia Creative Commons Atribución 4.0 Internacional";
const TOOLTIP_TEXT =
  "Todos los datos e información de ImpactU se publican en abierto bajo la licencia CC BY 4.0. Los datos que consumimos e integramos desde distintas fuentes también están en abierto y tienen sus propias licencias.";

/**
 * LicenseBadge shows the CC BY 4.0 badge of ImpactU as a link to the license (new tab) with a tooltip
 * on hover and keyboard focus. The tooltip is closed on click, so on touch screens it does not stay
 * open when the person comes back from the license page.
 *
 * @component
 * @returns {JSX.Element} The badge link wrapped in a tooltip.
 */
export default function LicenseBadge() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      title={TOOLTIP_TEXT}
      open={open}
      onOpenChange={setOpen}
      trigger={["hover", "focus"]}
      placement="top"
      styles={{ root: { maxWidth: 340 } }}
    >
      <a
        style={{ display: "inline-block", marginTop: 8, lineHeight: 0 }}
        href={LICENSE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${LICENSE_NAME}. Se abre en una pestaña nueva`}
        onClick={() => setOpen(false)}
      >
        <img src={BADGE_SRC} alt={LICENSE_NAME} width={88} height={31} />
      </a>
    </Tooltip>
  );
}
