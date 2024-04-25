/* Styles */
import styles from "./styles.module.css";

/**
 * Fuentes is a server-side functional component that renders a list of references.
 *
 * Each list item contains a reference to a source related to the content of the manual. The references include academic articles, declarations, manifestos, videos, and reports. Each reference includes a link to the source.
 *
 * @returns {JSX.Element} An unordered list element with the class "normal_text". Each list item represents a reference.
 */
export default function Fuentes() {
  return (
    <>
      <ul className={styles.normal_text}>
        <li>
          DORA (2012). San Francisco Declaration on Research Assessment.
          Disponible en:{" "}
          <a target="_blank" rel="noreferrer" href="https://sfdora.org/read/">
            https://sfdora.org/read/
          </a>
        </li>
        <li>
          Hicks, D., Wouters, P., Waltman, L. et al. Bibliometrics: The Leiden
          Manifesto for research metrics. Nature 520, 429–431 (2015).{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://doi.org/10.1038/520429a"
          >
            https://doi.org/10.1038/520429a
          </a>
        </li>
        <li>
          Observatorio Distrital en Salud. Métricas responsables. Disponible en:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://sds-investigacion.azurewebsites.net/app/metrics"
          >
            https://sds-investigacion.azurewebsites.net/app/metrics
          </a>
        </li>
        <li>
          Sugimoto, C.R., Allen, L., Bosman, J., Cicero, T., Curry, S., de
          Rijcke, S., Flanagin, A., Garfinkle, M., Hill, M., Larivière, V., Lin,
          J., Malgarini, M., Martin, B., McVeigh, M.E., Mugabushaka, A.-M.,
          Murray, D., Pedrosa, R.H.L, Plume, A., Pringle, J., Pulverer, B.,
          Roelandse, M., Shu, F., Walker, J., Waltman, L., Wouters, P. (2019).
          Rethinking Impact Factors: New Pathways in Journal Metrics. [version
          1; not peer reviewed]. F1000Research 2019,
        </li>
        <li>
          Tejada, M.A., Chalela, S., & Pallares, C. (2021). ABC de las Métricas
          Responsables. Consorcio Colombia. Disponible en:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/watch?v=bVfaRX0AFJc&t=3551s"
          >
            https://www.youtube.com/watch?v=bVfaRX0AFJc&t=3551s
          </a>
        </li>
        <li>
          Vélez Cuartas, G., Uribe-Tirado, A., Restrepo-Quintero, D.,
          Ochoa-Gutierrez, J., Pallares, C., Gómez-Molina, H. F., Suárez-Tamayo,
          M., & Calle, J. (2019). Hacia un modelo de medición de la ciencia
          desde el Sur Global: Métricas responsables. Palabra Clave (La Plata),
          8(2), e068-e068.{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://doi.org/10.24215/18539912e068"
          >
            https://doi.org/10.24215/18539912e068
          </a>
        </li>
        <li>
          Wilsdon, J. (2016). The metric tide: The independent review of the
          role of metrics in research assessment & management. (p. 180).{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://responsiblemetrics.org/the-metric-tide/"
          >
            https://responsiblemetrics.org/the-metric-tide/
          </a>
        </li>
      </ul>
    </>
  );
}
