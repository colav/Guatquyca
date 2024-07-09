"use client";

import { useState } from "react";

/* Components */
import Error from "@/app/error";
import Loading from "@/app/loading";
import PaginationOnWorkList from "../PaginationOnWorkList/PaginationOnWorkList";
import SortWorkList from "../SortWorkList/SortWorkList";
import WorkItem from "../WorkItem/WorkItem";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import { usePathname, useSearchParams } from "next/navigation";
import MathJax from "@/lib/mathjax";
import URLBuilder from "@/lib/URLBuilder";
import { APIRequest } from "@/lib/clientAPI";
import CSVButton from "../CSVButton/CSVButton";
import APIButton from "../APIButton/APIButton";
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";
import Script from "next/script";
import UseCleanupAltmetric from "@/lib/UseCleanupAltmetric";

/**
 * WorkListOnEntity is a client-side function component for displaying a list of works on an entity.
 *
 * @returns {JSX.Element} A list of works on an entity, with pagination and sorting options.
 */
export default function WorkListOnEntity() {
  const query = useSearchParams();
  const queryItems = query.entries();
  let initialQueryParams = {
    max: 10,
    page: 1,
    sort: "citations-",
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
  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white", padding: "6px" },
        body: { padding: "10px 0 5px 5px" },
      }}
      id="work_list"
      title={`${state?.data?.total_results} ${
        state?.data?.total_results === 1
          ? SINGULAR_TITLES["works"]
          : TITLES["works"]
      }`}
      extra={
        <div style={{ display: "flex" }}>
          <SortWorkList
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            setUrl={setUrl}
          />
          <CSVButton pathname={pathname} />
          <APIButton pathname={pathname} queryParams={queryParams} />
        </div>
      }
    >
      <UseCleanupAltmetric />
      <MathJax />
      <Script src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js" />
      <ul className={styles.ul}>
        {state.data.data.map((item) => (
          <WorkItem key={item.id} item={item} />
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
