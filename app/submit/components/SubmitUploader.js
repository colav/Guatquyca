/* Icons */
import { InboxOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Card, Upload, Button } from "antd";

const { Dragger } = Upload;

/**
 * SubmitUploader component for uploading and validating institutional files.
 *
 * @param {string[]} extensions - Allowed file extensions (e.g., ['.rar', '.xlsx']).
 * @param {File|null} file - The currently selected file.
 * @param {function} onFileChange - Callback fired when the file changes. Receives the new file or null.
 * @param {function} onSubmit - Callback fired when the user clicks the submit button.
 * @param {function} onError - Callback fired when there's a validation error. Receives the error message.
 * @param {boolean} disabled - Whether the submit button is disabled.
 * @returns {JSX.Element} Rendered uploader UI.
 */
export default function SubmitUploader({
  extensions,
  file,
  onFileChange,
  onSubmit,
  onError,
  disabled,
}) {
  const beforeUpload = (file) => {
    const isValid = extensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (!isValid) {
      onError(
        `Formato de archivo no válido. Se permiten: ${extensions.join(", ")}`,
      );
      return Upload.LIST_IGNORE;
    }

    onError(null);
    onFileChange(file);
    return false;
  };

  return (
    <Card style={{ marginTop: 16 }}>
      <Dragger
        beforeUpload={beforeUpload}
        fileList={file ? [file] : []}
        onRemove={() => onFileChange(null)}
        multiple={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Arrastre el archivo aquí o haga clic para seleccionarlo
        </p>
        <p className="ant-upload-hint">
          Formatos permitidos: {extensions.join(", ")}
        </p>
      </Dragger>

      <Button
        type="primary"
        block
        style={{ marginTop: 16 }}
        disabled={disabled}
        onClick={onSubmit}
      >
        Validar y enviar archivo
      </Button>
    </Card>
  );
}
