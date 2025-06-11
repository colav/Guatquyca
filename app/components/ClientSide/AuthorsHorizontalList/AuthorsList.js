"use client";

/* Hooks */
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";

/* Components */
import AuthorTooltip from "@/app/components/ServerSide/AuthorTooltip/AuthorTooltip";
import ShowMoreAPICall from "../ShowMoreButton/ShowMoreAPICall";

/* UI Library Components */
import { Button, Tooltip } from "antd";

/* Constants */
const AUTHOR_LABELS = {
  advisor: "Asesor",
  "co-advisor": "Coasesor",
};

/**
 * AuthorsList Component
 *
 * Renders a horizontal list of authors with tooltips showing their affiliations.
 * Highlights authors who are advisors or co-advisors, and visually marks those affiliated
 * with the current institution, group, faculty, or department (based on the URL).
 * If there are more authors than initially loaded, a "Show More" button is displayed to fetch additional authors.
 *
 * URL parsing:
 * - Extracts the entity ID from the pathname for institution, group, faculty, or department pages.
 * - Uses this ID to highlight authors affiliated with the current entity.
 *
 * @param {Array} authors - The initial list of author objects to display.
 * @param {number} authors_count - The total number of authors for the work.
 * @param {string} workID - The ID of the work to fetch additional authors for.
 *
 * @returns {JSX.Element} The rendered list of authors with tooltips and a "Show More" button if applicable.
 */
export default function AuthorsList({ authors, authors_count, workID }) {
  const [authorsList, setAuthorsList] = useState(authors);
  const pathname = usePathname();

  const institutionId = useMemo(() => {
    const match = pathname.match(
      /\/(institution|group|faculty|department)\/([^/]+)\/research/
    );
    return match?.[2] || null;
  }, [pathname]);

  return (
    <div>
      {authorsList.map((author) => {
        const isAdvisor =
          author.type === "advisor" || author.type === "co-advisor";
        const isInstitutionAffiliated = author.affiliations?.some(
          (aff) => aff.id === institutionId
        );

        return (
          <Tooltip
            key={author.id}
            title={<AuthorTooltip author={author} />}
            trigger="click"
            color="white"
            styles={{ root: { width: "300px" } }}
          >
            <Button
              style={{
                margin: "0 8px 4px 0",
                maxHeight: 20,
                backgroundColor: isAdvisor ? "#f0f5fa" : undefined,
                border: isInstitutionAffiliated
                  ? "1px dashed rgb(131, 179, 189)"
                  : undefined,
              }}
              size="small"
              type="link"
              aria-label={`Autor: ${author.full_name}`}
            >
              {author.full_name}
              {AUTHOR_LABELS[author.type] && (
                <span style={{ fontWeight: 500, fontSize: 13, color: "#888" }}>
                  {" "}
                  ({AUTHOR_LABELS[author.type]})
                </span>
              )}
            </Button>
          </Tooltip>
        );
      })}

      {authors_count > authorsList.length && (
        <ShowMoreAPICall
          authors={authors}
          setAuthorsList={setAuthorsList}
          workID={workID}
        />
      )}
    </div>
  );
}
