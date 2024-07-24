/* Components */
import ExternalProfiles from "../ExternalProfiles/ExternalProfiles";

/* Icons */
import { ReadOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Avatar, Col, Row } from "antd";

/* styles */
import styles from "./styles.module.css";
import ProductsCount from "../ProductsCount/ProductsCount";
import CitationsCount from "../CitationsCount/CitationsCount";
import AffilliationParser from "../AffiliationParser/AffiliationParser";
import Flag from "../Flag/Flag";
import AuthorsExternalProfiles from "../ExternalProfiles/AuthorsExternalProfiles";

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
    name,
    addresses,
    external_urls,
    external_ids,
    affiliations,
    citations_count,
    products_count,
  } = data;

  const country = addresses?.[0]?.country;
  const countryCode = addresses?.[0]?.country_code;

  return (
    <Row id={styles.pattern}>
      <Col id={styles.col}>
        <Avatar
          size={150}
          src={
            logo || <ReadOutlined style={{ color: "gray", fontSize: "40px" }} />
          }
          id={styles.avatar}
        />
      </Col>
      <Col xs={24} md={14} lg={18}>
        <Row>
          <h1 id={styles.title}>
            {name}{" "}
            {entity === "institution" && (
              <Flag country={country} countryCode={countryCode} />
            )}
          </h1>
        </Row>
        <AffilliationParser affiliations={affiliations} />
        <Row gutter={[20, 20]} style={{ marginTop: "20px" }}>
          {entity === "person" && (
            <Col xs={24} md={10} lg={8} xl={6}>
              <AuthorsExternalProfiles profilesList={external_ids} />
            </Col>
          )}{" "}
          {(entity === "institution" || entity === "group") && (
            <Col xs={24} md={10} lg={8} xl={6}>
              <ExternalProfiles
                idsList={(external_ids || []).concat(external_urls || [])}
                entity={entity}
              />
            </Col>
          )}
          <CitationsCount citations_count={citations_count} />
          <ProductsCount products_count={products_count} />
        </Row>
      </Col>
    </Row>
  );
}
