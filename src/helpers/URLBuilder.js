import history from "../history";

export const URLBuilder = () => {
  return history.location.pathname + history.location.search;
};

export default URLBuilder;
