import React from "react";

/* UI Library Components */
const Button = require("antd/lib/button").default;

const ShowMoreButton = ({
  showingAll,
  setAuthorsQuantity,
  setShowingAll,
  length,
}) => {
  const onClick = () => {
    if (showingAll === false) {
      setAuthorsQuantity(length);
    } else {
      setAuthorsQuantity(10);
    }
    setShowingAll(!showingAll);
  };

  return (
    <Button onClick={onClick} type="dashed">
      {showingAll ? "Mostrar menos" : `Mostrar todos ${length}`}
    </Button>
  );
};

export default ShowMoreButton;
