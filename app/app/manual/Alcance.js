/* Styles */
import styles from "./styles.module.css";

/**
 * Alcance is a server-side functional component that renders a paragraph of text.
 *
 * The paragraph describes the scope of the manual and its intended audience. It includes two bold sections: "Impact" and "U".
 *
 * @returns {JSX.Element} A paragraph element with the class "normal_text". The paragraph contains the scope description.
 */
export default function Alcance() {
  return (
    <p className={styles.normal_text}>
      El presente manual describe los procedimientos necesarios para que las
      instituciones universitarias que tengan interés en vincularse a{" "}
      <b id={styles.impact}>Impact</b>
      <b id={styles.u}>U</b> o ya sean usuarias puedan gestionar los datos y
      métricas que proporciona esta plataforma colaborativa.
    </p>
  );
}
