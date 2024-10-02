"use client";

import { useState } from "react";

/* Components */
import AuthorsAffiliationsTooltip from "@/app/components/ServerSide/AuthorsAffiliationsTooltip/AuthorsAffiliationsTooltip";
import ShowMoreAPICall from "../ShowMoreButton/ShowMoreAPICall";

/* UI Library Components */
import { Button, Tooltip } from "antd";

/**
 * AuthorsListOnList Component
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
export default function AuthorsListOnList({ authors, authors_count, workID }) {
  const [authorsList, setAuthorsList] = useState(authors);

  return (
    <div>
      {authorsList.map((author) => (
        <Tooltip
          overlayStyle={{ width: "300px" }}
          title={
            author.id ? (
              <AuthorsAffiliationsTooltip author={author} />
            ) : (
              <div style={{ color: "black" }}>
                Este autor no tiene información adicional.
              </div>
            )
          }
          color="white"
          trigger="click"
          key={author.id}
        >
          <Button type="link">{author.full_name}</Button>
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
