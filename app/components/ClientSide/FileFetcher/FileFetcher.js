"use client";

/* Hooks */
import { useEffect, useMemo, useState } from "react";

/* UI Library Components */
import { Modal } from "antd";

/* Utils */
import URLBuilder from "@/lib/utils/URLBuilder";
import Spinner from "../Spinner/Spinner";
import { WarningOutlined } from "@ant-design/icons";

/**
 * FileFetcher fetches an export file and automatically downloads it once ready.
 *
 * @param {string} pathname - The pathname used to build the API URL.
 * @param {Object} queryParams - The query parameters used to build the API URL.
 * @param {string} fileType - The export endpoint and format, such as csv or excel.
 * @param {string} fileExtension - The extension used for the downloaded file.
 * @returns {JSX.Element} The FileFetcher component.
 */
export default function FileFetcher({
  pathname,
  queryParams,
  fileType = "csv",
  fileExtension = fileType,
}) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    isError: false,
  });
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  // Remove unnecessary query parameters
  const filteredQueryParams = useMemo(() => {
    const params = { ...queryParams };
    delete params.page;
    delete params.max;
    delete params.sort;
    return params;
  }, [queryParams]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(
      URLBuilder(
        `${process.env.NEXT_PUBLIC_CLIENT_API}/app${pathname}/${fileType}`,
        filteredQueryParams,
      ),
      {
        signal: abortController.signal,
      },
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
      abortController.abort();
    };
  }, [fileType, filteredQueryParams, pathname]);

  useEffect(() => {
    if (!state.isError && state.data) {
      const url = URL.createObjectURL(state.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Productos_${dateString}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setTimeout(() => {
        Modal.destroyAll();
      }, 1000);
    }
  }, [fileExtension, state]);

  if (state.isLoading) {
    return (
      <>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <Spinner />
        </div>
        Estamos generando tu archivo {fileType === "excel" ? "Excel" : "CSV"}.
        Este proceso puede llevar algunos minutos. Por favor, no cierres esta
        ventana hasta que la descarga se haya completado.
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