"use client";

/* React */
import { useEffect, useRef } from "react";

/* Styles */
import styles from "./styles.module.css";

/**
 * `AltMetric` is a client-side functional component.
 *
 * @param {String} doi - The DOI (Digital Object Identifier) of the work item. It's used to generate the Altmetric badge.
 *
 * This component is used to generate an Altmetric badge for a work item. It uses the `useEffect` hook to create a new badge
 * every time the component mounts. The badge is created with the given DOI and appended to the component's root element.
 * If the Altmetric embed script is loaded, it initializes the new badge.
 */
export default function AltMetric({ doi }) {
  const badgeRef = useRef();

  useEffect(() => {
    const badge = document.createElement("div");
    badge.className = "altmetric-embed";
    badge.setAttribute("data-doi", doi);
    badge.setAttribute("data-badge-popover", "bottom");
    badge.setAttribute("data-link-target", "_blank");
    badge.setAttribute("data-hide-less-than", "1");
    badgeRef.current.appendChild(badge);

    if (window._altmetric_embed_init) {
      window._altmetric_embed_init(badgeRef.current);
    }
  }, []);

  return <div ref={badgeRef} id={styles.altmetric}></div>;
}
