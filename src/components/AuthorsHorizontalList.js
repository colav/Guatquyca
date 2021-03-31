import React from "react";
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";
const Divider = require("antd/lib/divider").default;

const AuthorsHorizontalList = (authorsList, setCurrentURL) => {
  return (
    <div>
      {authorsList.map((author) => (
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
    </div>
  );
};

export default AuthorsHorizontalList;

/* <Button type="link" key={author._id}>
          {author.full_name}
        </Button> */
