import React, { useState } from "react";
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";
const Divider = require("antd/lib/divider").default;
const Button = require("antd/lib/button").default;

const AuthorsHorizontalList = (authorsList, setCurrentURL) => {
  const [authorsQuantity, setAuthorsQuantity] = useState(10);
  const [disabled, setDisabled] = useState(false);

  const onClick = () => {
    setAuthorsQuantity(authorsList.length);
    setDisabled(true);
  };

  return (
    <div>
      {authorsList.slice(0, authorsQuantity).map((author) => (
        <Link
          key={author._id}
          to={`/app/authors?${APIKEY}&${DATA}&id=${author._id}`}
          onClick={() =>
            setCurrentURL(`/app/authors?${APIKEY}&${DATA}&id=${author._id}`)
          }
        >
          <Divider type="vertical" />
          {author.full_name}
        </Link>
      ))}
      <Divider type="vertical" />
      {authorsList.length > 10 ? (
        <Button onClick={onClick} type="dashed" disabled={disabled}>
          Mostrar todos ({authorsList.length})
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default AuthorsHorizontalList;
