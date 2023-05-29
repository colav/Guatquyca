import React, { useState } from "react";

/* Components */
import ShowMoreButton from "./ShowMoreButton";
import ExternalProfiles from "./ExternalProfiles";

/* Utilities */
import { Link } from "react-router-dom";

/* UI Library Components */
import { Button, Tooltip } from "antd";

const AuthorsHorizontalList = ({ authors }) => {
  const [authorsQuantity, setAuthorsQuantity] = useState(10);
  const [showingAll, setShowingAll] = useState(false);

  const showContent = (author) => {
    return (
      <>
        <div>
          <div>
            <Link
              style={{ fontSize: 15, textDecoration: "underline" }}
              to={`/app/person?id=${author.id}`}
            >
              {author.full_name}
            </Link>
          </div>
          {author.affiliations.map((item) => {
            if (item.types[0]?.type === "group") {
              return (
                <div key={item.id}>
                  <Link
                    className="affiliation--link"
                    to={`/app/affiliations?type=group&id=${item.id}`}
                  >
                    • {item.name}
                  </Link>
                </div>
              );
            } else if (item.types[0]?.type === "department") {
              return (
                <div key={item.id}>
                  <Link
                    className="affiliation--link"
                    to={`/app/affiliations?type=department&id=${item.id}`}
                  >
                    • {item.name}
                  </Link>
                </div>
              );
            } else if (item.types[0]?.type === "faculty") {
              return (
                <div key={item.id}>
                  <Link
                    className="affiliation--link"
                    to={`/app/affiliations?type=faculty&id=${item.id}`}
                  >
                    • {item.name}
                  </Link>
                </div>
              );
            } else
              return (
                <div key={item.id}>
                  <Link
                    className="affiliation--link"
                    to={`/app/affiliations?type=institution&id=${item.id}`}
                  >
                    • {item.name}
                  </Link>
                </div>
              );
          })}
        </div>
        <div>
          <ExternalProfiles idsList={author.external_ids} />
        </div>
      </>
    );
  };

  return (
    <div>
      {authors.slice(0, authorsQuantity).map((author) => (
        <Tooltip
          title={() => showContent(author)}
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
};

export default AuthorsHorizontalList;
