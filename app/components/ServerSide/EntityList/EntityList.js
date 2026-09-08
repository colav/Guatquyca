/* Components */
import AffilliationParser from "../AffiliationParser/AffiliationParser";
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import CitationsCount from "../CitationsCount/CitationsCount";
import ClientLogger from "@/lib/utils/clientLogger";
import ExternalProfiles from "@/app/components/ServerSide/ExternalProfiles/ExternalProfiles";
import Flag from "../Flag/Flag";
import GroupRankTag from "../GroupRankTag/GroupRankTag";
import IndexList from "../IndexList/IndexList";
import PaginationController from "@/app/components/ClientSide/PaginationController/PaginationController";
import ProductsCount from "../ProductsCount/ProductsCount";
import RORTypesTagList from "../RORTypesTagList/RORTypesTagList";

/* lib */
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/* Next */
import Link from "next/link";

/* Icons */
import { EnvironmentOutlined, ReadOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Avatar } from "antd";

/**
 * EntityList is a "server-side" function component that displays a list of entities.
 *
 * @param {Object} data - The data for the entities to display.
 * @param {Object} searchParams - The search parameters used to fetch the entities.
 * @returns {JSX.Element} A List component containing the entities. The List has a pagination control at the bottom.
 */
export default async function EntityList({ searchParams, entity }) {
  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    entity,
    `/search/affiliations/${entity}`,
  );
  const URL = URLBuilder(`/app/search/affiliations/${entity}`, correctedParams);
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
      type={entity}
      csv={false}
      apiExpert={false}
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
                  {item.name?.charAt(0) || <ReadOutlined />}
                </Avatar>
              </div>

              <div className={styles.mainContent}>
                <div className={styles.titleRow}>
                  <Link
                    className={styles.title}
                    href={`/affiliation/${entity}/${item.id}/affiliations`}
                  >
                    {item.name}
                  </Link>
                  {entity === "institution" &&
                    item.addresses?.length &&
                    item.addresses[0]?.country_code && (
                      <span className={styles.flagSpace}>
                        <Flag
                          country={item.addresses[0]?.country}
                          countryCode={item.addresses[0]?.country_code}
                        />
                      </span>
                    )}
                  {entity === "group" && (
                    <GroupRankTag ranking={item.ranking} />
                  )}
                </div>

                <AffilliationParser affiliations={item.affiliations} />

                <div className={styles.tagsRow}>
                  <RORTypesTagList types={item.types} />
                </div>

                {item.addresses?.[0]?.city && (
                  <div className={styles.infoRow}>
                    <EnvironmentOutlined /> {item.addresses[0]?.city},{" "}
                    {item.addresses[0]?.country}.
                  </div>
                )}

                <div className={styles.metricsGrid}>
                  {(entity === "institution" || entity === "group") &&
                    renderMetricCard(
                      `external-profiles-${item.id}`,
                      <ExternalProfiles
                        idsList={(item.external_ids || []).concat(
                          item.external_urls || [],
                        )}
                        entity={entity}
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
