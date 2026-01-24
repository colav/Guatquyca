/* UI */
import { Modal, Typography, Divider, Space, Button, Alert } from "antd";

/* Utils */
import { resolveValidationState } from "@/lib/utils/validationState";

/* UI config */
import { VALIDATION_UI_CONFIG } from "./validationConfig";

const { Title, Text } = Typography;

/**
 * Triggers a download of a PDF file from a base64-encoded string.
 */
function downloadPdf(base64) {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  const blob = new Blob([array], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "reporte_validacion_impactu.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * ValidationResultModal displays the result of a file validation process in a modal dialog.
 *
 * @param {boolean} open - Whether the modal is visible.
 * @param {Object} result - Validation result object containing status and report data.
 * @param {boolean} result.success - Whether the validation was successful.
 * @param {number} [result.errors=0] - Number of errors found in the file.
 * @param {number} [result.warnings=0] - Number of warnings found in the file.
 * @param {number} [result.duplicates=0] - Number of duplicate records found in the file.
 * @param {string} [result.report_pdf_base64] - Base64-encoded PDF report (optional).
 * @param {string} [result.file_msg] - Optional message about the file.
 * @param {function} onClose - Callback fired when the modal is closed.
 * @returns {JSX.Element|null} Rendered modal or null if no result.
 */
export default function ValidationResultModal({ open, result, onClose }) {
  if (!result) return null;

  const {
    success,
    errores = 0,
    warnings = 0,
    duplicados = 0,
    pdf_base64,
    file_msg,
  } = result;

  const state = resolveValidationState({
    success,
    warnings,
    duplicados,
  });

  const config = VALIDATION_UI_CONFIG[state];

  return (
    <Modal open={open} footer={null} centered width={560} onCancel={onClose}>
      <Title level={5}>{config.title}</Title>

      {config.message}

      <Divider />

      <Space direction="vertical">
        <Text>
          <strong>Errores encontrados:</strong> {errors}
        </Text>
        <Text>
          <strong>Registros duplicados:</strong> {duplicates}
        </Text>
        <Text>
          <strong>Advertencias encontradas:</strong> {warnings}
        </Text>
      </Space>

      <Divider />

      <Alert
        type="info"
        showIcon
        message="Resultados enviados por correo institucional"
        description={config.emailMessage}
      />

      {file_msg && (
        <>
          <Divider />
          <Alert type="success" showIcon message={file_msg} />
        </>
      )}

      <Divider />

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        {report_pdf_base64 && (
          <Button onClick={() => downloadPdf(report_pdf_base64)}>
            Descargar reporte PDF
          </Button>
        )}
        <Button type="primary" onClick={onClose}>
          Entendido
        </Button>
      </Space>
    </Modal>
  );
}
