/* Hooks */
import { useLocation, useSearchParams } from "react-router-dom";

export const URLBuilder = (setParams) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const keys = Object.keys(setParams);
  const values = Object.values(setParams);
  let URL = location.pathname + "?";

  for (const [key, value] of searchParams.entries()) {
    if (!keys.includes(key)) {
      URL += `${key}=${value}&`;
    }
  }
  for (let i = 0; i < values.length; i++) {
    URL += `${keys[i]}=${values[i]}`;
    if (i !== keys.length - 1) {
      URL += "&";
    }
  }

  return URL;
};
