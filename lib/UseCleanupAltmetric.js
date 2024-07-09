"use client";

import { useEffect } from "react";

/**
 * `UseCleanupAltmetric` is a client-side functional component.
 *
 * This component is used to remove all Altmetric popovers and scripts from the DOM.
 * It selects all Altmetric popovers and scripts from the entire document and removes them.
 * This component does not receive any input parameters and does not return any output.
 */
export default function UseCleanupAltmetric() {
  // Function to remove Altmetric popovers and scripts
  const removeAltmetricElements = () => {
    const popovers = document.querySelectorAll(
      "div.altmetric-embed.altmetric-popover.altmetric-bottom"
    );
    popovers.forEach((popover) => popover.remove());

    const scripts = document.querySelectorAll(
      `script[src^="https://api.altmetric.com/v1/doi/"]`
    );
    scripts.forEach((script) => script.remove());
  };

  useEffect(() => {
    // Run the removeAltmetricElements function when the component mounts
    removeAltmetricElements();

    // Return the removeAltmetricElements function to run when the component unmounts
    return removeAltmetricElements;
  }, []); // Empty dependency array means this effect runs once on mount and cleanup runs on unmount

  return null;
}
