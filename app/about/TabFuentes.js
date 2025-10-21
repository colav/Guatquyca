/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/*  UI Library Components */
import { Col, Divider, Row, Table } from "antd";

/* UI Library Sub-components */
const Column = Table;

const tableData = [
  {
    key: "1",
    type: "Productos",
    impactu: "2.545.925",
    openalex: "481.700",
    scopus: "219.799",
    minciencias: "954.735",
    scholar: "359.433",
  },
  {
    key: "2",
    type: "Proyectos de Investigación",
    impactu: "128.687",
    openalex: "0",
    scopus: "0",
    minciencias: "128.687",
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

export default function TabFuentes() {
  return (
    <Row justify="start">
      <h3 className={styles.margin0}>Oferta de información</h3>
      <p>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> es la fuente de información más robusta sobre la
        investigación en Colombia. En la siguiente tabla comparativa se
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
            <b>Afiliaciones:</b> se consideran las instituciones, las unidades y
            subunidades académicas, los grupos de investigación, los municipios
            y departamentos, lo que da una ubicación geográfica y organizacional
            muy precisa.
          </li>
          <li>
            <b>Fuentes y publishers:</b> se consideran los nombres de las
            revistas y los nombres de los editores.
          </li>
          <li>
            <b>Personas:</b> Autorías normalizadas.
          </li>
          <li>
            <b>Productos:</b> los descriptores bibliográficos e identificadores
            asociados a la producción.
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
                <a href="https://dspace.org/" target="_blank" rel="noreferrer">
                  https://dspace.org/
                </a>
              </li>
              <li>
                <b>Orcid:</b> Integración de información en doble vía y con
                posibilidad de intervención de los usuarios directamente en la
                información de la plataforma.
              </li>
              <li>
                <b>Publindex:</b> integración de la base de datos de Publindex.
              </li>
            </ul>
          </li>
        </ul>
      </Col>
    </Row>
  );
}
