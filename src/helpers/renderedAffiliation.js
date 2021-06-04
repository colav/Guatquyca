import { Link } from "react-router-dom";
import { INSTITUTIONS_PATH } from "../constants/routes";

export const renderedAffiliation = (name, id, setCurrentURL) => {
  return (
    <Link
      to={`${INSTITUTIONS_PATH}${id}`}
      onClick={() => setCurrentURL(`${INSTITUTIONS_PATH}${id}`)}
    >
      {name === "University of Antioquia" ? "Universidad de Antioquia" : name}
    </Link>
  );
};
