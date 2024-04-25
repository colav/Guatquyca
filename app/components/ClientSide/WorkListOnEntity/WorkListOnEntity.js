"use client";

import { useState } from "react";

/* Components */
import AuthorsHorizontalList from "../AuthorsHorizontalList/AuthorsHorizontalList";
import Error from "@/app/app/error";
import Loading from "@/app/app/loading";
import PaginationOnWorkList from "../PaginationOnWorkList/PaginationOnWorkList";
import SortWorkList from "../SortWorkList/SortWorkList";
import Source from "../../ServerSide/Source/Source";
import SubjectsTags from "../../ServerSide/SubjectsTags/SubjectsTags";
import WorksInfo from "../WorksInfo/WorksInfo";
import WorkTitleLink from "../WorkTitleLink/WorkTitleLink";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Row } from "antd";

/* Utilities */
import { usePathname } from "next/navigation";
import URLBuilder from "@/lib/URLBuilder";
import { APIRequest } from "@/lib/clientAPI";
import CSVButton from "../CSVButton/CSVButton";
import APIButton from "../APIButton/APIButton";

/**
 * WorkListOnEntity is a client-side function component for displaying a list of works on an entity.
 *
 * @returns {JSX.Element} A list of works on an entity, with pagination and sorting options.
 */
export default function WorkListOnEntity() {
  const [queryParams, setQueryParams] = useState({
    max: 10,
    page: 1,
    sort: "citations",
  });
  const pathname = usePathname();
  const URL = URLBuilder(pathname, queryParams);
  const [state, setUrl] = APIRequest(URL);

  if (state.isError) {
    return <Error />;
  } else if (state.isLoading) {
    return <Loading />;
  }
  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white", padding: "6px" },
        body: { padding: "10px 0 5px 5px" },
      }}
      id="work_list"
      title={`${state?.data?.total_results} Productos`}
      extra={
        <div style={{ display: "flex" }}>
          <SortWorkList
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            setUrl={setUrl}
          />
          <CSVButton pathname={pathname} />
          <APIButton pathname={pathname} />
        </div>
      }
    >
      <ul className={styles.ul}>
        {state.data.data.map((item) => (
          <li key={item.id}>
            <WorkTitleLink
              workTitle={item.title}
              workID={item.id}
              openAccessStatus={item.open_access_status}
            />
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
      <PaginationOnWorkList
        totalItems={state.data.total_results}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setUrl={setUrl}
      />
    </Card>
  );
}
