import { notFound } from "next/navigation";

/* Components */
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import CitationsCount from "../CitationsCount/CitationsCount";
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import GeoCountCard from "../GeoCountCard/GeoCountCard";
import GlassCard from "../GlassCard/GlassCard";
import Link from "next/link";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import ProductsCount from "../ProductsCount/ProductsCount";

/* lib */
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/* Icons */
import {
  BankOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

/* Utilities */
import ClientLogger from "@/lib/utils/clientLogger";

/* Styles */
import styles from "./styles.module.css";

const GEO_TYPES = ["city", "state"];

/**
 * GeoEntityList is a "server-side" function component that lists cities or states
 * from `/search/geo/<city|state>`.
 *
 * @param {Object} searchParams - The search parameters used to fetch the entities.
 * @param {string} entity - "city" or "state".
 * @returns {JSX.Element} A card with the list of geographic entities and its pagination.
 */
export default async function GeoEntityList({ searchParams, entity }) {
  if (!GEO_TYPES.includes(entity)) notFound();
  const searchPath = `/search/geo/${entity}`;
  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    entity,
    searchPath,
  );
  const URL = URLBuilder(`/search/geo/${entity}`, correctedParams);
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return (
      <EmptyCard
        text={`No hay ${entity === "city" ? "ciudades" : "departamentos geográficos"} disponibles.`}
      />
    );
  }

  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.meta.count}
      type={entity}
      csv={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => {
          const dane = item.external_ids?.find((e) => e.source === "dane");
          const hasCoords = item.latitude != null && item.longitude != null;
          return (
            <li key={`${item.type}-${item.id}`} className={styles.item}>
              <div className={styles.header}>
                <div className={styles.titleRow}>
                  <Link className={styles.title} href={`/geo/${item.type}/${item.id}/affiliations`}>
                    {item.name}
                  </Link>
                </div>

                <div className={styles.infoRow}>
                  <EnvironmentOutlined />{" "}
                  {[item.state?.name, item.country].filter(Boolean).join(", ")}
                  {dane && <span> · Código DANE: {dane.id}</span>}
                  {hasCoords && (
                    <>
                      {" · "}
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${item.latitude}&mlon=${item.longitude}#map=11/${item.latitude}/${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en el mapa
                      </a>
                    </>
                  )}
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCell}>
                    <GlassCard className={styles.metricCard}>
                      <ProductsCount products_count={item.products_count} />
                    </GlassCard>
                  </div>
                  <div className={styles.metricCell}>
                    <GlassCard className={styles.metricCard}>
                      <CitationsCount citations_count={item.citations_count} />
                    </GlassCard>
                  </div>
                  <GeoCountCard
                    icon={<UserOutlined />}
                    label="Autores"
                    value={item.authors_count}
                  />
                  <GeoCountCard
                    icon={<TeamOutlined />}
                    label="Grupos"
                    value={item.groups_count}
                  />
                  <GeoCountCard
                    icon={<BankOutlined />}
                    label="Instituciones"
                    value={item.institutions_count}
                  />
                  {item.type === "state" && (
                    <GeoCountCard
                      icon={<EnvironmentOutlined />}
                      label="Ciudades"
                      value={item.cities_count}
                    />
                  )}
                </div>
              </div>
              <hr className={styles.hr} />
            </li>
          );
        })}
      </ul>
      <PaginationController
        totalItems={data.meta.count}
        searchParams={correctedParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
