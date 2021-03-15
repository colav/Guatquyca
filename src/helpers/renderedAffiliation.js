import { Link } from "react-router-dom";
import { PATHUDEA, PATHUNAULA, PATHUEC } from "../constants/routes";

export const renderedAffiliation = (name) => {
  switch (name) {
    case "University of Antioquia":
      return <Link to={PATHUDEA}>Universidad de Antioquia</Link>;
    case "Unaula":
      return <Link to={PATHUNAULA}>Universidad Autónoma Latinoamericana</Link>;
    case "UEC":
      return <Link to={PATHUEC}>Universidad Externado de Colombia</Link>;
    default:
      return "Pendiente en Endpoint";
  }
};
