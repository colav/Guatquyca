"use client";

import React from "react";

/* Components */
import AltmetricsContainer from "../AltMetrics/AlmetricsContainer";
import CitationsBadges from "../CitationsBadges/CitationsBadges";

/* Icons */
import { CalendarOutlined, CommentOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * WorksInfo is a client-side function component that displays the year of publication and the number of citations of a work.
 *
 * @param {Object} citationsCount - The number of citations of the work.
 * @param {string} yearPublished - The year of publication of the work.
 * @param {string} doi - The DOI of the work.
 * @returns {JSX.Element} A div containing the year of publication and the number of citations.
 */
export default function WorksInfo({ citationsCount, yearPublished, doi }) {
  return (
    <>
      <div className={styles.worksInfo_container}>
        <div className={styles.margin_5}>
          <CalendarOutlined /> Publicado: {yearPublished || "No disponible"}
        </div>
        <CitationsBadges
          citationsCount={citationsCount}
          doi={doi}
          showTitle={true}
        />
        {doi && (
          <div className={styles.margin_5}>
            <CommentOutlined /> Altmétricas:
            <AltmetricsContainer doi={doi} />
          </div>
        )}
      </div>
    </>
  );
}
