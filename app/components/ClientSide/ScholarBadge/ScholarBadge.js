import React from "react";

/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/*
 * ScholarBadge is a client-side function component that displays the number of citations of a work.
 *
 * @param {number} number - The number of citations from Google Scholar to display.
 */
export default function OpenAlexBadge({ number }) {
  return (
    <div className={styles.container}>
      <Image
        src="/media/ScholarBadge.png"
        alt={`Citations: ${number}`}
        width={124}
        height={22}
      />
      <div className={styles.numberContainer}>
        <span className={styles.score}>{number}</span>
      </div>
    </div>
  );
}
