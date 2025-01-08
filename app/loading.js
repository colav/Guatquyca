/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/**
 * Loading component displays a loading spinner with a customizable height and text.
 *
 * @param {string} [height="80vh"] - The height of the loading container, defaults to "80vh".
 * @param {string} [text="Cargando información..."] - The loading text to display, defaults to "Cargando información...".
 * @returns {JSX.Element} The Loading component.
 */
export default function Loading({
  height = "80vh",
  text = "Cargando información...",
}) {
  return (
    <div className={styles.state_card__container} style={{ height: height }}>
      <div>
        <div className={styles.rotate_center}>
          <Image
            src={"/media/logo_spinner.svg"}
            alt="Spinner Logo of ImpactU"
            width={50}
            height={50}
          />
        </div>
        <p id={styles.loading_text}>{text}</p>
      </div>
    </div>
  );
}
