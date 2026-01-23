/* Styles */
import styles from "../styles.module.css";

/* UI Library Subcomponents */
import { Typography } from "antd";

/* Utils */
import { VALIDATION_STATE } from "@/lib/utils/validationState";

const { Text } = Typography;

export const VALIDATION_UI_CONFIG = {
  [VALIDATION_STATE.REJECTED]: {
    title: "Validación de datos rechazada",
    message: (
      <Text type="secondary">
        El archivo fue recibido correctamente, pero se identificaron
        inconsistencias que impiden continuar con la integración de tus datos
        institucionales a <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </Text>
    ),
    emailMessage:
      "Se envió un correo con el reporte PDF y el archivo Excel con observaciones. Recuerde eliminar las columnas adicionales antes de volver a subir el archivo.",
    summaryTone: "error",
  },

  [VALIDATION_STATE.ACCEPTED_WITH_OBSERVATIONS]: {
    title: "Archivo aceptado con advertencias",
    message: (
      <Text type="secondary">
        El archivo fue recibido y <strong>aceptado</strong>. Aunque se
        identificaron advertencias o registros duplicados, los datos continuarán
        con el proceso de integración en <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </Text>
    ),
    emailMessage:
      "Se envió un correo con el reporte de calidad de datos (PDF), donde se detallan las advertencias identificadas. Los datos ingresarán al proceso de integración y se reflejarán en la próxima actualización.",
    summaryTone: "warning",
  },

  [VALIDATION_STATE.ACCEPTED_CLEAN]: {
    title: "Archivo aceptado correctamente",
    message: (
      <Text type="secondary">
        El archivo superó exitosamente todas las validaciones. No se encontraron
        errores ni advertencias y los datos ingresarán al proceso de integración
        en <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </Text>
    ),
    emailMessage:
      "Se envió un correo confirmando que el archivo fue aceptado sin observaciones. Los datos ingresarán al proceso de integración y se reflejarán en la próxima actualización.",
    summaryTone: "success",
  },
};
