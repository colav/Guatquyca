/* Components */
import AuthorsHorizontalList from "../AuthorsHorizontalList/AuthorsHorizontalList";
import ProductTypeTags from "../../ServerSide/ProductTypeTags/ProductTypeTags";
import Source from "../../ServerSide/Source/Source";
import SubjectsTags from "../../ServerSide/SubjectsTags/SubjectsTags";
import WorksInfo from "../WorksInfo/WorksInfo";
import WorkTitleLink from "../WorkTitleLink/WorkTitleLink";

/* Icons */
import { TeamOutlined, TagsOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

export default function WorkItem({ item }) {
  return (
    <li key={item.id}>
      <ProductTypeTags productsTypeList={item.product_type} />
      <WorkTitleLink
        workTitle={item.title}
        workID={item.id}
        openAccessStatus={item.open_access_status}
        doi={
          item.external_ids.find((externalId) => externalId.source === "doi")
            ?.id
        }
      />
      {item.source.name && <Source sourceName={item.source.name} />}
      <TeamOutlined className={styles.gray} /> Autores:{" "}
      <AuthorsHorizontalList authors={item.authors} />
      {item.subjects.length > 0 && (
        <div>
          <TagsOutlined className={styles.gray} /> Temas:
          <SubjectsTags subjectsList={item.subjects} />
        </div>
      )}
      <WorksInfo
        citationsCount={item.citations_count}
        yearPublished={item.year_published}
      />
      <hr className={styles.hr} />
    </li>
  );
}
