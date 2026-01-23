/* Styles */
import styles from "../styles.module.css";

/* UI Library Components */
import { Card, Select } from "antd";

/**
 * SubmitTypeSelector component for selecting the type of file to submit.
 *
 * @param {Object} submitTypes - Object containing submit type configurations. Each key maps to an object with `label`,
 * `description`, and `notes` (array of strings).
 * @param {string|null} value - The currently selected submit type key.
 * @param {function} onChange - Callback fired when the selection changes. Receives the selected key as argument.
 * @returns {JSX.Element} Rendered selector UI.
 */
export default function SubmitTypeSelector({ submitTypes, value, onChange }) {
  const selected = value ? submitTypes[value] : null;

  return (
    <Card className={styles.submitTypeCard}>
      <b>Selecciona el tipo de archivo que deseas subir:</b>

      <Select
        placeholder="Seleccione el tipo de archivo"
        className={styles.submitTypeSelect}
        value={value}
        onChange={onChange}
        options={Object.entries(submitTypes).map(([key, cfg]) => ({
          value: key,
          label: cfg.label,
        }))}
      />

      {selected && (
        <>
          <p className={styles.submitTypeDescription}>{selected.description}</p>

          <ul className={styles.submitTypeNotesList}>
            {selected.notes.map((note, i) => (
              <li key={i}>
                <p className={styles.submitTypeNote}>{note}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
