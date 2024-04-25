"use client";

/* React */
import React from "react";

/* Icons */
import { GithubOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { App } from "antd";

export default function DisclaimerModal() {
  const MyPage = () => {
    React.useEffect(() => {
      showModal();
    }, []);
    const { modal } = App.useApp();

    const showModal = () => {
      modal.warning({
        title: "Plataforma en construcción",
        content: (
          <>
            <p>
              <b id={styles.impact}>Impact</b>
              <b id={styles.u}>U</b> está en desarrollo y nos complace anunciar
              que esta es la primera versión disponible para ofrecer información
              sobre artículos resultados de investigación. Integrando no solo
              aquellos que cuentan con DOI, sino también los que no lo tienen,
              procedentes de diferentes bases de datos locales, nacionales y
              globales.
            </p>
            <p>
              <b>
                Actualmente estamos llevando a cabo pruebas en la plataforma,
                por lo que algunos perfiles podrían contener información
                incorrecta. Estamos trabajando arduamente para garantizar la
                precisión de los datos y mejorar la calidad de la información.
                Agradecemos tu comprensión y paciencia durante este proceso de
                mejora.
              </b>
            </p>
            <p>
              La plataforma está en{" "}
              <a
                href="https://es.wikipedia.org/wiki/Ciclo_de_vida_del_lanzamiento_de_software#Beta"
                target="_blank"
                rel="noreferrer"
              >
                versión beta
              </a>{" "}
              y aún requiere de trabajo posterior, agradecemos todos los
              comentarios que pueda hacer en{" "}
              <a
                href="https://github.com/colav/impactu/issues"
                target="_blank"
                rel="noreferrer"
              >
                nuestro repositorio de GitHub <GithubOutlined />
              </a>{" "}
              a través de la opción{" "}
              <b>
                <i>New issue</i>
              </b>
              .
            </p>
          </>
        ),
        maskClosable: true,
        centered: true,
        autoFocusButton: null,
        okText: "Probar versión beta",
        width: "450px",
      });
    };
  };
  return (
    <App>
      <MyPage />
    </App>
  );
}
