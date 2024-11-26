"use client";

/* Components */
import CSVFetcher from "../CSVFetcher/CSVFetcher";

/* Hooks */
import { usePathname } from "next/navigation";

/* Icons */
import { FileExcelOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { App, Button, Tooltip } from "antd";

/**
 * `CSVButton` is a client-side functional component.
 *
 * This component renders a button that, when clicked, opens a modal with a warning message and starts fetching
 * a CSV file. The modal displays a spinner and the text "Exportando CSV" while the CSV file
 * is being fetched. Once the fetch is complete, the CSV file is automatically downloaded to the user's device.
 *
 * The component uses the `App` context to access the `modal` object, which is used to display the modal.
 * The `CSVFetcher` component is used to fetch the CSV file and handle the download.
 *
 * @param {Object} searchParams - The query parameters used to build the API URL.
 * @returns {JSX.Element} The CSVButton component.
 */
export default function CSVButton({ searchParams }) {
  const pathname = usePathname();

  const ModalSubPage = () => {
    const { modal } = App.useApp();
    const showModal = () => {
      modal.warning({
        title: "Exportar CSV",
        content: <CSVFetcher pathname={pathname} queryParams={searchParams} />,
        destroyOnClose: true,
        icon: null,
        okText: "Cancelar descarga",
        centered: true,
      });
    };

    return (
      <Tooltip title="Descargar CSV">
        <Button
          type="primary"
          icon={<FileExcelOutlined id={styles.icon} />}
          size="small"
          onClick={showModal}
          id={styles.csv_button}
        >
          CSV
        </Button>
      </Tooltip>
    );
  };

  return (
    <App className={styles.fitContent}>
      <ModalSubPage />
    </App>
  );
}
