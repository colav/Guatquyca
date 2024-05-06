// Import the necessary hooks from React
import { useReducer, useEffect, useState } from "react";

// Define the initial state for the reducer
const initialState = {
  isLoading: true,
  isError: false,
  data: [],
};

// Define the state changes for each action type
const stateChanges = {
  FETCH_INIT: (state) => ({ ...state, isLoading: true, isError: false }),
  FETCH_SUCCESS: (state, action) => ({
    ...state,
    isLoading: false,
    isError: false,
    data: action.payload,
  }),
  FETCH_FAILURE: (state) => ({ ...state, isLoading: false, isError: true }),
};

/**
 * dataFetchReducer is a reducer function for handling the state of a data fetch operation.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The dispatched action.
 * @returns {Object} The new state.
 */
const dataFetchReducer = (state, action) => {
  const stateChange = stateChanges[action.type];
  if (!stateChange) {
    throw new Error();
  }
  return stateChange(state, action);
};

/**
 * APIRequest is a custom hook that fetches data from an API.
 *
 * @param {string} initialUrl - The initial URL to fetch data from.
 * @returns {Array} An array containing the state of the API request and a function to set the URL.
 */
export const APIRequest = (initialUrl) => {
  // The URL state is the current URL to fetch data from
  const [url, setUrl] = useState(initialUrl);

  // The state is the current state of the API request
  // The dispatch function is used to update the state
  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  // The useEffect hook fetches data from the API when the URL state changes
  useEffect(() => {
    // The didCancel variable is used to prevent state updates after the component has unmounted
    let didCancel = false;

    const fetchData = async () => {
      // Dispatch a FETCH_INIT action to set isLoading to true and isError to false
      dispatch({ type: "FETCH_INIT" });

      try {
        // Fetch data from the API
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT_API}${url}`
        );

        // If the component has not unmounted, update the state with the fetched data
        if (!didCancel) {
          if (result.status === 204) {
            // If the status is 204, dispatch a FETCH_FAILURE action to set isError to true
            dispatch({ type: "FETCH_FAILURE" });
          } else {
            // Otherwise, dispatch a FETCH_SUCCESS action to set isLoading to false and update the data
            dispatch({ type: "FETCH_SUCCESS", payload: await result.json() });
          }
        }
      } catch (error) {
        // If an error occurred and the component has not unmounted, dispatch a FETCH_FAILURE action to set isError to true
        if (!didCancel) {
          console.log("Data fetch error:: " + error);
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    // Call the fetchData function
    fetchData();

    // Return a cleanup function that sets didCancel to true when the component unmounts
    return () => {
      didCancel = true;
    };
  }, [url]); // The useEffect hook depends on the URL state

  // Return the state of the API request
  return [state, setUrl];
};
