import { useReducer, useEffect, useState } from "react";
import axios from "axios";

const initialState = {
  isLoading: true,
  isError: false,
  data: [],
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

export const ElasticAPIRequest = (input, size) => {
  console.log(size);
  const [elasticInput, setElasticInput] = useState(input);
  const [elasticState, dispatch] = useReducer(dataFetchReducer, initialState);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        console.log(elasticInput);
        const result = await axios.post(
          "http://colav.co:9200/colombia_affiliations_names/_search",
          {
            suggest: {
              "affiliation-suggest": {
                prefix: elasticInput,
                completion: {
                  field: "suggest",
                  size: size,
                  fuzzy: {
                    fuzziness: 2,
                  },
                },
              },
            },
          },
          {
            auth: {
              username: "elastic",
              password: "0colav*",
            },
          }
        );

        if (!didCancel) {
          if (result.status === 204) {
            dispatch({ type: "FETCH_FAILURE" });
          } else dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [elasticInput]);

  return [elasticState, setElasticInput];
};
