/* Components */
import InvisibleContainer from "@/app/components/ClientSide/ProductTypeTooltip/InvisibleContainer";
import WorkAbstract from "@/app/components/ServerSide/WorkAbstract/WorkAbstract";
import WorkCitations from "@/app/components/ServerSide/WorkCitations/WorkCitations";
import WorkExternalButtons from "@/app/components/ClientSide/WorkExternalButtons/WorkExternalButtons";
import WorkHeader from "@/app/components/ServerSide/WorkHeader/WorkHeader";
import WorkLinksTable from "@/app/components/ClientSide/WorkLinksTable/WorkLinksTable";
import WorkSource from "@/app/components/ServerSide/WorkSource/WorkSource";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Row } from "antd";
import Ribbon from "antd/lib/badge/Ribbon";

/* Utilities */
import getData from "@/lib/APIS/api";
import MathJax from "@/lib/Utils/mathjax";
import { PRODUCT_TYPES } from "@/lib/constants";
import Script from "next/script";
import UseCleanupAltmetric from "@/lib/Hooks/useCleanupAltmetric";

export const metadata = {
  title: "ImpactU - Detalle del Producto",
  description:
    "Detalle del producto académico en ImpactU, todos los metadatos en un solo lugar.",
};

/**
 * WorkPage component displays detailed information about a specific academic work.
 *
 * This page includes:
 * - Work metadata (title, authors, publication date, language)
 * - Abstract and topic classification
 * - Citation metrics and charts
 * - Source information and bibliographic details
 * - External links and identifiers
 * - Access buttons (PDF, DOI, BibTeX export)
 *
 * The layout is responsive with a two-column design on desktop and single-column on mobile.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.params - Next.js dynamic route parameters
 * @param {string} props.params.ID - The unique identifier of the academic work
 *
 * @returns {Promise<JSX.Element>} The rendered work detail page
 *
 */
export default async function WorkPage({ params }) {
  const URL = `/app/work/${params.ID}`;
  const { data } = await getData(URL);
  const workData = data.data;

  const htmlFields = {
    doi: workData.doi,
    scienti: workData.external_urls?.find((e) => e.source === "scienti")?.url,
    uri: workData.external_urls?.find((e) => e.source === "uri")?.url,
  };

  const hasHtmlInfo = htmlFields.doi || htmlFields.scienti || htmlFields.uri;
  const html = hasHtmlInfo ? htmlFields : undefined;

  const ribbonStyles = {
    boxShadow: [
      "8px -8px 6px rgba(255, 240, 240, 0.3)",
      "2px 2px 8px rgba(255, 116, 69, 0.3)",
      "5px 8px 16px rgba(255, 106, 69, 0.1)",
      "4px 4px 3px rgba(255, 56, 69, 0.15)",
    ].join(","),
    width: "310px",
    textWrap: "wrap",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.8",
    marginTop: "8px",
    display: workData.product_types?.length > 0 ? "block" : "none",
  };

  const ribbonText =
    workData.product_types?.length > 0
      ? workData.product_types.find((type) => type.source === "impactu")
          ?.name ||
        PRODUCT_TYPES[workData.product_types[0]?.name] ||
        workData.product_types[0]?.name
      : "";

  return (
    <div className={styles.main_container}>
      {workData.product_types?.length > 0 && (
        <InvisibleContainer
          source={workData.product_types}
          productType="works"
          type="wide"
        />
      )}
      <Ribbon
        text={ribbonText}
        color="#ff6a45"
        placement="start"
        style={ribbonStyles}
      >
        <div className={styles.paper_container}>
          <MathJax />
          <UseCleanupAltmetric />
          <Script src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js" />
          <Script src="https://badge.dimensions.ai/badge.js" />
          <WorkHeader
            title={workData.title}
            openAccess={workData.open_access}
            externalIds={workData.external_ids}
            ranking={workData.ranking}
            language={workData.language}
            datePublished={workData.date_published}
            authors={workData.authors}
            authorsCount={workData.authors_count}
            workID={params.ID}
          />
          <Divider />
          <Row>
            <Col xs={24} md={11}>
              <WorkAbstract
                abstract={workData.abstract}
                primaryTopic={workData.primary_topic}
              />
            </Col>
            <Col xs={0} md={2}>
              <div className={styles.vertical_divider} />
            </Col>
            <Col xs={24} md={11}>
              <WorkCitations
                citationsCount={workData.citations_count}
                citationsByYear={workData.citations_by_year}
                doi={workData.doi}
              />
            </Col>
          </Row>
          <Divider />
          <WorkSource
            source={workData.source}
            bibliographicInfo={workData.bibliographic_info}
          />
          <Divider />
          <h4>
            <LinkOutlined /> Enlaces e Identificadores:
          </h4>
          <WorkLinksTable
            external_ids={workData.external_ids}
            external_urls={workData.external_urls}
          />
          <div className={styles.external_buttons_container}>
            <WorkExternalButtons
              open_access={workData.open_access}
              documentID={params.ID}
              html={html}
              bibtex={workData.bibliographic_info?.bibtex}
            />
          </div>
        </div>
      </Ribbon>
    </div>
  );
}
