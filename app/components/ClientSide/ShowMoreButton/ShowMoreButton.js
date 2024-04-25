"use client";

/* UI Library Components */
import { Button } from "antd";

/**
 * ShowMoreButton is a function component that displays a button to show more or less authors.
 *
 * @param {boolean} showingAll - A state variable indicating whether all authors are being shown.
 * @param {Function} setAuthorsQuantity - A setter function for the 'authorsQuantity' state variable.
 * @param {Function} setShowingAll - A setter function for the 'showingAll' state variable.
 * @param {number} length - The total number of authors.
 * @returns {JSX.Element} A button that shows more authors when clicked, or less authors if all are currently being shown.
 */
export default function ShowMoreButton({
  showingAll,
  setAuthorsQuantity,
  setShowingAll,
  length,
}) {
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
}
