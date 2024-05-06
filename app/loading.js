/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/**
 * Loading is a function component that displays a loading spinner and a loading message.
 *
 * @param {string} height - The height of the loading card. Defaults to "70vh".
 */
export default function Loading({ height = "80vh" }) {
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
        <p id={styles.loading_text}>Cargando información...</p>
      </div>
    </div>
  );
}
