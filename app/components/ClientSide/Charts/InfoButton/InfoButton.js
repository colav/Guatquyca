/* Styles */
import styles from "./styles.module.css";

/*  UI Library Components */
import { App, Button, Tooltip } from "antd";

export default function InfoButton({ label, text }) {
  const ModalSubPage = () => {
    const { modal } = App.useApp();
    const showModal = () => {
      modal.info({
        icon: null,
        title: label,
        content: text,
        destroyOnClose: true,
        okText: "Cerrar",
        centered: true,
        maskClosable: true,
        width: "800px",
      });
    };

    return (
      <Tooltip color="white" title="Información">
        <Button
          id={styles.info_button}
          type="primary"
          size="small"
          shape="circle"
          onClick={showModal}
        >
          <i className={styles.i}>i</i>
        </Button>
      </Tooltip>
    );
  };

  return (
    <App>
      <ModalSubPage />
    </App>
  );
}
