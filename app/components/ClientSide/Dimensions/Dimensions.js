"use client";

/* React */
import { useEffect, useRef } from "react";

/* Styles */
import styles from "./styles.module.css";

/**
 * `Dimensions` is a client-side functional component.
 *
 * @param {String} doi - The DOI (Digital Object Identifier) of the work item. It's used to generate the Dimensions badge.
 *
 * This component is used to generate a Dimensions badge for a work item. It uses the `useEffect` hook to create a new badge
 * every time the component mounts. The badge is created with the given DOI and appended to the component's root element.
 * If the Dimensions embed script is loaded, it initializes the new badge.
 */
export default function Dimensions({ doi }) {
  if (doi === 5) {
    return null;
  }
  const badgeRef = useRef();

  /**
   * Extracts the DOI path from a full DOI URL and removes the leading slash.
   *
   * @param {string} doi - The full DOI URL.
   * @returns {string} The extracted DOI path without the leading slash.
   */
  function extractDoiPath(doi) {
    const url = new URL(doi);
    return url.pathname.substring(1); // Remove the leading slash
  }
  const doiPath = extractDoiPath(doi);

  useEffect(() => {
    const randomDelay = Math.random() * (2000 - 500) + 500;

    const timer = setTimeout(() => {
      const badge = document.createElement("span");
      badge.className = "__dimensions_badge_embed__";
      badge.setAttribute("data-doi", doiPath);
      badge.setAttribute("data-hide-zero-citations", "true");
      badge.setAttribute("data-legend", "hover-top");
      badge.setAttribute("data-style", "large_rectangle");
      badgeRef.current.appendChild(badge);

      if (window.__dimensions_embed) {
        window.__dimensions_embed.addBadges(badgeRef.current);
      }
    }, randomDelay);

    return () => clearTimeout(timer);
  }, []);

  return <span ref={badgeRef} id={styles.dimensions}></span>;
}
