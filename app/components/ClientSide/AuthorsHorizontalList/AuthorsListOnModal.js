"use client";

import { useState } from "react";

/* Components */
import ShowMoreButton from "../ShowMoreButton/ShowMoreButton";
import AuthorsAffiliationsTooltip from "@/app/components/ServerSide/AuthorsAffiliationsTooltip/AuthorsAffiliationsTooltip";

/* UI Library Components */
import { Button, Tooltip } from "antd";

/**
 * AuthorsHorizontalList is a function component that displays a list of authors.
 * It initially shows up to 10 authors, and provides a "Show More" button if there are more than 10 authors.
 *
 * @param {Object[]} authors - An array of author objects. Each object should have an 'id' and 'full_name' property.
 * @returns {JSX.Element} A div containing a list of authors and a "Show More" button if necessary.
 */
export default function AuthorsListOnModal({ authors }) {
  const [authorsQuantity, setAuthorsQuantity] = useState(10);
  const [showingAll, setShowingAll] = useState(false);

  return (
    <div>
      {authors.slice(0, authorsQuantity).map((author) => (
        <Tooltip
          title={<AuthorsAffiliationsTooltip author={author} />}
          color="white"
          trigger="click"
          key={author.id}
        >
          <Button type="link">{author.full_name}</Button>
        </Tooltip>
      ))}
      {authors.length > 10 && (
        <ShowMoreButton
          showingAll={showingAll}
          setAuthorsQuantity={setAuthorsQuantity}
          setShowingAll={setShowingAll}
          length={authors.length}
        />
      )}
    </div>
  );
}
