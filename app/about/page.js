/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Row, Table, Tabs } from "antd";

/* UI Library Sub-components */
const Column = Table;

export const metadata = {
  title: "Acerca de ImpactU",
  description:
    "ImpactU es un laboratorio de I+D que impulsa la evaluación responsable de la investigación en Colombia. Nuestra plataforma CRIS facilita la gestión científica con un enfoque en ciencia abierta y diversidad.",
};

const tableData = [
  {
    key: "1",
    type: "Productos",
    impactu: "2.545.925",
    openalex: "481.700",
    scopus: "219.799",
    minciencias: "724.625",
    scholar: "359.433",
  },
  {
    key: "2",
    type: "Proyectos de Investigación",
    impactu: "109.558",
    openalex: "0",
    scopus: "0",
    minciencias: "109.558",
    scholar: "0",
  },
  {
    key: "3",
    type: "Patentes",
    impactu: "1.904",
    openalex: "0",
    scopus: "0",
    minciencias: "1.904",
    scholar: "0",
  },
];

const items = [
  {
    key: "1",
    label: "Presentación",
    children: (
      <Row justify="start">
        <Col span={24}>
          <h3 className={styles.margin0}>Definición</h3>
          <p>
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> es Infraestructura Académica Abierta que
            ofrece una plataforma tipo CRIS (Current Research Information
            System) para Colombia, software de código abierto para su
            implementación y un espacio colaborativo entre las instituciones
            colombianas para mejorar sus procesos de gestión del conocimiento y
            evaluación científica.
          </p>
          <p>
            Los principios de operación de <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> como Infraestructura Académica Abierta:
          </p>
          <Image
            priority={true}
            src={"/media/diagrama_infra_abierta.svg"}
            alt="Infraestructura Académica Abierta"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={970}
            height={400}
          />
          <Divider />
          <h3 className={styles.margin0}>Gobernanza</h3>
          <p>
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> es creada y orientada por el <b>CoLaV</b> de
            la <b>Universidad de Antioquia</b>, la <b>Universidad del Valle</b>,
            la
            <b>Universidad Externado de Colombia</b> y la{" "}
            <b>Universidad Autónoma Latinoamericana</b>. Está en proceso de
            constitución de un consorcio nacional auspiciado por <b>ASCUN</b>{" "}
            que democratizará su propiedad entre todas las instituciones
            colombianas interesadas en la membresía.
          </p>
          <Divider />
          <h3 className={styles.margin0}>Propósitos</h3>
          <p>
            Ofrecer el sistema de información más robusto y completo sobre la
            información de investigación del país con datos abiertos. Por
            ejemplo:
          </p>
          <ul>
            <li>
              <a
                href="https://impactu.colav.co"
                target="_blank"
                rel="noreferrer"
              >
                https://impactu.colav.co
              </a>
            </li>
            <li>
              <a
                href="https://apis.colav.co/apidoc/index.html"
                target="_blank"
                rel="noreferrer"
              >
                https://apis.colav.co/apidoc/index.html
              </a>
            </li>
          </ul>
          Promover ambientes de aprendizaje colaborativos entre las
          instituciones del país. Por ejemplo:
          <ul>
            <li>
              <a
                href="https://www.youtube.com/watch?v=xnibrCrnH-E&t=747s&pp=ygUOaW1wYWN0dSBjb3JlbWE%3D"
                target="_blank"
                rel="noreferrer"
              >
                Lanzamiento de la plataforma ImpactU - UdeA
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=1twI_ifnaTA&t=402s&pp=ygUNaW1wYWN0dSBhc2N1bg%3D%3D"
                target="_blank"
                rel="noreferrer"
              >
                Tecnologías y metodologías para la evaluación responsable de los
                impactos de la investigación - ASCUN
              </a>
            </li>
          </ul>
          Constituir un modelo de infraestructura académica abierta que sea
          replicable en otros países de la región y otros contextos
          territoriales y organizacionales. Por ejemplo:
          <ul>
            <li>
              <a
                href="https://github.com/colav"
                target="_blank"
                rel="noreferrer"
              >
                https://github.com/colav
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    ),
  },
  {
    key: "2",
    label: "Fuentes de información y entidades",
    children: (
      <Row justify="start">
        <h3 className={styles.margin0}>Oferta de información</h3>
        <p>
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> es la fuente de información más robusta sobre
          la investigación en Colombia. En la siguiente tabla comparativa se
          presentan diferentes tipos de oferta sobre datos de investigación en
          Colombia.
        </p>

        <p>
          Volumen de registros en <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> comparados.
        </p>
        <Col span={24}>
          <Table
            dataSource={tableData}
            pagination={false}
            bordered
            size="small"
            scroll={{ x: 830 }}
          >
            <Column title="Tipo" dataIndex="type" key="type" />
            <Column
              title={
                <>
                  <b id={styles.impact}>Impact</b>
                  <b id={styles.u}>U</b>
                  <sup> 1</sup>
                </>
              }
              dataIndex="impactu"
              key="impactu"
            />
            <Column
              title={
                <>
                  OpenAlex<sup> 2</sup>
                </>
              }
              dataIndex="openalex"
              key="openalex"
            />
            <Column
              title={
                <>
                  Scopus<sup> 3</sup>
                </>
              }
              dataIndex="scopus"
              key="scopus"
            />
            <Column
              title="Datos Abiertos de Minciencias"
              dataIndex="minciencias"
              key="minciencias"
            />
            <Column title="Google Scholar" dataIndex="scholar" key="scholar" />
          </Table>
          <p>
            <b>
              <sup>1</sup>
            </b>{" "}
            Datos consultados el 26 de junio de 2025 en:{" "}
            <a
              href="https://impactu.colav.co/search/works?max=10&page=1&sort=citations_desc"
              target="_blank"
              rel="noreferrer"
            >
              https://impactu.colav.co/search/works?max=10&page=1&sort=citations_desc
            </a>
          </p>
          <p>
            <b>
              <sup>2</sup>
            </b>{" "}
            Datos consultados el 26 de junio de 2025 en:{" "}
            <a
              href="https://openalex.org/works?page=1&filter=authorships.countries%3Acountries%2Fco"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://openalex.org/works?page=1&filter=authorships.countries%3Acountries%2Fco
            </a>{" "}
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> con sus procesos de normalización y cruce de
            bases de datos logró recuperar de OpenAlex 725.864 productos de esta
            base de datos.
          </p>
          <p>
            <b>
              <sup>3</sup>
            </b>{" "}
            Datos consultados el 4 de abril de 2025.
          </p>
          <Divider />
          <h3>Fuentes de información de las distintas entidades</h3>
          <Image
            priority={true}
            src={"/media/diagrama_fuentes_info.svg"}
            alt="Fuentes de información de las distintas entidades"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={970}
            height={400}
          />
          <p>
            El diagrama muestra las bases de datos que alimentan las diferentes
            entidades consideradas por <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b>.
          </p>
          <Divider />
          <h3 className={styles.margin0}>
            Entidades en <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b>
          </h3>
          <ul>
            <li>
              <b>Afiliaciones:</b> se consideran las instituciones, las unidades
              y subunidades académicas, los grupos de investigación, los
              municipios y departamentos, lo que da una ubicación geográfica y
              organizacional muy precisa.
            </li>
            <li>
              <b>Fuentes y publishers:</b> se consideran los nombres de las
              revistas y los nombres de los editores.
            </li>
            <li>
              <b>Personas:</b> Autorías normalizadas.
            </li>
            <li>
              <b>Productos:</b> los descriptores bibliográficos e
              identificadores asociados a la producción.
            </li>
          </ul>
          <Divider />
          <h3 className={styles.margin0}>Fuentes</h3>
          <ul>
            <li>
              <b>OpenAlex:</b>{" "}
              <a href="https://openalex.org/" target="_blank" rel="noreferrer">
                https://openalex.org/
              </a>
            </li>
            <li>
              <b>Scienti:</b>{" "}
              <a
                href="https://minciencias.gov.co/scienti"
                target="_blank"
                rel="noreferrer"
              >
                https://minciencias.gov.co/scienti
              </a>
            </li>
            <li>
              <b>Wikidata:</b>{" "}
              <a
                href="https://www.wikidata.org/wiki/Wikidata:Main_Page"
                target="_blank"
                rel="noreferrer"
                className={styles.wrapText}
              >
                https://www.wikidata.org/wiki/Wikidata:Main_Page
              </a>
            </li>
            <li>
              <b>Scimago:</b>{" "}
              <a
                href="https://www.scimagojr.com/"
                target="_blank"
                rel="noreferrer"
              >
                https://www.scimagojr.com/
              </a>
            </li>
            <li>
              <b>DOAJ:</b>{" "}
              <a href="https://doaj.org/" target="_blank" rel="noreferrer">
                https://doaj.org/
              </a>
            </li>
            <li>
              <b>Datos.gov (CvLac):</b>{" "}
              <a
                href="https://minciencias.gov.co/ciudadano/datosabiertos"
                target="_blank"
                rel="noreferrer"
                className={styles.wrapText}
              >
                https://minciencias.gov.co/ciudadano/datosabiertos
              </a>
            </li>
            <li>
              <b>Google Scholar:</b>{" "}
              <a
                href="https://scholar.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                https://scholar.google.com/
              </a>
            </li>
            <li>
              <b>ROR:</b>{" "}
              <a href="https://ror.org/" target="_blank" rel="noreferrer">
                https://ror.org/
              </a>
            </li>
            <li>
              <b>Contratación institucional:</b> bases de datos institucionales
              internas.
            </li>
            <li>
              <b>Producción institucional:</b> bases de datos institucionales
              internas.
            </li>
            <li>
              <b>En desarrollo:</b>
              <ul>
                <li>
                  <b>D-Space:</b> repositorios institucionales colombianos{" "}
                  <a
                    href="https://dspace.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://dspace.org/
                  </a>
                </li>
                <li>
                  <b>Orcid:</b> Integración de información en doble vía y con
                  posibilidad de intervención de los usuarios directamente en la
                  información de la plataforma.
                </li>
                <li>
                  <b>Publindex:</b> integración de la base de datos de
                  Publindex.
                </li>
              </ul>
            </li>
          </ul>
        </Col>
      </Row>
    ),
  },
  {
    key: "3",
    label: "Alianzas y proyectos",
    children: (
      <>
        <h3 className={styles.margin0}>
          Consejo Latinoamericano de Ciencias Sociales (CLACSO) -{" "}
          <a href="https://www.clacso.org/" target="_blank" rel="noreferrer">
            https://www.clacso.org/
          </a>
        </h3>
        <ul>
          <li>
            <b>Foro Latinomericano de Evaluación Científica:</b>{" "}
            <a
              href="https://www.youtube.com/watch?v=-W8qtWB3eGA&t=37s"
              target="_blank"
              rel="noreferrer"
            >
              https://www.youtube.com/watch?v=-W8qtWB3eGA&t=37s
            </a>
          </li>
          <br />
          <li>
            <b>Proyecto IDRC-CLACSO:</b> Perfiles Latinoamericanos de
            Instrumentos de Política Pública en Investigación e Innovación y el
            Papel de los ODS.{" "}
            <a
              href="https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16929/1/Informe-IDRC-FOLEC-ESP.pdf"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16929/1/Informe-IDRC-FOLEC-ESP.pdf
            </a>
          </li>
          <br />
          <li>
            <b>Grupo Ciencia abierta como bien común:</b>{" "}
            <ul>
              <li>
                <a
                  href="https://www.clacso.org/ciencia-abierta-como-bien-comun/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://www.clacso.org/ciencia-abierta-como-bien-comun/
                </a>
              </li>
              <li>
                <a
                  href="https://www.clacso.org/en/grupos-de-trabajo/grupos-de-trabajo-2023-2025/?pag=detalle&refe=7&ficha=2392"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.wrapText}
                >
                  https://www.clacso.org/en/grupos-de-trabajo/grupos-de-trabajo-2023-2025/?pag=detalle&refe=7&ficha=2392
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>
          Centro de Estudios de Circulación del Conocimiento -{" "}
          <a
            href="https://cecic.fcp.uncuyo.edu.ar/"
            target="_blank"
            rel="noreferrer"
          >
            https://cecic.fcp.uncuyo.edu.ar/
          </a>
        </h3>
        <ul>
          <li>
            <b>La producción argentina en acceso abierto y pagos de APC.</b>{" "}
            <a
              href="https://www.conicet.gov.ar/wp-content/uploads/INFORME-CONICET-Argentina-Publicaciones-y-Pagos-de-APC.pdf"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://www.conicet.gov.ar/wp-content/uploads/INFORME-CONICET-Argentina-Publicaciones-y-Pagos-de-APC.pdf
            </a>
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>
          Consortia -{" "}
          <a
            href="https://www.consortia.com.co/"
            target="_blank"
            rel="noreferrer"
          >
            https://www.consortia.com.co/
          </a>
        </h3>
        <ul>
          <li>
            Identificación de pagos de APC por parte de las instituciones de
            educación superior (IES) colombianas: énfasis en las pertenecientes
            al Consorcio Colombia.{" "}
            <a
              href="https://bibliotecadigital.udea.edu.co/entities/publication/d0bc97f0-b088-4523-b560-5c1f799cde82"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://bibliotecadigital.udea.edu.co/entities/publication/d0bc97f0-b088-4523-b560-5c1f799cde82
            </a>
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>
          Transformative Innovation Policy Consortium -{" "}
          <a href="https://tipconsortium.net/" target="_blank" rel="noreferrer">
            https://tipconsortium.net/
          </a>
        </h3>
        <ul>
          <li>
            <b>Transformative Metrics:</b> Contributions to the Studies for
            Monitoring and Evaluating How Science, Technology, and Innovation
            Can Address Social and Environmental Challenges.{" "}
            <a
              href="https://libros.udea.edu.co/index.php/editorial_fcsh/catalog/book/445"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://libros.udea.edu.co/index.php/editorial_fcsh/catalog/book/445
            </a>
          </li>
          <br />
          <li>
            <b>Transformative Metrics Workshop:</b>{" "}
            <a
              href="https://www.youtube.com/watch?v=bbMw0evYD94"
              target="_blank"
              rel="noreferrer"
            >
              https://www.youtube.com/watch?v=bbMw0evYD94
            </a>
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>
          Latmétricas -{" "}
          <a
            href="https://latmetricas.wordpress.com"
            target="_blank"
            rel="noreferrer"
          >
            https://latmetricas.wordpress.com
          </a>
        </h3>
        <ul>
          <li>
            <b>Organización de Latmétricas 2021:</b>{" "}
            <a
              href="https://latmetricas.wordpress.com/sesiones-grabadas/"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://latmetricas.wordpress.com/sesiones-grabadas/
            </a>
          </li>
          <li>
            <b>
              Manifiesto por las métricas socioterritoriales de la ciencia, la
              tecnología y la innovación:
            </b>{" "}
            <a
              href="https://zenodo.org/records/12811009"
              target="_blank"
              rel="noreferrer"
            >
              https://zenodo.org/records/12811009
            </a>
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>RedCyted PCYT-LAB</h3>

        <ul>
          <li>
            <b>Laboratorio de políticas cti:</b> modelos transferibles a escala
            local (621RT0119).{" "}
            <a
              href="https://www.cyted.org/conteudo.php?idm=248&id_rede=143"
              target="_blank"
              rel="noreferrer"
            >
              https://www.cyted.org/conteudo.php?idm=248&id_rede=143
            </a>
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>
          Secretaría Distrital de Salud de Bogotá -{" "}
          <a
            href="https://www.saludcapital.gov.co/"
            target="_blank"
            rel="noreferrer"
          >
            https://www.saludcapital.gov.co/
          </a>
        </h3>
        <ul>
          <li>
            <b>
              Plataforma de información de investigación en salud de Bogotá:
            </b>{" "}
            <a
              href="https://investigacion-salud.saludcapital.gov.co/app"
              target="_blank"
              rel="noreferrer"
            >
              https://investigacion-salud.saludcapital.gov.co/app
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    key: "4",
    label: "Principios",
    children: (
      <>
        <h3 className={styles.margin0}>Principios operativos</h3>
        <ul>
          <li>
            <b>Código abierto:</b> <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> es una plataforma de código abierto, lo que
            permite a cualquier persona replicar, adaptar y mejorar el sistema
            según sus necesidades.
          </li>
          <br />
          <li>
            <b>Datos abiertos:</b> Respetando las leyes de privacidad,{" "}
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> promueve la visibilidad de las instituciones
            participantes, fomenta la transparencia ante la sociedad y facilita
            la rendición de cuentas.
          </li>
          <br />
          <li>
            <b>Datos disponibles:</b> Cumpliendo con los marcos legales de
            protección de datos, <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> pone a disposición información actualizada y
            accesible para los diferentes actores del ecosistema de
            investigación.
          </li>
          <br />
          <li>
            <b>Sin reclamo de patentes:</b> <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> es considerado un bien común por la red de
            instituciones que lo conforman, sin intención de apropiación
            exclusiva ni restricciones comerciales.
          </li>
          <br />
          <li>
            <b>Financiación e infraestructuras compartidas:</b> La evolución de{" "}
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> se basa en decisiones colectivas, guiadas por
            las necesidades de sus socios y usuarios, y orientadas al beneficio
            de las organizaciones colombianas.
          </li>
          <br />
          <li>
            <b>Soberanía sobre la información:</b>{" "}
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> fortalece la autonomía institucional al
            permitir que cada organización mantenga el control sobre sus
            sistemas de información.
          </li>
          <br />
          <li>
            <b>Aprendizaje colaborativo:</b> Las instituciones participantes
            comparten conocimientos y buenas prácticas sobre manejo de datos,
            evaluación responsable y gestión del conocimiento, en un entorno de
            mejora continua.
          </li>
          <br />
          <li>
            <b>Documentación y estandarización:</b>{" "}
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> cuenta con procesos documentados y
            estandarizados que facilitan su replicación y adaptación en otros
            contextos institucionales y países.
          </li>
        </ul>
        <Divider />
        <h3 className={styles.margin0}>Definiciones básicas</h3>
        <p>
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> concibe a la Universidad como una organización
          vinculada internamente entre sus misiones universitarias y
          externamente con diferentes públicos como comunidades académicas,
          organizaciones sociales, sector público y privado y públicos y
          ciudadanos en general. Las métricas e indicadores relevan
          especialmente este papel de vinculación para generar herramientas que
          permitan visualizar alcances e impacto social en la producción de
          conocimiento desde las perspectivas misionales.
        </p>
        <p>
          Información adicional sobre su conceptualización puede ser consultada
          en:
        </p>
        <ul>
          <li>
            <b>
              Hacia una plataforma de métricas y evaluación para América Latina
              en conocimiento especializado:
            </b>{" "}
            ciencias, tecnologías, innovación, artes y humanidades.{" "}
            <a
              href="https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16817/1/Hacia-una-plataforma.pdf"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16817/1/Hacia-una-plataforma.pdf
            </a>
          </li>
          <br />
          <li>
            <b>Métricas de vinculación universidad-entorno:</b> Universidad de
            Antioquia. Apuntes sobre los instrumentos del Manual de Indicadores
            de Vinculación.{" "}
            <a
              href="https://bibliotecadigital.udea.edu.co/handle/10495/12357"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://bibliotecadigital.udea.edu.co/handle/10495/12357
            </a>
          </li>
          <br />
          <li>
            <b>
              Hacia un modelo de medición de la ciencia desde el Sur Global:
            </b>{" "}
            métricas responsables.{" "}
            <a
              href="https://www.palabraclave.fahce.unlp.edu.ar/article/view/PCe068"
              target="_blank"
              rel="noreferrer"
              className={styles.wrapText}
            >
              https://www.palabraclave.fahce.unlp.edu.ar/article/view/PCe068
            </a>
          </li>
        </ul>
        <Row justify={"center"}>
          <Col xs={24} md={12}>
            <Image
              src={"/media/graf01.png"}
              width={500}
              height={300}
              style={{ width: "100%", height: "auto" }}
              alt="Gráfico organizacional"
            />
          </Col>
        </Row>
      </>
    ),
  },
];

/**
 * About is a "server-side" function component that displays the "About" page.
 *
 * @returns {JSX.Element} A static page with components from Ant Design library that contains
 * information about ImpactU and a list of logos.
 */
export default function About() {
  return (
    <Row justify="center">
      <Col xs={24} md={16}>
        <h1 style={{ textAlign: "center" }}>Acerca de ImpactU</h1>
        <Divider />
      </Col>
      <Col xs={24} md={16}>
        <Tabs defaultActiveKey="1" items={items} centered />
      </Col>
    </Row>
  );
}
