/* Components */
import AuthorsHorizontalList from "../../ClientSide/AuthorsHorizontalList/AuthorsHorizontalList";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import Source from "../Source/Source";
import SubjectsTags from "../SubjectsTags/SubjectsTags";
import WorksInfo from "../../ClientSide/WorksInfo/WorksInfo";
import WorkTitleLink from "../../ClientSide/WorkTitleLink/WorkTitleLink";
import SortSearchResults from "../../ClientSide/SortSearchResults/SortSearchResults";

/* lib */
import getData from "@/lib/api";
import URLBuilder from "@/lib/URLBuilder";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import { TITLES } from "@/lib/constants";

/* Styles */
import styles from "./styles.module.css";

/**
 * WorkList is an asynchronous function server component that fetches a list of works based
 * on provided search parameters and displays them in a Card component.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @returns {JSX.Element} A Card component that displays the list of works.
 */
export default async function WorkList({ searchParams }) {
  const URL = URLBuilder("app/search/works", searchParams);
  const data = await getData(URL);

  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 10px 10px" },
      }}
      title={TITLES["works"]}
      extra={
        <div>
          <p id={styles.white_text}>
            {data.total_results}{" "}
            {data.total_results === 1 ? "resultado" : "resultados"}
          </p>
          <SortSearchResults searchParams={searchParams} works={true} />
        </div>
      }
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <li key={item.id}>
            <WorkTitleLink
              workTitle={item.title}
              workID={item.id}
              openAccessStatus={item.open_access_status}
            />
            <br />
            {item.source.name ? <Source sourceName={item.source.name} /> : ""}
            Autores: <AuthorsHorizontalList authors={item.authors} />
            {item.subjects.length > 0 && (
              <div>
                Temas:
                <SubjectsTags subjectsList={item.subjects} />
              </div>
            )}
            <WorksInfo
              citationsCount={item.citations_count}
              yearPublished={item.year_published}
            />
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
