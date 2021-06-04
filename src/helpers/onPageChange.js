/* Utilities */
import history from "../history";
import URLBuilder from "../helpers/URLBuilder";
const queryString = require("query-string");

export const onPageChange = ({ page, pageSize, setCurrentURL }) => {
  const parsed = queryString.parse(history.location.search);
  const newQuery = {
    ...parsed,
    max: pageSize.toString(),
    page: page.toString(),
  };
  history.push(
    `${history.location.pathname}?${queryString.stringify(newQuery)}`
  );
  setCurrentURL(URLBuilder());
};
