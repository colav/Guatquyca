/* UI Library Components */
import { Modal, Typography } from "antd";

/* UI Library Subcomponents */
const { Title, Text } = Typography;

/* Components */
import Spinner from "@/app/components/ClientSide/Spinner/Spinner";

/**
 * UploadingModal component displays a modal with a spinner while a file is being processed.
 *
 * @param {boolean} open - Whether the modal is visible.
 * @returns {JSX.Element} Rendered uploading modal.
 */
export default function UploadingModal({ open }) {
  return (
    <Modal open={open} footer={null} closable={false} centered>
      <div style={{ textAlign: "center", padding: 24 }}>
        <Spinner />

        <Title level={5} style={{ marginTop: 16 }}>
          Procesando archivo
        </Title>

        <Text type="secondary">
          Su archivo se está cargando y validando. Este proceso puede tardar
          algunos segundos.
        </Text>
      </div>
    </Modal>
  );
}
