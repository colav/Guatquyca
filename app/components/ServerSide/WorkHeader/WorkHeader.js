/* Components */
import AuthorsList from "@/app/components/ClientSide/AuthorsHorizontalList/AuthorsList";
import OpenAccessStatus from "@/app/components/ClientSide/OpenAccessStatus/OpenAccessStatus";
import ProductExternalIDTag from "@/app/components/ServerSide/ProdutExternalIDTag/ProductExternalIDTag";
import RankingTag from "@/app/components/ServerSide/RankingTag/RankingTag";

/* Icons */
import {
  CalendarOutlined,
  TeamOutlined,
  TranslationOutlined,
} from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Space } from "antd";

/* Utilities */
import dateBuilder from "@/lib/Utils/dateBuilder";
import { LANGUAGES } from "@/lib/constants";

/**
 * WorkHeader component displays the main header information for an academic work.
 *
 * This includes:
 * - The work title as a heading
 * - Status badges (Open Access, External IDs, Rankings)
 * - Metadata (Language, Publication Date, Authors)
 *
 * Fallbacks are shown with a distinct style when data is missing.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the academic work
 * @param {Object|null} props.openAccess - Open access information object
 * @param {string} [props.openAccess.open_access_status] - Open access status ("gold", "green", etc.)
 * @param {Array|null} props.externalIds - Array of external identifier objects
 * @param {Object|null} props.ranking - Ranking information object
 * @param {string} props.language - Language code (ISO language code)
 * @param {string|number|null} props.datePublished - Publication date (Unix timestamp or date string)
 * @param {Array|null} props.authors - Array of author objects
 * @param {number} [props.authorsCount] - Total number of authors
 * @param {string} props.workID - Unique identifier of the work
 *
 * @returns {JSX.Element} Header section with work title, badges, and metadata
 *
 */
export default function WorkHeader({
  title,
  openAccess,
  externalIds,
  ranking,
  language,
  datePublished,
  authors,
  authorsCount,
  workID,
}) {
  const languageDisplay = LANGUAGES[language] || (
    <span className={styles.fallback}>No disponible</span>
  );
  const publicationDate = dateBuilder(datePublished, "unix") || (
    <span className={styles.fallback}>No disponible</span>
  );

  return (
    <>
      <h2 className={styles.work_title}>{title}</h2>
      <Space wrap size={[0, 8]} className={styles.badges_container}>
        {openAccess?.open_access_status && (
          <OpenAccessStatus status={openAccess.open_access_status} />
        )}
        {externalIds?.length > 0 && (
          <ProductExternalIDTag idList={externalIds} />
        )}
        {ranking && <RankingTag ranking={ranking} />}
      </Space>
      <div className={styles.metadata_container}>
        <div>
          <TranslationOutlined /> Idioma: {languageDisplay}
        </div>
        <div className={styles.metadata_item_with_offset}>
          <CalendarOutlined /> Publicado: {publicationDate}
        </div>
        <TeamOutlined />
        {authors?.length > 0 && (
          <div>
            <AuthorsList
              authors={authors}
              authors_count={authorsCount}
              workID={workID}
            />
          </div>
        )}
      </div>
    </>
  );
}
