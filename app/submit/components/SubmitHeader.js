/* Styles */
import styles from "../styles.module.css";

/**
 * SubmitHeader component displays the header for the institutional file upload section.
 *
 * @returns {JSX.Element} Header and description for the submit page.
 */
export default function SubmitHeader() {
  return (
    <>
      <h2 className={styles.submitHeaderTitle}>
        Carga de información institucional
      </h2>
      <p className={styles.submitHeaderDescription}>
        Envíe los archivos oficiales de su institución para su validación y
        posterior integración en <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </p>
    </>
  );
}
