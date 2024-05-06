/* Styles */
import styles from "./styles.module.css";

/**
 * AQuien is a server-side functional component that renders a list of target audiences for the manual.
 *
 * Each list item contains a paragraph describing a specific audience.
 *
 * @returns {JSX.Element} An unordered list element with the class "normal_text". Each list item represents a target audience.
 */
export default function AQuien() {
  return (
    <ul className={styles.normal_text}>
      <li>
        Personal de vicerrectorías, direcciones de investigación universitarias
        y equipos administrativos de gestión de la investigación.
      </li>
      <li>
        Personal de apoyo en manejos de sistemas de información relacionados con
        la misión de investigación.
      </li>
      <li>
        Personal universitario encargado de procesos de evaluación y
        autoevaluación.
      </li>
      <li>
        Personas interesadas en el desempeño investigativo de las universidades:
        medios de comunicación, organizaciones no académicas, y otros actores.
      </li>
    </ul>
  );
}
