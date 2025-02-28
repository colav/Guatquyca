/* Components */
import MetricsTable from "./MetricsTable";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

export const metadata = {
  title: "Métricas responsables",
  description:
    "Descubre cómo ImpactU promueve Métricas Responsables en la evaluación de la investigación. Adoptamos enfoques éticos y equitativos para medir el impacto académico con transparencia y rigor.",
};

/**
 * Metrics is a "server-side" function component that displays the "Metrics" page.
 *
 * @returns {JSX.Element} A static page with components from Ant Design library that contains a title,
 * a MetricsTable component, and a list of bibliographic references.
 */
export default function Metrics() {
  return (
    <Row justify="center" style={{ marginTop: "30px" }}>
      <Col xs={20} lg={14}>
        <Divider>Métricas Responsables</Divider>
      </Col>
      <Col xl={18} xs={23}>
        <MetricsTable />
      </Col>
      <Col xl={18} xs={23} style={{ marginTop: "20px" }}>
        <h3>Referencias Bibliográficas</h3>
        <ul>
          <li>
            Cuartas, G. V., Uribe-Tirado, A., Restrepo-Quintero, D.,
            Ochoa-Gutierrez, J., Pallares, C., Gómez-Molina, H. F.,
            Suárez-Tamayo, M., & Calle, J. (2019). Hacia un modelo de medición
            de la ciencia desde el Sur Global: Métricas responsables. Palabra
            Clave (La Plata), 8(2), e068-e068.{" "}
            <a
              href="https://doi.org/10.24215/18539912e068"
              target="_blank"
              rel="noreferrer"
            >
              https://doi.org/10.24215/18539912e068
            </a>
          </li>
          <li>
            DORA (2012). San Francisco Declaration on Research Assessment.
            Disponible en:{" "}
            <a href="https://sfdora.org/read/" target="_blank" rel="noreferrer">
              https://sfdora.org/read/
            </a>
          </li>
          <li>
            Hicks, D., Wouters, P., Waltman, L. et al. Bibliometrics: The Leiden
            Manifesto for research metrics. Nature 520, 429-431 (2015).{" "}
            <a
              href="https://doi.org/10.1038/520429a"
              target="_blank"
              rel="noreferrer"
            >
              https://doi.org/10.1038/520429a
            </a>
          </li>
          <li>
            Tejada, M.A., Chalela, S., & Pallares, C. (2021). ABC de las
            Métricas Responsables. Consorcio Colombia. Disponible en:{" "}
            <a
              href="https://www.youtube.com/watch?v=bVfaRX0AFJc&t=3551s"
              target="_blank"
              rel="noreferrer"
            >
              https://www.youtube.com/watch?v=bVfaRX0AFJc&t=3551s
            </a>
          </li>
          <li>
            Wilsdon, J. (2016). The metric tide: The independent review of the
            role of metrics in research assessment & management. (p. 180).{" "}
            <a
              href="https://responsiblemetrics.org/the-metric-tide/"
              target="_blank"
              rel="noreferrer"
            >
              https://responsiblemetrics.org/the-metric-tide/
            </a>
          </li>
        </ul>
      </Col>
    </Row>
  );
}
