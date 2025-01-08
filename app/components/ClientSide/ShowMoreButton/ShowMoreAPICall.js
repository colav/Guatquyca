"use client";

import { useState } from "react";

/* UI Library Components */
import { Button } from "antd";

/**
 * ShowMoreAPICall Component
 *
 * This component renders a button that toggles between showing all authors and showing a limited list of authors.
 * When the button is clicked, it makes an API call to fetch the full list of authors if not already showing all.
 *
 * @param {Array} authors - The initial list of authors
 * @param {Function} setAuthorsList - Function to update the authors list state
 * @param {string} workID - The ID of the work to fetch authors for
 *
 * @returns {JSX.Element} The rendered ShowMore button.
 */
export default function ShowMoreAPICall({ authors, setAuthorsList, workID }) {
  const [showingAll, setShowingAll] = useState(false);

  /**
   * Handles the button click event.
   * If not showing all authors, fetches the full list of authors from the API.
   * Otherwise, resets the authors list to the initial list.
   */
  const onClick = async () => {
    if (!showingAll) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT_API}/app/work/${workID}/authors`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAuthorsList(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      setAuthorsList(authors);
    }
    setShowingAll(!showingAll);
  };

  return (
    <Button size="small" onClick={onClick} type="dashed">
      {showingAll ? "Mostrar menos" : "Mostrar todos"}
    </Button>
  );
}
