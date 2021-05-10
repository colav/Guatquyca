import React from "react";

/* UI Library Components */
const Tooltip = require("antd/lib/tooltip").default;

const AuthorsListOnModal = ({ authors }) => {
  return authors.map((author) =>
    author.corresponding ? (
      <Tooltip
        key={author.id}
        title={`Autor de correspondencia.
      Afiliación: ${author.affiliations[0].name}.`}
      >
        {" "}
        <span style={{ textDecoration: "underline" }}>{author.name}</span>
        {author !== authors[authors.length - 1] ? ", " : "."}
      </Tooltip>
    ) : (
      <Tooltip
        key={author.id}
        title={
          author.affiliations.length !== 0
            ? `Afiliación: ${author.affiliations[0].name}`
            : ""
        }
      >
        <span>{author.name}</span>
        {author !== authors[authors.length - 1] ? ", " : "."}
      </Tooltip>
    )
  );
};

export default AuthorsListOnModal;
