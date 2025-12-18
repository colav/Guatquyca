/* Components */
import CitationsBadges from "../CitationsBadges/CitationsBadges";
import Licenses from "../../ServerSide/Licenses/Licenses";
import OpenAccessSection from "../../ServerSide/OpenAccessSection/OpenAccessSection";
import ProductsCount from "../../ServerSide/ProductsCount/ProductsCount";
import PublicationTime from "../../ServerSide/PublicationTime/PublicationTime";
import Publisher from "../../ServerSide/Publisher/Publisher";
import ReviewProcessList from "../../ServerSide/ReviewProcessList/ReviewProcessList";
import SCImago from "../SCImago/SCImago";
import SourcesExternalIDSTags from "../../ServerSide/SourcesExternalIDSTags/SourcesExternalIDSTags";
import SourcesExternalUrls from "../SourcesExternalUrls/SourcesExternalUrls";
import TopicsTagList from "../../ServerSide/TopicsTagList/TopicsTagList";

/* Constants */
import { SOURCE_TYPES } from "@/lib/constants";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";
import { TagsOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import Ribbon from "antd/lib/badge/Ribbon";
import { Col, Divider, Row } from "antd";

/* Utils */
import Link from "next/link";

/**
 * Renders a detailed view of a source (journal, repository, etc.) with metadata, badges, and external links.
 *
 * @component
 * @param {Object} item - The source object containing all metadata and display information.
 * @param {string} item.id - Unique identifier for the source.
 * @param {Array<{name: string}>} item.names - Array of names for the source (first is primary).
 * @param {string} [item.type] - Type of the source (e.g., journal, repository).
 * @param {Array<Object>} [item.external_ids] - List of external IDs (e.g., Scimago, ISSN).
 * @param {Array<Object>} [item.licenses] - List of licenses associated with the source.
 * @param {Object} [item.publisher] - Publisher information.
 * @param {number} [item.products_count] - Number of products (e.g., articles) in the source.
 * @param {number} [item.citations_count] - Number of citations for the source.
 * @param {Array<Object>} [item.review_process] - Review process details.
 * @param {number} [item.publication_time_weeks] - Average publication time in weeks.
 * @param {Array<Object>} [item.topics] - List of topics covered by the source.
 * @param {string} [item.apc] - Article processing charge information.
 * @param {string} [item.open_access_status] - Open access status.
 * @param {string} [item.waiver] - Waiver information for APC.
 * @param {Array<Object>} [item.external_urls] - List of external URLs for the source.
 *
 * @returns {JSX.Element} The rendered source item component.
 */
export default function SourceItem({ item }) {
  const ribbonStyles = {
    boxShadow:
      "8px -8px 6px rgba(255, 240, 240, 0.3)," +
      "2px 2px 8px rgba(255, 116, 69, 0.3)," +
      "5px 8px 16px rgba(255, 106, 69, 0.1)," +
      "4px 4px 3px rgba(255, 56, 69, 0.15)",
    width: "110px",
    textWrap: "wrap",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.1",
    display: item.type ? "block" : "none",
  };

  return (
    <>
      <Ribbon
        text={item.type ? SOURCE_TYPES[item.type] : "Otro"}
        color="#ff6a45"
        placement="start"
        style={ribbonStyles}
        className={styles.ribbon}
      >
        <li key={item.id} className={styles.source_item}>
          <div className={styles.source_container}>
            <Row align="middle">
              {/* <Link href={`/source/${item.id}`} className={styles.source_title}> */}
              <span
                style={{ fontSize: "20px", fontWeight: "600", marginRight: 8 }}
              >
                {item.names[0].name}{" "}
              </span>
              {/* </Link> */}
              <OpenAccessSection
                apc={item.apc}
                open_access_status={item.open_access_status}
                waiver={item.waiver}
              />
            </Row>
            <Divider style={{ margin: "9px 0" }} />
            <Row>
              <Col xs={24} md={15} lg={19} xxl={20}>
                {item.external_ids?.length > 0 && (
                  <SourcesExternalIDSTags externalIDs={item.external_ids} />
                )}
                {item.licenses?.length > 0 && (
                  <Licenses licenses={item.licenses} />
                )}
                {item.publisher && <Publisher publisher={item.publisher} />}
                <ProductsCount
                  products_count={item.products_count}
                  size="small"
                />
                <CitationsBadges
                  citationsCount={item.citations_count}
                  showTitle={true}
                />
                {item.review_process && (
                  <ReviewProcessList review_process={item.review_process} />
                )}
                {item.publication_time_weeks && (
                  <PublicationTime
                    publication_time_weeks={item.publication_time_weeks}
                  />
                )}
                {item.topics.length > 0 && (
                  <div>
                    <TagsOutlined /> Temas:
                    <TopicsTagList topics={item.topics} />
                  </div>
                )}
                <div>
                  <LinkOutlined /> Enlaces Externos:
                  <SourcesExternalUrls
                    external_ids={item.external_ids}
                    external_urls={item.external_urls}
                  />
                </div>
              </Col>
              {item.external_ids?.some((id) => id.source === "scimago") && (
                <Col xs={24} md={9} lg={5} xxl={4}>
                  <div className={styles.scimago_container}>
                    <SCImago
                      scimago={
                        item.external_ids?.find((id) => id.source === "scimago")
                          ?.id
                      }
                    />
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </li>
      </Ribbon>
    </>
  );
}
