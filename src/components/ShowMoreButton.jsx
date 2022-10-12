import React from 'react';

/* UI Library Components */
import { Button } from 'antd';

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
      {showingAll ? 'Mostrar menos' : `Mostrar todos ${length}`}
    </Button>
  );
};

export default ShowMoreButton;
