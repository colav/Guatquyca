"use client";

/* Components */
import DocumentModal from "../DocumentModal/DocumentModal";
import OpenAccessStatus from "../../ServerSide/OpenAccessStatus/OpenAccessStatus";

/* Icons */
import { FileOutlined, FileTextOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { App } from "antd";

/* Utils */
import he from "he";
import MathJax from "@/lib/Utils/mathjax";

/**
 * WorkTitleLink is a client-side function component that displays a link with the title of a work.
 * When the link is clicked, a modal is shown with information about the work.
 *
 * @param {string} workTitle - The title of the work.
 * @param {string} workID - The ID of the work.
 * @param {string} openAccessStatus - The open access status of the work.
 *
 * @returns {JSX.Element} An App component containing a TitleModal component.
 * The TitleModal component is a link with the title of the work.
 * When the link is clicked, a modal is shown with information about the work.
 */
export default function WorkTitleLink({
  workTitle,
  workID,
  openAccessStatus,
  doi,
}) {
  const decodedWorkTitle = he.decode(workTitle);

  const TitleModal = () => {
    const { modal } = App.useApp();
    const showModal = (title, id, status) => {
      modal.warning({
        width: "1500px",
        title: (
          <div>
            <MathJax />
            <FileOutlined /> {decodedWorkTitle}
            {status && <OpenAccessStatus status={status} />}
          </div>
        ),
        zIndex: 199,
        icon: null,
        okText: "Cerrar",
        content: <DocumentModal documentID={id} />,
        destroyOnClose: true,
        maskClosable: true,
        onOk() {},
      });
    };

    return (
      <div className={styles.title_container}>
        <a
          type="link"
          onClick={() => showModal(decodedWorkTitle, workID, openAccessStatus)}
        >
          {decodedWorkTitle}
        </a>
        {openAccessStatus && <OpenAccessStatus status={openAccessStatus} />}
      </div>
    );
  };

  return (
    <App>
      <TitleModal />
    </App>
  );
}
