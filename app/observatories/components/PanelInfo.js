"use client";

/* Hooks */
import { useCallback, useEffect, useId, useRef, useState } from "react";

/* Icons */
import { InfoCircleOutlined } from "@ant-design/icons";

/* lib */
import { BRAND } from "@/lib/observatories/palette";

/* UI Library Components */
import { Popover, Typography } from "antd";

/* Constants */
const SECTIONS = [
  ["note", "Nota del panel"],
  ["what", "Qué muestra"],
  ["how", "Cómo leerla"],
  ["look", "Qué mirar"],
  ["care", "Cuidado"],
];
const POPUP_WIDTH = "min(440px, calc(100vw - 24px))";

/**
 * Content of the information window of a panel (F100, D-221): what the chart shows, how to read it, what to look at and what to
 * be careful with. `note` is the text that used to sit in the header of the card (D-223): it is shown first, not shortened.
 *
 * @param {{ what?: string, how?: string|string[], look?: string|string[], care?: string|string[] }} entry
 * @param {string} [note]
 */
export function PanelInfoContent({ entry, note }) {
  const values = { ...entry, note };
  return (
    <div data-testid="panel-info-content" style={{ maxHeight: "min(60vh, 440px)", overflowY: "auto", paddingRight: 4, fontSize: 13, lineHeight: 1.5 }}>
      {SECTIONS.map(([key, label]) => {
        const raw = values[key];
        const items = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
        if (!items.length) return null;
        return (
          <div key={key} data-testid={`panel-info-${key}`} style={{ marginBottom: 8 }}>
            <Typography.Text strong style={{ display: "block" }}>{label}</Typography.Text>
            {items.map((text) => (
              <Typography.Paragraph key={text.slice(0, 30)} style={{ marginBottom: 4 }}>{text}</Typography.Paragraph>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Information button (i) of a panel (F100): it sits in the header of the card, opens with a click or with the keyboard (Enter or space),
 * and closes with Esc, with a click outside or with the button again. The window is drawn on the body of the page, so the card never
 * cuts it, and it keeps inside the screen.
 *
 * @param {string} title - Title of the panel (accessible name of the button).
 * @param {Object} entry - Help of the panel (`what`, `how`, `look`, `care`).
 * @param {string} [note] - Text of the header that moved here.
 */
export default function PanelInfo({ title, entry, note }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const id = useId();
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      destroyTooltipOnHide
      overlayStyle={{ maxWidth: POPUP_WIDTH, width: POPUP_WIDTH }}
      content={<div id={id} role="dialog" aria-label={`Cómo leer: ${title}`}><PanelInfoContent entry={entry} note={note} /></div>}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Cómo leer el panel: ${title}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        data-testid="panel-info"
        style={{ border: 0, background: "transparent", padding: 2, cursor: "pointer", lineHeight: 1, color: BRAND.white, fontSize: 18, borderRadius: 4, display: "inline-flex", alignItems: "center" }}
      >
        <InfoCircleOutlined />
      </button>
    </Popover>
  );
}
