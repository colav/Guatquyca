import { createContext, useContext } from "react";

export const T = createContext({});

export const useToken = () => useContext(T);
