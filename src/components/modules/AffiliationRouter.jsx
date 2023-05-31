import React from "react";

/* Hooks */
import { useSearchParams } from "react-router-dom";

/* Components */
import Institutions from "./Institutions";
/* import Departments from './Departments';
import Groups from './Groups';
import Faculties from './Faculties'; */

import Sorry from "./Sorry";

const AffiliationRouter = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (type === "institution") {
    return <Institutions />;
  } else if (type === "department") {
    return <Sorry />;
  } else if (type === "group") {
    return <Sorry />;
  } else if (type === "faculty") {
    return <Sorry />;
  }
  return "Ruta no conectada";
};

export default AffiliationRouter;
