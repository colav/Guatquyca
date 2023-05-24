/* Utilities */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function Navigation({ params }) {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.pathname);
  console.log(params);
  const navigates = "";
  /* navigate(
    `${location.pathname}?data=affiliations&type=${type}&max=${max}&page=${page}&sort=${value}`
  ); */
  return [navigates];
}
