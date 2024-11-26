"use client";

/* Hooks */
import { useEffect, useState, useRef } from "react";

/* UI Library Components */
import { Modal } from "antd";

/* Utils */
import URLBuilder from "@/lib/Utils/URLBuilder";
import Spinner from "../Spinner/Spinner";
import { WarningOutlined } from "@ant-design/icons";

/**
 * CSVFetcher component fetches a CSV file from the provided pathname and query parameters.
 * It displays a message while the CSV file is being fetched and automatically downloads the file once ready.
 *
 * @param {string} pathname - The pathname used to build the API URL.
 * @param {Object} queryParams - The query parameters used to build the API URL.
 * @returns {JSX.Element} The CSVFetcher component.
 */
export default function CSVFetcher({ pathname, queryParams }) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    isError: false,
  });
  const abortController = useRef(new AbortController());
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  // Remove unnecessary query parameters
  const filteredQueryParams = { ...queryParams };
  delete filteredQueryParams.page;
  delete filteredQueryParams.max;
  delete filteredQueryParams.sort;

  useEffect(() => {
    fetch(
      URLBuilder(
        `${process.env.NEXT_PUBLIC_CLIENT_API}/app${pathname}/csv`,
        filteredQueryParams
      ),
      {
        signal: abortController.current.signal,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((data) => {
        setState({ data, isLoading: false, isError: false });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        } else {
          setState({ data: null, isLoading: false, isError: true });
        }
      });

    return () => {
      abortController.current.abort();
    };
  }, [pathname, filteredQueryParams]);

  useEffect(() => {
    if (!state.isError && state.data) {
      const url = URL.createObjectURL(state.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Productos_${dateString}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        Modal.destroyAll();
      }, 1000);
    }
  }, [state]);

  if (state.isLoading) {
    return (
      <>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <Spinner />
        </div>
        Estamos generando tu archivo CSV. Este proceso puede llevar algunos
        minutos. Por favor, no cierres esta ventana hasta que la descarga se
        haya completado.
      </>
    );
  } else if (state.isError) {
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <WarningOutlined
            style={{ fontSize: "30px", color: "#f9b250", marginBottom: "10px" }}
          />
        </div>
        Lo sentimos, en este momento no podemos procesar tu petición. Por favor
        intenta nuevamente en unos minutos.
      </>
    );
  }
  return null;
}
