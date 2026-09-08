/* Components */
import SCImago from "@/app/components/ClientSide/SCImago/SCImago";

/* Icons */
import { ReadOutlined } from "@ant-design/icons";

/* lib */
import formatSourceISSNs from "@/lib/utils/formatSourceISSNs";

/* UI Library Components */
import { Col, Descriptions, Row } from "antd";

/**
 * WorkSource component displays detailed source and bibliographic information for an academic work.
 *
 * This includes:
 * - Source name and quartile
 * - Volume, issue, and page range
 * - pISSN, ISSN, and OpenAlex profile link
 * - SCImago badge if available
 *
 * All fields gracefully handle missing data by displaying "No disponible".
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.source] - Source information object
 * @param {string} [props.source.name] - Name of the source (e.g., journal name)
 * @param {string} [props.source.scimago_quartile] - SCImago quartile for the publication year
 * @param {Object} [props.source.external_ids] - External identifiers for the source
 * @param {string} [props.source.external_ids.pissn] - Print ISSN
 * @param {string} [props.source.external_ids.issn] - Electronic ISSN
 * @param {string} [props.source.external_ids.scimago] - SCImago badge URL or data
 * @param {string} [props.source.external_ids.openalex] - OpenAlex profile URL
 * @param {Object} [props.bibliographicInfo] - Bibliographic information object
 * @param {string|number} [props.bibliographicInfo.issue] - Issue number
 * @param {string|number} [props.bibliographicInfo.volume] - Volume number
 * @param {string|number} [props.bibliographicInfo.start_page] - Start page
 * @param {string|number} [props.bibliographicInfo.end_page] - End page
 *
 * @returns {JSX.Element} Section with source and bibliographic information
 *
 */
export default function WorkSource({ source, bibliographicInfo }) {
  const { name, scimago_quartile } = source || {};
  const sourceExternalIDs = Array.isArray(source?.external_ids)
    ? source.external_ids
    : [];
  const sourceISSNs = Array.isArray(source?.issn) ? source.issn : [];
  const getSourceID = (sourceName) =>
    sourceExternalIDs.find((item) => item.source === sourceName)?.id;
  const scimago = getSourceID("scimago");
  const openalex = getSourceID("openalex");
  const { issue, volume, start_page, end_page } = bibliographicInfo || {};

  const notAvailable = "No disponible";
  const sourceISSNItems = formatSourceISSNs(sourceISSNs);

  const sourceItems = [
    {
      key: "source",
      label: "Fuente",
      children: name || notAvailable,
    },
    {
      key: "quartile",
      label: "Cuartil año de publicación",
      children: scimago_quartile || notAvailable,
    },
    {
      key: "volume",
      label: "Volumen",
      children: volume || notAvailable,
    },
    {
      key: "issue",
      label: "Issue",
      children: issue || notAvailable,
    },
    {
      key: "pages",
      label: "Páginas",
      children:
        start_page || end_page
          ? `${start_page || "N/A"} - ${end_page || "N/A"}`
          : notAvailable,
    },
    ...(sourceISSNItems.length > 0
      ? sourceISSNItems
      : [{ key: "issn", label: "ISSN", children: notAvailable }]),
    {
      key: "openalex",
      label: "Perfil OpenAlex",
      children: openalex ? (
        <a href={openalex} target="_blank" rel="noreferrer">
          {openalex}
        </a>
      ) : (
        notAvailable
      ),
    },
  ];

  return (
    <>
      <h4>
        <ReadOutlined /> Información de la Fuente:
      </h4>
      <Row>
        {scimago ? (
          <>
            <SCImago scimago={scimago} />
            <Col xs={24} md={20}>
              <Descriptions items={sourceItems} />
            </Col>
          </>
        ) : (
          <Descriptions items={sourceItems} />
        )}
      </Row>
    </>
  );
}
