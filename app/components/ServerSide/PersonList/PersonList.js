/* Components */
import AffilliationParser from "@/app/components/ServerSide/AffiliationParser/AffiliationParser";
import AuthorsExternalProfiles from "@/app/components/ServerSide/ExternalProfiles/AuthorsExternalProfiles";
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import CitationsCount from "../CitationsCount/CitationsCount";
import ClientLogger from "@/lib/utils/clientLogger";
import PaginationController from "@/app/components/ClientSide/PaginationController/PaginationController";
import IndexList from "@/app/components/ServerSide/IndexList/IndexList";
import ProductsCount from "../ProductsCount/ProductsCount";

/* lib */
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Avatar } from "antd";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import { formatName } from "@/lib/utils/formatName";

/**
 * PersonList is an asynchronous function server component that fetches a list of persons
 * based on provided search parameters and displays them in a Card component.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of persons.
 * @returns {JSX.Element} A Card component that displays the list of persons.
 */
export default async function PersonList({ searchParams }) {
  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    "person",
    "/search/person",
  );
  const URL = URLBuilder("/app/search/person", correctedParams);
  const { data, fullUrl } = await getData(URL);

  const renderMetricCard = (key, content) => (
    <div key={key} className={styles.metricCell}>
      <div className={styles.metricCard}>{content}</div>
    </div>
  );

  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.total_results}
      type="person"
      csv={false}
      api={true}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.header}>
              <div className={styles.avatarBlock}>
                <Avatar
                  src={item.logo?.length === 0 ? null : item.logo}
                  shape="square"
                  size={64}
                  className={styles.avatar}
                >
                  {item.full_name?.charAt(0)}
                </Avatar>
              </div>

              <div className={styles.mainContent}>
                <div className={styles.titleRow}>
                  <Link
                    className={styles.title}
                    href={`/person/${item.id}/research/products?max=10&page=1&sort=citations_desc`}
                  >
                    {formatName(item.full_name)}
                  </Link>
                </div>

                <AffilliationParser affiliations={item.affiliations} />

                <div className={styles.metricsGrid}>
                  {renderMetricCard(
                    `external-profiles-${item.id}`,
                    <AuthorsExternalProfiles
                      profilesList={item.external_ids}
                    />,
                  )}

                  {item.products_count != null &&
                    renderMetricCard(
                      `products-count-${item.id}`,
                      <ProductsCount products_count={item.products_count} />,
                    )}

                  {item.citations_count?.length > 0 &&
                    renderMetricCard(
                      `citations-count-${item.id}`,
                      <CitationsCount citations_count={item.citations_count} />,
                    )}

                  {(item.h_index != null || item.h5_index != null) &&
                    renderMetricCard(
                      `index-list-${item.id}`,
                      <IndexList
                        h_index={item.h_index}
                        h5_index={item.h5_index}
                      />,
                    )}
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
          </li>
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={correctedParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
