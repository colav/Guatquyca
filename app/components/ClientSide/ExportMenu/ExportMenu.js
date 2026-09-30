"use client";

/* Components */
import FileFetcher from "../FileFetcher/FileFetcher";
import URLBuilder from "@/lib/utils/URLBuilder";

/* Hooks */
import { usePathname } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* Icons */
import {
  CodeOutlined,
  DownOutlined,
  FileExcelOutlined,
  FileOutlined,
} from "@ant-design/icons";

/* UI Library Components */
import { App, Button, Dropdown } from "antd";

/**
 * ExportMenu groups the API, CSV, and Excel actions into one compact control.
 *
 * @param {Object} searchParams - The query parameters used to build the export URLs.
 * @param {boolean} apiExpert - If true, links to the /apiExpert endpoint instead of /app.
 * @param {boolean} csv - If true, shows the CSV export action.
 * @param {boolean} xls - If true, shows the Excel export action.
 * @returns {JSX.Element} The export dropdown.
 */
function ExportMenuContent({ searchParams, apiExpert, csv, xls }) {
  const pathname = usePathname();
  const { modal } = App.useApp();

  const showFileModal = (fileType, fileExtension, title) => {
    modal.warning({
      title,
      content: (
        <FileFetcher
          pathname={pathname}
          queryParams={searchParams}
          fileType={fileType}
          fileExtension={fileExtension}
        />
      ),
      destroyOnClose: true,
      icon: null,
      okText: "Cancelar descarga",
      centered: true,
    });
  };

  const items = [
    {
      key: "api",
      label: "API (JSON)",
      icon: <CodeOutlined />,
      onClick: () => {
        window.open(
          `${process.env.NEXT_PUBLIC_CLIENT_API}${
            apiExpert ? "" : "/app"
          }${URLBuilder(pathname, searchParams)}`,
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    ...(csv
      ? [
          {
            key: "csv",
            label: "CSV",
            icon: <FileOutlined />,
            onClick: () => showFileModal("csv", "csv", "Exportar CSV"),
          },
        ]
      : []),
    ...(xls
      ? [
          {
            key: "excel",
            label: "Excel (.xlsx)",
            icon: <FileExcelOutlined />,
            onClick: () => showFileModal("excel", "xlsx", "Exportar Excel"),
          },
        ]
      : []),
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        size="small"
        icon={<FileOutlined id={styles.icon} />}
        aria-label="Opciones de exportación"
        id={styles.csv_button}
      >
        Exportar <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default function ExportMenu(props) {
  return (
    <App className={styles.fitContent}>
      <ExportMenuContent {...props} />
    </App>
  );
}
