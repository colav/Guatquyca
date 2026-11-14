/*
 * BORRADOR: este texto debe ser revisado por la oficina jurídica de la Universidad de Antioquia
 * antes de publicarse. Puntos a confirmar: plazos de la Ley 1581 de 2012, y la redacción sobre
 * la información que aportan las instituciones por convenio.
 */

/* Data */
import { CONTACT_EMAIL } from "@/app/components/ServerSide/Footer/footerLinks";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

export const metadata = {
  title: "Política de privacidad",
  description:
    "Cómo ImpactU trata los datos personales: datos provenientes de fuentes abiertas, cookies, cuentas de acceso y canal de solicitudes.",
};

const LAST_UPDATE = "13 de noviembre de 2026";

/**
 * PrivacyPage is a "server-side" function component that shows the privacy policy of ImpactU.
 *
 * @returns {JSX.Element} A static page with the privacy policy.
 */
export default function PrivacyPage() {
  return (
    <Row justify="center">
      <Col xs={23} md={16}>
        <h1>Política de privacidad</h1>
        <p>Última actualización: {LAST_UPDATE}</p>
        <Divider />

        <h2>1. Quién es el responsable</h2>
        <p>
          ImpactU es operado por el grupo <b>CoLaV</b> de la Universidad de
          Antioquia (en adelante, «CoLaV»), que es el responsable del tratamiento
          de los datos personales descritos en esta política. Puedes escribirnos
          a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>2. De dónde provienen los datos que muestra ImpactU</h2>
        <p>
          Los datos de personas, productos, grupos e instituciones que ImpactU
          publica provienen de <b>fuentes que ya están en abierto</b>. ImpactU
          no crea esa información: la integra, la normaliza y la hace navegable.
          Las fuentes son, entre otras:
        </p>
        <ul>
          <li>
            <b>Datos abiertos de Minciencias</b> (datos.gov.co), con la
            información de ScienTI, CvLac y GrupLAC publicada por el
            Ministerio.
          </li>
          <li>
            <b>Perfiles públicos de CvLac</b>.
          </li>
          <li>
            <b>OpenAlex</b>, catálogo abierto de la producción científica
            mundial.
          </li>
          <li>
            <b>Perfiles públicos de Google Scholar</b>.
          </li>
          <li>
            Otras bases abiertas como <b>ORCID</b>, <b>Wikidata</b>, <b>ROR</b>,{" "}
            <b>DOAJ</b> y <b>Scimago</b>.
          </li>
        </ul>
        <p>
          Los datos personales que aparecen en ImpactU (por ejemplo, el nombre de
          un autor, su afiliación, sus productos de investigación y sus
          identificadores públicos como ORCID) son los que cada persona o cada
          fuente ya hizo públicos. Puedes ver la lista completa y su descripción
          en <a href="/about/fuentes">Fuentes de información y entidades</a>.
        </p>
        <p>
          Además, las instituciones que firmaron convenio con ImpactU pueden
          aportar información institucional propia (por ejemplo, datos de
          vinculación) para mejorar la calidad de los registros. Esa información
          se usa bajo los acuerdos de colaboración y confidencialidad firmados
          con cada institución, y los campos sensibles <b>no se publican</b> ni
          se incluyen en los archivos de datos abiertos.
        </p>

        <h2>3. Qué hacemos con esos datos</h2>
        <p>
          Los usamos para ofrecer información sobre la investigación en
          Colombia: perfiles, indicadores, búsquedas y descargas. No vendemos
          datos personales ni los usamos para publicidad.
        </p>

        <h2>4. Tus derechos y cómo ejercerlos</h2>
        <p>
          De acuerdo con la Ley 1581 de 2012 y sus normas reglamentarias, puedes
          conocer, actualizar y rectificar tus datos, y solicitar su
          supresión cuando proceda. Para hacerlo, escribe a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> con el asunto{" "}
          <b>«Solicitud de datos personales - ImpactU»</b> e incluye:
        </p>
        <ul>
          <li>Tu nombre y la dirección web (URL) de tu perfil en ImpactU.</li>
          <li>Tu ORCID o tu CvLac, o un correo institucional que permita verificar que eres tú.</li>
          <li>Qué quieres corregir, actualizar o retirar.</li>
        </ul>
        <p>
          Atenderemos las consultas en un máximo de 10 días hábiles y los
          reclamos en un máximo de 15 días hábiles, prorrogables en los casos
          que la ley permite.
        </p>
        <p>
          Como ImpactU se alimenta de fuentes externas, si el error está en la
          fuente original (por ejemplo, tu CvLac o OpenAlex), la corrección
          definitiva debe hacerse allí. ImpactU la reflejará en su siguiente
          actualización de datos. Si el error es de ImpactU (por ejemplo, una
          afiliación mal asignada), lo corregimos nosotros.
        </p>

        <h2>5. Datos de navegación y cookies</h2>
        <ul>
          <li>
            <b>Google Analytics:</b> usamos esta herramienta para conocer, de
            forma agregada, cuántas personas visitan ImpactU y qué secciones
            consultan. Instala cookies en tu navegador (<code>_ga</code> y{" "}
            <code>_ga_*</code>). Puedes bloquearlas desde la configuración de tu
            navegador o con el{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              complemento de inhabilitación de Google Analytics
            </a>
            .
          </li>
          <li>
            <b>Registro de errores técnicos:</b> para detectar y corregir fallos
            usamos un servicio de monitoreo operado por CoLaV en sus propios
            servidores. No registramos tu dirección IP ni tus cookies con esos
            reportes. En algunos casos se guarda una reproducción técnica de la
            sesión, con el texto de la pantalla enmascarado, solo para
            diagnosticar el error.
          </li>
          <li>
            <b>Cookies de sesión:</b> si inicias sesión, se usan cookies
            estrictamente necesarias para mantener tu sesión de forma segura.
          </li>
        </ul>

        <h2>6. Cuentas de acceso</h2>
        <p>
          El inicio de sesión no está abierto al público. Solo pueden acceder las
          personas que cada institución participante en el convenio con ImpactU
          designa. El tratamiento de la información asociada a esas cuentas se
          rige por los contratos y acuerdos de colaboración y confidencialidad
          firmados con cada institución.
        </p>

        <h2>7. Cambios a esta política</h2>
        <p>
          Podemos actualizar esta política. La fecha de la última actualización
          aparece al inicio de esta página.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Para cualquier duda sobre esta política, escríbenos a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <br />
      </Col>
    </Row>
  );
}
