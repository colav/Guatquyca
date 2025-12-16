/* Components */
import AffiliationLinks from "@/app/components/ServerSide/AffiliationLinks/AffiliationLinks";
import AuthorsExternalProfiles from "@/app/components/ServerSide/ExternalProfiles/AuthorsExternalProfiles";
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import CitationsCount from "../CitationsCount/CitationsCount";
import ClientLogger from "@/lib/Utils/clientLogger";
import PaginationController from "@/app/components/ClientSide/PaginationController/PaginationController";
import ProductsCount from "../ProductsCount/ProductsCount";

/* lib */
import getData from "@/lib/APIS/api";
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Avatar, Col, Row, Card } from "antd";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import { formatName } from "@/lib/Utils/formatName";

/**
 * PersonList is an asynchronous function server component that fetches a list of persons
 * based on provided search parameters and displays them in a Card component.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of persons.
 * @returns {JSX.Element} A Card component that displays the list of persons.
 */
export default async function PersonList({ searchParams }) {
  const URL = URLBuilder("/app/search/person", searchParams);
  const { data, fullUrl } = await getData(URL);

  return (
    <CardWrapper
      searchParams={searchParams}
      total_results={data.total_results}
      type="person"
      csv={false}
      api={true}
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
                  {item.full_name?.charAt(0)}
                </Avatar>
              </Col>
              <Col span={22}>
                <Row>
                  <Col span={24} style={{ marginBottom: "7px" }}>
                    <Link
                      scroll={false}
                      className="searchResult_link"
                      href={`/person/${item.id}/research/products?max=10&page=1&sort=citations_desc`}
                    >
                      {formatName(item.full_name)}
                    </Link>
                  </Col>
                  <Col xs={24} md={6}>
                    <AffiliationLinks
                      affList={item.affiliations}
                      person={true}
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <AuthorsExternalProfiles profilesList={item.external_ids} />
                  </Col>
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
