import React, { useState } from "react";
import history from "../history";
import { Link, Router } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";
const Button = require("antd/lib/button").default;
const Divider = require("antd/lib/divider").default;
const notification = require("antd/lib/notification").default;

const AuthorsHorizontalList = (authorsList, setCurrentURL) => {
  const [authorsQuantity, setAuthorsQuantity] = useState(10);
  const [disabled, setDisabled] = useState(false);

  const onClick = () => {
    setAuthorsQuantity(authorsList.length);
    setDisabled(true);
  };

  const URL = (type, id) => {
    if (type === "faculty") {
      return `/app/faculties?${APIKEY}&${DATA}&id=${id}`;
    }
    return `/app/${type}s?${APIKEY}&${DATA}&id=${id}`;
  };

  const openNotification = (author) => {
    notification.open({
      message: (
        <Router history={history}>
          <Link
            to={`/app/authors?${APIKEY}&${DATA}&id=${author._id}`}
            onClick={() =>
              setCurrentURL(`/app/authors?${APIKEY}&${DATA}&id=${author._id}`)
            }
          >
            {author.full_name}
          </Link>
          <br />
          <Link
            to={`/app/institutions?${APIKEY}&${DATA}&id=${author.affiliations[0]._id}`}
            onClick={() =>
              setCurrentURL(
                `/app/institutions?${APIKEY}&${DATA}&id=${author.affiliations[0]._id}`
              )
            }
          >
            {author.affiliations[0].name}
          </Link>
        </Router>
      ),
      description: author.affiliations[0].branches.map((item) => (
        <Router key={item._id} history={history}>
          <Link
            to={URL(item.type, item._id)}
            onClick={() => setCurrentURL(URL(item.type, item._id))}
          >
            {item.name}
          </Link>
          <br />
        </Router>
      )),
      onClick: () => {
        notification.destroy(author._id);
      },
    });
  };

  return (
    <div>
      {authorsList.slice(0, authorsQuantity).map((author) => (
        <Button
          key={author._id}
          type="link"
          onClick={() => openNotification(author)}
        >
          {author.full_name}
        </Button>
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
