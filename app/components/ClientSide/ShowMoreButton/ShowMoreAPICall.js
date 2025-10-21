"use client";

import { useState, useRef } from "react";
import { Button } from "antd";

/**
 * ShowMoreAPICall Component
 *
 * This component renders a button that toggles between showing all authors and showing a limited list of authors.
 * When the button is clicked, it makes an API call to fetch the full list of authors if not already showing all.
 * Shows a loading spinner while fetching.
 * The fetched full authors list is cached to avoid repeated API calls.
 *
 * The button is only shown if authors_count is greater than 10.
 *
 * @param {Array} authors - The initial list of authors
 * @param {Function} setAuthorsList - Function to update the authors list state
 * @param {string} workID - The ID of the work to fetch authors for
 * @param {number} authors_count - Total number of authors
 *
 * @returns {JSX.Element|null} The rendered ShowMore button or null if not needed.
 */
export default function ShowMoreAPICall({
  authors,
  setAuthorsList,
  workID,
  authors_count,
}) {
  const [showingAll, setShowingAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const fullAuthorsRef = useRef(null);

  if (authors_count <= 10) return null;

  const onClick = async () => {
    if (!showingAll) {
      if (fullAuthorsRef.current) {
        setAuthorsList(fullAuthorsRef.current);
      } else {
        setLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_CLIENT_API}/app/work/${workID}/authors`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          fullAuthorsRef.current = data.data;
          setAuthorsList(data.data);
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      setAuthorsList(authors);
    }
    setShowingAll(!showingAll);
  };

  return (
    <Button size="small" onClick={onClick} type="dashed" loading={loading}>
      {showingAll ? "Mostrar menos" : `Mostrar todos (${authors_count})`}
    </Button>
  );
}
