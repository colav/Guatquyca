"use client";

/* UI Library Components */
import { Result } from "antd";

/* Styles */
import styles from "./styles.module.css";

/**
 * Error is a client-side function component that displays an error message.
 *
 * @param {string} height - The height of the error message container. Defaults to "70vh".
 * @returns {JSX.Element} A div containing a Result component displaying the error message.
 */
export default function Error({ height = "70vh" }) {
  return (
    <div className={styles.state_card__container} style={{ height: height }}>
      <div>
        <Result
          status="warning"
          title="Oops!"
          subTitle={
            <>
              <b>Lo sentimos, algo salió mal con tu solicitud.</b>
              <p>Intenta nuevamente</p>
            </>
          }
        />
      </div>
    </div>
  );
}
