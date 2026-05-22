/* Components */
import AffilliationParser from "../AffiliationParser/AffiliationParser";
import AuthorsExternalProfiles from "../ExternalProfiles/AuthorsExternalProfiles";
import CitationsCount from "../CitationsCount/CitationsCount";
import ExternalProfiles from "../ExternalProfiles/ExternalProfiles";
import Flag from "../Flag/Flag";
import IndexList from "../IndexList/IndexList";
import MemberOf from "../MemberOf.js/MemberOf";
import ProductsCount from "../ProductsCount/ProductsCount";
import RORTypesTagList from "../RORTypesTagList/RORTypesTagList";

/* Data */
import networks_universities_colombia from "@/lib/utils/networks_universities_colombia.json";

/* Icons */
import { EnvironmentOutlined, ReadOutlined } from "@ant-design/icons";

/* styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Avatar } from "antd";

/* Utils */
import { formatName } from "@/lib/utils/formatName";

/**
 * CommonTitleCard is a "server-side" function component that displays a title card with an avatar, a title,
 * and external URLs and profiles, it is used for the following entities: persons, institutions, faculties, groups and departments.
 *
 * @param {Object} data - The properties passed to this component, including `data`.
 * @param {string} entity - The entity type.
 * @returns {JSX.Element} A Card that contains a title with the name of an entity, a logo, the external URLs and profiles.
 * a title, and external URLs and profiles.
 */
export default function CommonTitleCard({ data, entity }) {
  const {
    logo,
    addresses,
    external_urls,
    external_ids,
    affiliations,
    citations_count,
    products_count,
    name,
    full_name,
    _id,
    h_index,
    h5_index,
    types,
    year_established,
  } = data;

  const country = addresses?.[0]?.country;
  const countryCode = addresses?.[0]?.country_code;
  const externalProfilesList = (external_ids || []).concat(external_urls || []);
  const hasProductsCount = products_count != null;
  const hasCitationsCount = citations_count?.length > 0;
  const hasIndexValues = h_index != null || h5_index != null;
  const hasMemberOf =
    entity === "institution" &&
    Boolean(networks_universities_colombia.members_of?.[_id]?.networks?.length);

  const renderMetricCard = (key, content) => (
    <div key={key} className={styles.metricCell}>
      <div className={styles.metricCard}>{content}</div>
    </div>
  );

  return (
    <div className={styles.pattern}>
      <div className={styles.header}>
        <div className={styles.avatarBlock}>
          <Avatar
            shape="square"
            size={150}
            src={
              logo || (
                <ReadOutlined style={{ color: "gray", fontSize: "40px" }} />
              )
            }
            className={styles.avatar}
          />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              {formatName(full_name) || name}
              {entity === "institution" && countryCode && (
                <span className={styles.flagSpace}>
                  <Flag country={country} countryCode={countryCode} />
                </span>
              )}
            </h1>
          </div>

          <div className={styles.tagsRow}>
            <RORTypesTagList types={types} />
          </div>

          {addresses?.[0]?.city && (
            <div className={styles.infoRow}>
              <EnvironmentOutlined /> {addresses?.[0]?.city}, {country}.
              {year_established && ` Fundada en ${year_established}.`}
            </div>
          )}

          <AffilliationParser affiliations={affiliations} />

          <div className={styles.metricsGrid}>
            {entity === "person" &&
              renderMetricCard(
                "authors-external-profiles",
                <AuthorsExternalProfiles profilesList={external_ids} />,
              )}

            {(entity === "institution" || entity === "group") &&
              renderMetricCard(
                "external-profiles",
                <ExternalProfiles
                  idsList={externalProfilesList}
                  entity={entity}
                />,
              )}

            {hasProductsCount &&
              renderMetricCard(
                "products-count",
                <ProductsCount products_count={products_count} />,
              )}

            {hasCitationsCount &&
              renderMetricCard(
                "citations-count",
                <CitationsCount citations_count={citations_count} />,
              )}

            {hasIndexValues &&
              renderMetricCard(
                "index-list",
                <IndexList h_index={h_index} h5_index={h5_index} />,
              )}

            {hasMemberOf &&
              renderMetricCard("member-of", <MemberOf id={_id} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
