/* Icons */
import { DollarOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * APCTag
 *
 * Displays a tag with Article Processing Charges (APC) information for a journal.
 * The component shows the APC amount in its respective currency and includes a tooltip
 * with a detailed explanation of what APCs are and how the values are sourced.
 *
 * @component
 * @param {Object} apc - The APC data object.
 * @param {number} apc.charges - The APC amount in the specified currency.
 * @param {string} apc.currency - The currency code (e.g., "USD", "COP").
 * @returns {JSX.Element} A Tag component wrapped in a Tooltip displaying the APC information.
 *
 */
export default function APCTag({ apc }) {
  return (
    <Tooltip
      color="white"
      styles={{
        body: { width: "500px", color: "black", padding: "2px 15px" },
      }}
      title={
        <p>
          <b>APC (Article Processing Charges):</b> Es una tarifa que algunas
          revistas cobran para publicar en acceso abierto. El valor mostrado es
          una estimación, OpenAlex usa datos públicos (OpenAPC, DOAJ y precios
          listados por las revistas). Como muchos APC reales no son públicos, el
          monto puede ser mayor o menor al realmente pagado.
        </p>
      }
    >
      <Tag className={styles.apc_tag}>
        <DollarOutlined /> APC: {apc.charges.toLocaleString("es-CO")}{" "}
        {apc.currency}
      </Tag>
    </Tooltip>
  );
}
