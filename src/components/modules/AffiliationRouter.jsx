import React from "react";

/* Hooks */
import { useSearchParams } from "react-router-dom";
import Institutions from "./Institutions";

const AffiliationRouter = ({ core }) => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (type === "institution") {
    return <Institutions core={core} />;
  }
  return "Ruta no conectada";
};

export default AffiliationRouter;
