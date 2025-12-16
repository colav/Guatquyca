/* Components */
import AffiliationLinks from "../AffiliationLinks/AffiliationLinks";
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import CitationsCount from "../CitationsCount/CitationsCount";
import ClientLogger from "@/lib/Utils/clientLogger";
import ExternalProfiles from "@/app/components/ServerSide/ExternalProfiles/ExternalProfiles";
import Flag from "../Flag/Flag";
import PaginationController from "@/app/components/ClientSide/PaginationController/PaginationController";
import ProductsCount from "../ProductsCount/ProductsCount";

/* lib */
import getData from "@/lib/APIS/api";
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Avatar, Col, Row } from "antd";

/**
 * EntityList is a "server-side" function component that displays a list of entities.
 *
 * @param {Object} data - The data for the entities to display.
 * @param {Object} searchParams - The search parameters used to fetch the entities.
 * @returns {JSX.Element} A List component containing the entities. The List has a pagination control at the bottom.
 */
export default async function EntityList({ searchParams, entity }) {
  const URL = URLBuilder(`/app/search/affiliations/${entity}`, searchParams);
  const { data, fullUrl } = await getData(URL);

  return (
    <CardWrapper
      searchParams={searchParams}
      total_results={data.total_results}
      type={entity}
      csv={false}
      apiExpert={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <li key={item.id}>
            <Row>
              <Col style={{ width: "80px" }}>
                <Avatar
                  src={item.logo?.length === 0 ? null : item.logo}
                  shape="square"
                  id={styles.avatar}
                  size={64}
                >
                  {item.name?.charAt(0)}
                </Avatar>
              </Col>
              <Col span={22}>
                <Row>
                  <Col span={24} style={{ marginBottom: "7px" }}>
                    <>
                      <Link
                        className="searchResult_link"
                        href={`/affiliation/${entity}/${item.id}/affiliations`}
                      >
                        {item.name}
                      </Link>{" "}
                      {entity === "institution" &&
                        item.addresses?.length &&
                        item.addresses[0]?.country_code && (
                          <Flag
                            country={item.addresses[0]?.country}
                            countryCode={item.addresses[0]?.country_code}
                          />
                        )}
                    </>
                  </Col>
                  {entity != "institution" && (
                    <Col xs={24} md={6}>
                      <AffiliationLinks affList={item.affiliations} />
                    </Col>
                  )}
                  {entity === "institution" || entity === "group" ? (
                    <Col xs={24} md={6}>
                      <ExternalProfiles
                        idsList={item.external_ids.concat(item.external_urls)}
                        entity="group"
                      />
                    </Col>
                  ) : (
                    ""
                  )}
                  <CitationsCount citations_count={item.citations_count} />
                  <ProductsCount products_count={item.products_count} />
                </Row>
              </Col>
            </Row>
            <hr className={styles.hr} />
          </li>
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={searchParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
