/* Components */
import CitationsCount from "../CitationsCount/CitationsCount";
import GeoCountCard from "../GeoCountCard/GeoCountCard";
import GlassCard from "../GlassCard/GlassCard";
import ProductsCount from "../ProductsCount/ProductsCount";

/* Icons */
import {
  BankOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * GeoProfileCard is a "server-side" function component that displays the title card
 * of the profile of a city or a state.
 *
 * @param {Object} data - The city or state returned by `/geo/<city|state>/<id>`.
 * @returns {JSX.Element} A card with the name, location and metrics of the geographic entity.
 */
export default function GeoProfileCard({ data }) {
  const dane = data.external_ids?.find((e) => e.source === "dane");
  const hasCoords = data.latitude != null && data.longitude != null;

  return (
    <div className={styles.pattern}>
      <h1 className={styles.title}>{data.name}</h1>

      <div className={styles.infoRow}>
        <EnvironmentOutlined />{" "}
        {[data.state?.name, data.country].filter(Boolean).join(", ")}
        {dane && <span> · Código DANE: {dane.id}</span>}
        {hasCoords && (
          <>
            {" · "}
            <a
              href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=11/${data.latitude}/${data.longitude}`}
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
            <ProductsCount products_count={data.products_count} />
          </GlassCard>
        </div>
        <div className={styles.metricCell}>
          <GlassCard className={styles.metricCard}>
            <CitationsCount citations_count={data.citations_count} />
          </GlassCard>
        </div>
        <GeoCountCard
          icon={<UserOutlined />}
          label="Autores"
          value={data.authors_count}
        />
        <GeoCountCard
          icon={<TeamOutlined />}
          label="Grupos"
          value={data.groups_count}
        />
        <GeoCountCard
          icon={<BankOutlined />}
          label="Instituciones"
          value={data.institutions_count}
        />
        {data.type === "state" && (
          <GeoCountCard
            icon={<EnvironmentOutlined />}
            label="Ciudades"
            value={data.cities_count}
          />
        )}
      </div>
    </div>
  );
}
