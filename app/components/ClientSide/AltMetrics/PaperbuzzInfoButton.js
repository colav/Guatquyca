/* Components */
import InfoButton from "../Charts/InfoButton/InfoButton";

/* UI Library Components */
import { Table } from "antd";

export default function PaperbuzzInfoButton() {
  const columns = [
    {
      title: "Fuente",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Peso",
      dataIndex: "weight",
      key: "weight",
    },
  ];

  const data = [
    {
      key: "1",
      source: "Newsfeed",
      weight: 4,
    },
    {
      key: "2",
      source: "WordPress.com",
      weight: 4,
    },
    {
      key: "3",
      source: "Wikipedia",
      weight: 2,
    },
    {
      key: "4",
      source: "Reddit",
      weight: 2,
    },
    {
      key: "5",
      source: "X (Twitter)",
      weight: 1,
    },
    {
      key: "6",
      source: "DataCite",
      weight: 1,
    },
    {
      key: "7",
      source: "Página web",
      weight: 1,
    },
    {
      key: "8",
      source: "The Lens",
      weight: 1,
    },
    {
      key: "9",
      source: "F1000",
      weight: 1,
    },
  ];

  return (
    <InfoButton
      label="Paperbuzz"
      text={
        <div>
          Paperbuzz es una herramienta desarrollada por Impactstory que mide la
          atención en línea que reciben los artículos de investigación. Utiliza
          métricas alternativas, conocidas como altmétricas, para rastrear
          menciones en redes sociales, medios de comunicación, blogs y otros
          tipos de plataformas digitales.
          <h4>El Puntaje de Atención</h4>
          <p>
            El puntaje se calcula mediante un algoritmo automatizado y refleja
            una cuenta ponderada de la cantidad de atención que Paperbuzz ha
            registrado para una producción científica.{" "}
            <b>¿Por qué se pondera?</b> Para representar el alcance relativo de
            cada tipo de fuente. Por ejemplo, es más probable que un artículo en
            un periódico atraiga más atención a la investigación que una
            publicación típica en redes sociales. Esto se tiene en cuenta en las
            ponderaciones predeterminadas:
          </p>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            size="small"
          />
          <p>
            <b>
              *No se consideran los eventos de CrossRef ya que representan citas
              académicas tradicionales.
            </b>{" "}
            Debido a que estos son indicadores de impacto académico a largo
            plazo, mientras que las altmétricas capturan la atención y difusión
            inmediatas y diversas fuera del ámbito académico convencional. Por
            lo tanto, incluir eventos de CrossRef podría distorsionar el
            propósito de reflejar la interacción y el alcance en línea de manera
            más amplia y contemporánea.
          </p>
        </div>
      }
    />
  );
}
