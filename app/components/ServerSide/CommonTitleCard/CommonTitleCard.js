/* Components */
import AffilliationParser from "../AffiliationParser/AffiliationParser";
import AuthorsExternalProfiles from "../ExternalProfiles/AuthorsExternalProfiles";
import CitationsCount from "../CitationsCount/CitationsCount";
import ExternalProfiles from "../ExternalProfiles/ExternalProfiles";
import Flag from "../Flag/Flag";
import MemberOf from "../MemberOf.js/MemberOf";
import ProductsCount from "../ProductsCount/ProductsCount";

/* Icons */
import { ReadOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Avatar, Col, Row } from "antd";

/* styles */
import styles from "./styles.module.css";

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
  } = data;

  const country = addresses?.[0]?.country;
  const countryCode = addresses?.[0]?.country_code;

  return (
    <Row id={styles.pattern}>
      <Col id={styles.col}>
        <Avatar
          shape="square"
          size={150}
          src={
            logo || <ReadOutlined style={{ color: "gray", fontSize: "40px" }} />
          }
          id={styles.avatar}
        />
      </Col>
      <Col xs={24} sm={16} md={24} lg={19} xl={18}>
        <Row>
          <h1 id={styles.title}>
            {full_name || name}{" "}
            {entity === "institution" && (
              <Flag country={country} countryCode={countryCode} />
            )}
          </h1>
        </Row>
        <AffilliationParser affiliations={affiliations} />
        <Row gutter={[20, 20]} style={{ marginTop: "20px" }}>
          {entity === "person" && (
            <Col xs={24} md={11} lg={9} xl={8} xxl={6}>
              <AuthorsExternalProfiles profilesList={external_ids} />
            </Col>
          )}{" "}
          {(entity === "institution" || entity === "group") && (
            <Col xs={24} md={11} lg={9} xl={8} xxl={6}>
              <ExternalProfiles
                idsList={(external_ids || []).concat(external_urls || [])}
                entity={entity}
              />
            </Col>
          )}
          <CitationsCount citations_count={citations_count} />
          <ProductsCount products_count={products_count} />
          {entity === "institution" && <MemberOf id={_id} />}
        </Row>
      </Col>
    </Row>
  );
}
