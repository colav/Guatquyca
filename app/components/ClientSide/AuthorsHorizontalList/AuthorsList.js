"use client";

import { useState } from "react";

/* Components */
import AuthorTooltip from "@/app/components/ServerSide/AuthorTooltip/AuthorTooltip";
import ShowMoreAPICall from "../ShowMoreButton/ShowMoreAPICall";

/* UI Library Components */
import { Button, Tooltip } from "antd";

/**
 * AuthorsList Component
 *
 * This component renders a list of authors with tooltips showing their affiliations.
 * It also includes a button to show more authors if the total count exceeds the initial list.
 *
 * @param {Array} authors - The initial list of authors
 * @param {number} authors_count - The total count of authors
 * @param {string} workID - The ID of the work to fetch authors for
 *
 * @returns {JSX.Element} The rendered list of authors with a Tooltip wrapping author's affiliations.
 */
export default function AuthorsList({ authors, authors_count, workID }) {
  const [authorsList, setAuthorsList] = useState(authors);

  return (
    <div>
      {authorsList.map((author) => (
        <Tooltip
          styles={{ root: { width: "300px" } }}
          title={<AuthorTooltip author={author} />}
          color="white"
          trigger="click"
          key={author.id}
        >
          <Button
            style={{
              marginRight: "8px",
              backgroundColor: author.type === "advisor" ? "#f0f5fa" : "none",
            }}
            size="small"
            color="blue"
            variant="link"
          >
            {author.full_name}
          </Button>
        </Tooltip>
      ))}
      {authors_count > 10 && (
        <ShowMoreAPICall
          authors={authors}
          setAuthorsList={setAuthorsList}
          workID={workID}
        />
      )}
    </div>
  );
}
