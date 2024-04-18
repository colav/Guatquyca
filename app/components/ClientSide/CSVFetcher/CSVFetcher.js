"use client";

/* React */
import { useEffect, useState, useRef } from "react";

/* UI Library Components */
import { Modal } from "antd";

export default function CSVFetcher({ pathname }) {
  const [state, setState] = useState({ data: null, isError: false });
  const abortController = useRef(new AbortController());
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  useEffect(() => {
    fetch(`${process.env.CLIENT_API}${pathname}/csv`, {
      signal: abortController.current.signal,
    })
      .then((response) => response.blob())
      .then((data) => {
        setState({ data, isError: false });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        } else {
          setState({ data: null, isError: true });
        }
      });

    return () => {
      abortController.current.abort();
    };
  }, [pathname]);

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

  return state.isError ? (
    <p>
      Lo sentimos, en este momento no podemos procesar tu petición. Por favor
      intenta nuevamente en unos minutos
    </p>
  ) : (
    <p>
      Estamos generando tu archivo CSV. Este proceso puede llevar algunos
      minutos. Por favor, no cierres esta ventana hasta que la descarga se haya
      completado.
    </p>
  );
}
