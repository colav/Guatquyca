import React, { useEffect } from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import AffiliationList from "../searchLists/AffiliationList";
import EntityList from "../searchLists/EntityList";
import PersonList from "../searchLists/PersonList";

/* Utilities */
import { APIRequest } from "../../apis/clustercien";
import { useLocation, useSearchParams } from "react-router-dom";

/* Constants */
import { CHECKLIST } from "../../utils/constants";

const SearchResult = () => {
  const location = useLocation();
  const [state, setUrl] = APIRequest(`${location.pathname}${location.search}`);
  const [searchParams] = useSearchParams();
  const type =
    searchParams.get("type") === null
      ? searchParams.get("data")
      : searchParams.get("type");

  useEffect(() => {
    document.title = "Resultados de Búsqueda - ImpactU";
  }, []);

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  } else if (type === "person") {
    return <PersonList data={state.data} type={type} />;
  } else if (CHECKLIST.AFFILIATIONENTITIES.includes(type)) {
    return <EntityList data={state.data} type={type} />;
  }
  return <EntityList data={state.data} type={type} />;
};

export default SearchResult;
