"use client";

/* Hooks */
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* Components */
import Error from "@/app/error";
import Loading from "@/app/loading";
import PaginationOnWorkList from "../PaginationOnWorkList/PaginationOnWorkList";
import PatentItem from "../PatentItem/PatentItem";
import SortWorkList from "../SortWorkList/SortWorkList";

/* Constants */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import URLBuilder from "@/lib/Utils/URLBuilder";
import { APIRequest } from "@/lib/APIS/clientAPI";

/**
 * PatentsList is a client-side function component for displaying a list of patents on an entity.
 *
 * @returns {JSX.Element} A list of patents on an entity, with pagination and sorting options.
 */
export default function PatentsList() {
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
  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 5px 0" },
      }}
      title={`${state?.data?.total_results} ${
        state?.data?.total_results === 1
          ? SINGULAR_TITLES["patent"]
          : TITLES["patents"]
      }`}
      extra={
        <SortWorkList
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setUrl={setUrl}
        />
      }
    >
      <ul className={styles.ul}>
        {state.data.data.map((item) => (
          <PatentItem key={item.id} item={item} />
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
