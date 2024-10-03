/* Components */
import AuthorsListOnList from "../AuthorsHorizontalList/AuthorsListOnList";
import InvisibleContainer from "./InvisibleContainer";
import Source from "../../ServerSide/Source/Source";
import SubjectsTags from "../../ServerSide/SubjectsTags/SubjectsTags";
import WorksInfo from "../WorksInfo/WorksInfo";
import WorkTitleLink from "../WorkTitleLink/WorkTitleLink";

/* Constants */
import { PRODUCT_TYPES } from "@/lib/constants";

/* Icons */
import { TeamOutlined, TagsOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import Ribbon from "antd/lib/badge/Ribbon";

export default function WorkItem({ item }) {
  const ribbonStyles = {
    boxShadow:
      "8px -8px 6px rgba(255, 240, 240, 0.3)," +
      "2px 2px 8px rgba(255, 116, 69, 0.3)," +
      "5px 8px 16px rgba(255, 106, 69, 0.1)," +
      "4px 4px 3px rgba(255, 56, 69, 0.15)",
    width: "110px",
    textWrap: "wrap",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.1",
    display: item.product_types?.length > 0 ? "block" : "none",
  };

  return (
    <>
      <InvisibleContainer
        source={item.product_types?.length > 0 && item.product_types[0].source}
      />
      <Ribbon
        text={
          item.product_types?.length > 0
            ? PRODUCT_TYPES[item.product_types[0]?.name] ||
              item.product_types[0]?.name
            : ""
        }
        color="#ff6a45"
        placement="start"
        style={ribbonStyles}
        className={styles.ribbon}
      >
        <li key={item.id} className={styles.work_item}>
          <div className={styles.work_container}>
            <WorkTitleLink
              workTitle={item.title}
              workID={item.id}
              openAccessStatus={item.open_access_status}
              doi={
                item.external_ids.find(
                  (externalId) => externalId.source === "doi"
                )?.id
              }
            />
            {item.source.name && <Source sourceName={item.source.name} />}
            <TeamOutlined className={styles.gray} /> Autores:{" "}
            <AuthorsListOnList
              authors={item.authors}
              authors_count={item.authors_count}
              workID={item.id}
            />
            {item.subjects.length > 0 && (
              <div>
                <TagsOutlined className={styles.gray} /> Temas:
                <SubjectsTags subjectsList={item.subjects} />
              </div>
            )}
            <WorksInfo
              citationsCount={item.citations_count}
              yearPublished={item.year_published}
              doi={
                item.external_ids.find(
                  (externalId) => externalId.source === "doi"
                )?.id
              }
            />
          </div>
        </li>
      </Ribbon>
    </>
  );
}
