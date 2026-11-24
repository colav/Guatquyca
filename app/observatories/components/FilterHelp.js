"use client";

/* Icons */
import { QuestionCircleOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Tooltip } from "antd";

/**
 * Help icon of a filter (F48b): a button that opens its tooltip with the mouse and with the keyboard focus, so
 * a long note does not take room under the control.
 *
 * @param {string} label - Name of the filter (for the accessible name of the button).
 * @param {React.ReactNode} children - Content of the tooltip.
 */
export default function FilterHelp({ label, children }) {
  return (
    <Tooltip title={children} trigger={["hover", "focus"]} placement="topLeft">
      <button
        type="button"
        aria-label={`Ayuda del filtro ${label}`}
        style={{ border: 0, background: "transparent", padding: 0, cursor: "help", lineHeight: 1, color: "rgba(0,0,0,.45)" }}
        data-testid="filter-help"
      >
        <QuestionCircleOutlined />
      </button>
    </Tooltip>
  );
}
