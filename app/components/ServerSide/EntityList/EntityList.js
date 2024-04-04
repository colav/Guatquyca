/* Components */
import CitationsCount from "../CitationsCount/CitationsCount";
import ExternalProfiles from "@/app/components/ServerSide/ExternalProfiles/ExternalProfiles";
import ExternalURL from "@/app/components/ServerSide/ExternalURL/ExternalURL";
import PaginationController from "@/app/components/ClientSide/PaginationController/PaginationController";
import ProductsCount from "../ProductsCount/ProductsCount";
import SortSearchResults from "@/app/components/ClientSide/SortSearchResults/SortSearchResults";

/* lib */
import getData from "@/lib/api";
import URLBuilder from "@/lib/URLBuilder";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Avatar, Card, Col, Row } from "antd";

/* Utilities */
import { TITLES } from "@/lib/constants";
import Flag from "../Flag/Flag";

/**
 * EntityList is a "server-side" function component that displays a list of entities.
 *
 * @param {Object} data - The data for the entities to display.
 * @param {Object} searchParams - The search parameters used to fetch the entities.
 * @returns {JSX.Element} A List component containing the entities. The List has a pagination control at the bottom.
 */
export default async function EntityList({ searchParams, entity }) {
  const URL = URLBuilder(`app/search/affiliations/${entity}`, searchParams);
  const data = await getData(URL);

  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 10px 10px" },
      }}
      title={TITLES[entity]}
      extra={
        <div>
          <p id={styles.white_text}>
            {data.total_results}{" "}
            {data.total_results === 1 ? "resultado" : "resultados"}
          </p>
          <SortSearchResults searchParams={searchParams} />
        </div>
      }
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <li key={item._id}>
            <Row>
              <Col style={{ width: "80px" }}>
                <Avatar
                  src={item.logo.length === 0 ? null : item.logo}
                  shape="square"
                  className="avatar"
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
                        href={`/app/affiliation/${entity}/${item._id}/affiliations`}
                      >
                        {item.name}
                      </Link>{" "}
                      {entity === "institution" && item.addresses?.length && (
                        <Flag
                          country={item.addresses[0]?.country}
                          countryCode={item.addresses[0]?.country_code}
                        />
                      )}
                    </>
                  </Col>
                  <Col xs={24} md={6}>
                    <ExternalURL URLList={item.external_urls} />
                  </Col>
                  <Col xs={24} md={6}>
                    <ExternalProfiles
                      idsList={item.external_ids}
                      entity="group"
                    />
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