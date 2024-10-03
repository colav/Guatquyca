"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* Components */
import Error from "@/app/error";
import Loading from "@/app/loading";
import PaginationOnWorkList from "../PaginationOnWorkList/PaginationOnWorkList";
import ProjectItem from "../ProjectItem/ProjectItem";
import SortWorkList from "../SortWorkList/SortWorkList";

/* Utilities */
import URLBuilder from "@/lib/Utils/URLBuilder";
import { APIRequest } from "@/lib/APIS/clientAPI";

/* Constants */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/**
 * ProjectsList is a client-side function component for displaying a list of works on an entity.
 *
 * @returns {JSX.Element} A list of works on an entity, with pagination and sorting options.
 */
export default function ProjectsList() {
  const query = useSearchParams();
  const queryItems = query.entries();
  let initialQueryParams = {
    max: 10,
    page: 1,
    sort: "alphabetical_asc",
  };

  for (let [key, value] of queryItems) {
    initialQueryParams[key] = value;
  }

  const [queryParams, setQueryParams] = useState(initialQueryParams);

  const pathname = usePathname();
  const URL = URLBuilder(`/app${pathname}`, queryParams);
  const [state, setUrl] = APIRequest(URL);

  if (state.isError) {
    return <Error />;
  } else if (state.isLoading) {
    return <Loading />;
  }
  if (!state.data.data.length) {
    return <EmptyCard text="No hay Proyectos disponibles para esta entidad." />;
  } else {
    return (
      <Card
        size="small"
        styles={{
          header: { backgroundColor: "#003e65", color: "white" },
          body: { padding: "10px 0 5px 0" },
        }}
        title={`${state?.data?.total_results} ${
          state?.data?.total_results === 1
            ? SINGULAR_TITLES["project"]
            : TITLES["projects"]
        }`}
        extra={
          <SortWorkList
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            setUrl={setUrl}
            type="projects"
          />
        }
      >
        <ul className={styles.ul}>
          {state.data.data.map((item) => (
            <ProjectItem key={item.id} item={item} />
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
}
