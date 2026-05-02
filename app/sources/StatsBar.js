/* Icons */
import {
  FileTextOutlined,
  ReadOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { open_access_icon as OpenAccessIcon } from "@/app/components/icons/open_access";

/* Styles */
import styles from "./styles.module.css";

export default function StatsBar({ data }) {
  // Calculate statistics from API data
  const sourceTypes = data?.source_types || [];
  const statusData = data?.status || [];
  const sciamagoQuartiles = data?.scimago_quartiles || [];
  const licenseTypes = data?.license_type || [];

  // Journals count
  const journalCount =
    sourceTypes.find((t) => t.value === "journal")?.count || 0;

  // Open access sources (sum of all "open" substatus)
  const openAccessStatus = statusData.find((s) => s.value === "open");
  const openAccessCount = openAccessStatus?.count || 0;

  // Q1 indexed sources (most prestigious)
  const q1Count = sciamagoQuartiles.find((q) => q.value === "Q1")?.count || 0;

  // Open license sources (Creative Commons licenses)
  const ccLicenseCount = licenseTypes
    .filter(
      (l) =>
        l.value.startsWith("CC ") ||
        l.value === "CC0" ||
        l.value === "Public domain",
    )
    .reduce((sum, l) => sum + (l.count || 0), 0);

  const formatNumber = (num) => num.toLocaleString("es-CO");

  const STATS = [
    {
      value: formatNumber(journalCount),
      label: "Revistas",
      icon: <ReadOutlined />,
    },
    {
      value: formatNumber(openAccessCount),
      label: "Fuentes en Acceso abierto",
      icon: <OpenAccessIcon color="#73a9ed" />,
    },
    {
      value: formatNumber(q1Count),
      label: "Revistas Q1 (Scimago)",
      icon: <UnlockOutlined />,
    },
    {
      value: formatNumber(ccLicenseCount),
      label: "Fuentes con licencias abiertas",
      icon: <FileTextOutlined />,
    },
  ];

  return (
    <div className={styles.stats_bar}>
      {STATS.map((s) => (
        <div key={s.label} className={styles.stat_item}>
          <span className={styles.stat_icon}>{s.icon}</span>
          <span className={styles.stat_value}>{s.value}</span>
          <span className={styles.stat_label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
