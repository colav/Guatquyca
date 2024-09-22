"use client";

/* Hooks */
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* Components */
import Error from "@/app/error";
import Loading from "@/app/loading";

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
  };

  for (let [key, value] of queryItems) {
    initialQueryParams[key] = value;
  }

  const [queryParams, setQueryParams] = useState(initialQueryParams);

  const pathname = usePathname();
  const URL = URLBuilder(`/app${pathname}`, queryParams);
  const [state, setUrl] = APIRequest(URL);

  console.log(state.data);

  if (state.isError) {
    return <Error />;
  } else if (state.isLoading) {
    return <Loading />;
  }
  return <p>Patentes</p>;
}
