/*
 * BORRADOR: este texto debe ser revisado por la oficina jurídica de la Universidad de Antioquia
 * antes de publicarse. Puntos a confirmar: cláusula de exención de responsabilidad y ley aplicable.
 */

/* Data */
import { CONTACT_EMAIL } from "@/app/components/ServerSide/Footer/footerLinks";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

export const metadata = {
  title: "Términos de uso",
  description:
    "Condiciones de uso de ImpactU: licencias, límites de uso del API, cuentas de acceso y alcance de la información.",
};

const LAST_UPDATE = "13 de noviembre de 2026";

/**
 * TermsPage is a "server-side" function component that shows the terms of use of ImpactU.
 *
 * @returns {JSX.Element} A static page with the terms of use.
 */
export default function TermsPage() {
  return (
    <Row justify="center">
      <Col xs={23} md={16}>
        <h1>Términos de uso</h1>
        <p>Última actualización: {LAST_UPDATE}</p>
        <Divider />

        <h2>1. Alcance</h2>
        <p>
          Estos términos regulan el uso del sitio web y de las APIs públicas de
          ImpactU, operados por el grupo <b>CoLaV</b> de la Universidad de
          Antioquia. Al usar ImpactU aceptas estos términos. El tratamiento de
          datos personales se describe en la{" "}
          <a href="/privacidad">política de privacidad</a>.
        </p>

        <h2>2. Licencia de los contenidos y datos</h2>
        <ul>
          <li>
            Los contenidos y datos de ImpactU se publican en abierto bajo la
            licencia{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Atribución 4.0 Internacional (CC BY 4.0)
            </a>
            . Puedes copiarlos, redistribuirlos y adaptarlos, incluso con fines
            comerciales, siempre que des el crédito correspondiente.
          </li>
          <li>
            El software que soporta ImpactU es de código abierto. Cada
            repositorio en GitHub indica su propia licencia. Consulta la lista en{" "}
            <a href="/open-source">Código abierto</a>.
          </li>
          <li>
            Los datos que ImpactU integra desde otras fuentes (por ejemplo,
            OpenAlex o Minciencias) conservan las licencias y condiciones de su
            origen. ImpactU no los relicencia.
          </li>
        </ul>
        <p>
          <b>Cómo dar el crédito:</b> «Fuente: ImpactU (CoLaV, Universidad de
          Antioquia), https://impactu.colav.co».
        </p>

        <h2>3. Límites de uso del API</h2>
        <p>
          Para proteger la estabilidad del servicio, el API de ImpactU aplica
          límites por dirección IP: <b>100.000 solicitudes por día</b> y{" "}
          <b>10 solicitudes por segundo</b>. Las solicitudes que superen esos
          límites pueden ser rechazadas. Si necesitas un volumen mayor,
          escríbenos a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          No está permitido usar el sitio o el API de forma que afecte su
          funcionamiento para otras personas, ni intentar eludir los límites.
        </p>

        <h2>4. Cuentas de acceso</h2>
        <p>
          El inicio de sesión es solo para las personas designadas por las
          instituciones participantes en el convenio con ImpactU. Las cuentas son
          personales: no debes compartir tus credenciales. El uso de las cuentas
          y de la información que se gestiona con ellas se rige además por los
          acuerdos de colaboración y confidencialidad firmados con cada
          institución.
        </p>

        <h2>5. Calidad de la información</h2>
        <p>
          ImpactU reúne y normaliza datos de múltiples fuentes, y puede contener
          errores, omisiones o información desactualizada. Se ofrece «tal cual»,
          sin garantías de exactitud o de que sirva para un fin particular. Si
          encuentras un error, consulta cómo solicitar una corrección en la{" "}
          <a href="/privacidad">política de privacidad</a>. Las decisiones que
          tomes con base en esta información son de tu responsabilidad.
        </p>

        <h2>6. Enlaces a terceros</h2>
        <p>
          ImpactU enlaza a sitios de terceros. No controlamos su contenido ni sus
          condiciones de uso.
        </p>

        <h2>7. Cambios y contacto</h2>
        <p>
          Podemos actualizar estos términos. La fecha de la última actualización
          aparece al inicio de esta página. Para cualquier duda, escríbenos a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <br />
      </Col>
    </Row>
  );
}
