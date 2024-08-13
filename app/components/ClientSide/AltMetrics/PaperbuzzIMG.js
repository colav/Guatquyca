/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/**
 * PaperbuzzSVG is a client-side function component that renders a Paperbuzz score badge.
 *
 * @param {number} score - The Paperbuzz score to display.
 * @returns {JSX.Element} The rendered component.
 */
export default function PaperbuzzIMG({ score }) {
  return (
    <div className={styles.container}>
      <Image
        src="/media/PaperBuzzBadge.png"
        alt={`Paperbuzz Score: ${score}`}
        width={102}
        height={18}
      />
      <div className={styles.numberContainer}>
        <span className={styles.score}>{score}</span>
      </div>
    </div>
  );
}
