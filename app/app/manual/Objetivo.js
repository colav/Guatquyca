/* Styles */
import styles from "./styles.module.css";

/**
 * Objetivo is a client-side functional component that renders a paragraph of text.
 * The paragraph describes the purpose of the manual.
 *
 * The text includes two bold sections: "CRIS" and "ImpactU".
 * The "ImpactU" text is split into two parts, "Impact" and "U", each with its own styling.
 *
 * @returns {JSX.Element} A paragraph element with the class "big_text".
 */
export default function Objetivo() {
  return (
    <p className={styles.normal_text}>
      El propósito de este manual es suministrar las pautas para la
      implementación de estrategias responsables de medición y evaluación con el
      apoyo de sistemas tipo <b>CRIS</b> apoyados en los recursos que ofrece{" "}
      <b id={styles.impact}>Impact</b>
      <b id={styles.u}>U</b>.
    </p>
  );
}
