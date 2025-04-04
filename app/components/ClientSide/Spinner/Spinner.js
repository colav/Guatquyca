/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

export default function Spinner() {
  return (
    <Image
      src={"/media/logo_spinner.svg"}
      alt="Spinner Logo of ImpactU"
      width={30}
      height={30}
      className={styles.rotate_center}
    />
  );
}
