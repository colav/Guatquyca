/* Components */
import AffiliationLinks from "@/app/components/ServerSide/AffiliationLinks/AffiliationLinks";
import CitationsCount from "../CitationsCount/CitationsCount";
import ExternalProfiles from "@/app/components/ServerSide/ExternalProfiles/ExternalProfiles";
import PaginationController from "@/app/components/ClientSide/PaginationController/PaginationController";
import ProductsCount from "../ProductsCount/ProductsCount";
import SortSearchResults from "@/app/components/ClientSide/SortSearchResults/SortSearchResults";

/* lib */
import getData from "@/lib/api";
import URLBuilder from "@/lib/URLBuilder";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Avatar, Col, Row, Card } from "antd";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/**
 * PersonList is an asynchronous function server component that fetches a list of persons
 * based on provided search parameters and displays them in a Card component.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of persons.
 * @returns {JSX.Element} A Card component that displays the list of persons.
 */
export default async function PersonList({ searchParams }) {
  const URL = URLBuilder("/app/search/person", searchParams);
  const data = await getData(URL);

  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 10px 10px" },
      }}
      title={`${data.total_results} ${
        data.total_results === 1 ? SINGULAR_TITLES["person"] : TITLES["person"]
      }`}
      extra={<SortSearchResults searchParams={searchParams} />}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <li key={item.id}>
            <Row>
              <Col style={{ width: "80px" }}>
                <Avatar shape="square" className="avatar" size={64}>
                  {item.full_name?.charAt(0)}
                </Avatar>
              </Col>
              <Col span={22}>
                <Row>
                  <Col span={24} style={{ marginBottom: "7px" }}>
                    <Link
                      className="searchResult_link"
                      href={`/person/${item.id}/research/products`}
                    >
                      {item.full_name}
                    </Link>
                  </Col>
                  <Col xs={24} md={6}>
                    <AffiliationLinks
                      affList={item.affiliations}
                      person={true}
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <ExternalProfiles idsList={item.external_ids} />
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
    </Card>
  );
}
