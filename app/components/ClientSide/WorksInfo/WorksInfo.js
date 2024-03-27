"use client";

import React from "react";

/* Icons */
import { CalendarOutlined } from "@ant-design/icons";

/* Lib */
import RenderedCitations from "@/lib/RenderedCitations";

/* Styles */
import styles from "./styles.module.css";
import CitationsIcon from "@/public/media/citations";

/**
 * WorksInfo is a client-side function component that displays the year of publication and the number of citations of a work.
 *
 * @param {Object} citationsCount - The number of citations of the work.
 * @param {string} yearPublished - The year of publication of the work.
 * @returns {JSX.Element} A div containing the year of publication and the number of citations.
 */
export default function WorksInfo({ citationsCount, yearPublished }) {
  return (
    <>
      <div className={styles.worksInfo_container}>
        <div>
          <CitationsIcon /> Citaciones:
          {RenderedCitations(citationsCount)}
        </div>
        <div className={styles.margin_5}>
          {React.createElement(CalendarOutlined)} Publicado: {yearPublished}
        </div>
      </div>
    </>
  );
}
