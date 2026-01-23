/* UI Library Components */
import { Modal, Typography, Divider, Space, Button, Alert } from "antd";

/* UI Library Subcomponents */
const { Title, Text } = Typography;

/**
 * Triggers a download of a PDF file from a base64-encoded string.
 *
 * @param {string} base64 - Base64-encoded PDF data.
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
 * ValidationErrorModal component displays a modal with validation errors and download options.
 *
 * @param {boolean} open - Whether the modal is visible.
 * @param {Object} result - Validation result object containing error details and base64 PDF.
 * @param {number|string} result.errores - Number or description of errors found.
 * @param {number|string} result.duplicados - Number or description of duplicate records found.
 * @param {string} result.pdf_base64 - Base64-encoded PDF report.
 * @param {function} onClose - Callback fired when the modal is closed.
 * @returns {JSX.Element|null} Rendered modal or null if no result.
 */
export default function ValidationErrorModal({ open, result, onClose }) {
  if (!result) return null;

  return (
    <Modal open={open} footer={null} centered width={560} onCancel={onClose}>
      <Title level={5}>Validación de datos rechazada</Title>

      <Text type="secondary">
        El archivo fue recibido correctamente, pero se identificaron
        inconsistencias que impiden continuar con la integración.
      </Text>

      <Divider />

      <Space direction="vertical">
        <Text>
          <strong>Errores encontrados:</strong> {result.errores}
        </Text>
        <Text>
          <strong>Registros duplicados:</strong> {result.duplicados}
        </Text>
      </Space>

      <Divider />

      <Alert
        type="info"
        showIcon
        message="Resultados enviados por correo institucional"
        description="Se envió un correo con el reporte PDF y el archivo Excel con observaciones. Recuerde eliminar las columnas adicionales antes de volver a subir el archivo."
      />

      <Divider />

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={() => downloadPdf(result.pdf_base64)}>
          Descargar reporte PDF
        </Button>
        <Button type="primary" onClick={onClose}>
          Entendido
        </Button>
      </Space>
    </Modal>
  );
}
