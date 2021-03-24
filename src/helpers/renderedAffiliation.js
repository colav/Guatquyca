import { Link } from "react-router-dom";
import { PATHUDEA, PATHUNAULA, PATHUEC } from "../constants/routes";

export const renderedAffiliation = (name, setCurrentURL) => {
  switch (name) {
    case "University of Antioquia":
      return (
        <Link to={PATHUDEA} onClick={() => setCurrentURL(PATHUDEA)}>
          Universidad de Antioquia
        </Link>
      );
    case "Unaula":
      return (
        <Link to={PATHUNAULA} onClick={() => setCurrentURL(PATHUNAULA)}>
          Universidad Autónoma Latinoamericana
        </Link>
      );
    case "UEC":
      return (
        <Link to={PATHUEC} onClick={() => setCurrentURL(PATHUEC)}>
          Universidad Externado de Colombia
        </Link>
      );
    default:
      return "";
  }
};
