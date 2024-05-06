/* Styles */
import styles from "./styles.module.css";

/**
 * Bibliografia is a server-side functional component that renders a list of bibliographic references.
 *
 * Each list item contains a reference to a source related to the content of the manual. The references include academic articles and chapters from books. Each reference includes a link to the source.
 *
 * @returns {JSX.Element} A fragment containing an unordered list element with the class "normal_text". Each list item represents a bibliographic reference.
 */
export default function Bibliografia() {
  return (
    <>
      <ul className={styles.normal_text}>
        <li>
          Couture, S., & Toupin, S. (2019). What does the notion of
          ''sovereignty'' mean when referring to the digital? NEW MEDIA \&
          SOCIETY, 21(10), 2305–2322.{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://doi.org/10.1177/1461444819865984"
          >
            https://doi.org/10.1177/1461444819865984
          </a>
        </li>
        <li>
          Haché, A. (2014). Technological sovereignty. Mouvements 79(3): 38–48.
        </li>
        <li>
          Hummel, P., Braun, M., Tretter, M., & Dabrock, P. (2021). Data
          sovereignty: A review. BIG DATA \& SOCIETY, 8(1).{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://doi.org/10.1177/2053951720982012"
          >
            https://doi.org/10.1177/2053951720982012
          </a>
        </li>
        <li>
          Pedreira, V., Barros, D., & Pinto, P. (2021). A Review of Attacks,
          Vulnerabilities, and Defenses in Industry 4.0 with New Challenges on
          Data Sovereignty Ahead. SENSORS, 21(15).{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://doi.org/10.3390/s21155189"
          >
            https://doi.org/10.3390/s21155189
          </a>
        </li>
        <li>
          Thornberry, P. (2012). The UN draft Declaration on the Rights of
          Indigenous Peoples. Indigenous Peoples and Human Rights, 370–396.{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://doi.org/10.7228/manchester/9780719037931.003.0016"
          >
            https://doi.org/10.7228/manchester/9780719037931.003.0016
          </a>
        </li>
      </ul>
    </>
  );
}
