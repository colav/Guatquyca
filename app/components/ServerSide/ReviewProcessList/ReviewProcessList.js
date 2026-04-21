import React from "react";

/* Icons */
import { CheckSquareOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

const reviewProcessTranslations = {
  "Anonymous peer review": "Revisión por pares anónima",
  "Collaborative Review": "Revisión colaborativa",
  "Committee review": "Revisión por comité",
  "Double Blind and peer-reviewed": "Revisión por pares doble ciego",
  "Double anonymous peer review": "Revisión por pares doble anónima",
  "Editorial review": "Revisión editorial",
  "Open Peer Commentary": "Comentario académico abierto",
  "Open peer review": "Revisión por pares abierta",
  "Partial Double-Blind Peer Review": "Revisión por pares doble ciego parcial",
  "Peer review": "Revisión por pares",
  "Post-publication peer review":
    "Revisión por pares posterior a la publicación",
  "Single blinded peer review": "Revisión por pares simple ciego",
  "Single-blind review process": "Proceso de revisión simple ciego",
  "Transparent Peer Review": "Revisión por pares transparente",
  "Transparent peer review": "Revisión por pares transparente",
  "Triple blind peer review": "Revisión por pares triple ciego",
  "Triple-blind peer review": "Revisión por pares triple ciego",
  "single blind peer review": "Revisión por pares simple ciego",
};

/**
 * ReviewProcessList is a server-side functional component that displays a list of review processes in Spanish, separated by a pipeline.
 *
 * @component
 * @param {Array<string>} review_process - Array of review process types (in English) to be translated and displayed.
 * @returns {JSX.Element} The rendered list of review processes.
 */
export default function ReviewProcessList({ review_process }) {
  return (
    <div>
      <CheckSquareOutlined /> Procesos de revisión:{" "}
      <span className={styles.text}>
        {review_process.map((item, index) => (
          <React.Fragment key={index}>
            {reviewProcessTranslations[item]}
            {index < review_process.length - 1 && (
              <span className={styles.pipeline}> | </span>
            )}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
}
