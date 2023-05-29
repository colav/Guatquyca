import React from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";

/* Utilities */
import { APIRequest } from "../../apis/colav";
import { useLocation } from "react-router-dom";

const AgreementsTab = () => {
  const location = useLocation();
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&data=agreements`
  );

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return <LoadingCard />;
  }
  return <div>AgreementsTab</div>;
};

export default AgreementsTab;
