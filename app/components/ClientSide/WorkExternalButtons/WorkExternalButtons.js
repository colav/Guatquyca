"use client";

/* Icons */
import {
  CopyOutlined,
  DesktopOutlined,
  ExportOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

/* UI Library Components */
import { App, Button, Space } from "antd";

export default function WorkExternalButtons({
  open_access,
  documentID,
  doi,
  bibtex,
}) {
  const ModalSubPage = () => {
    const { modal } = App.useApp();
    const showModal = () => {
      modal.info({
        title: "Citar este producto (BibTeX)",
        content: (
          <pre
            style={{ whiteSpace: "pre", overflowX: "auto", maxWidth: "100%" }}
          >
            {bibtex}
          </pre>
        ),
        icon: null,
        destroyOnClose: true,
        okText: "Cerrar",
        centered: true,
        maskClosable: true,
        width: "800px",
        footer: (_, { OkBtn }) => (
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(bibtex);
              }}
            >
              Copiar al portapapeles
            </Button>
            <OkBtn />
          </Space>
        ),
      });
    };
    return (
      <Button
        type="default"
        size="small"
        icon={<ExportOutlined />}
        onClick={showModal}
        href={null}
      >
        BibTeX
      </Button>
    );
  };

  return (
    <div>
      <Space>
        {open_access.url && (
          <Button
            type="default"
            size="small"
            icon={<FilePdfOutlined />}
            href={open_access.url}
            target="_blank"
          >
            PDF
          </Button>
        )}
        <Button
          type="default"
          size="small"
          icon={<FileTextOutlined />}
          href={`${process.env.NEXT_PUBLIC_CLIENT_API}/app/work/${documentID}`}
          target="_blank"
        >
          JSON
        </Button>
        {doi && (
          <Button
            type="default"
            size="small"
            icon={<DesktopOutlined />}
            href={doi}
            target="_blank"
          >
            HTML
          </Button>
        )}
        {bibtex && (
          <App>
            <ModalSubPage />
          </App>
        )}
      </Space>
    </div>
  );
}
