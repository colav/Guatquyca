"use client";

/* Components */
import DocumentModal from "../DocumentModal/DocumentModal";
import OpenAccessStatus from "../../ServerSide/OpenAccessStatus/OpenAccessStatus";

/* Icons */
import { FileOutlined } from "@ant-design/icons";

/* UI Library Components */
import { App } from "antd";

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
export default function WorkTitleLink({ workTitle, workID, openAccessStatus }) {
  const TitleModal = () => {
    const { modal } = App.useApp();
    const showModal = (title, id, status) => {
      modal.warning({
        width: "1200px",
        title: [
          <FileOutlined key="0" />,
          " ",
          title,
          " ",
          status && <OpenAccessStatus status={status} key="1" />,
        ],
        icon: null,
        okText: "Cerrar",
        content: <DocumentModal documentID={id} />,
        destroyOnClose: true,
        maskClosable: true,
        onOk() {},
      });
    };

    return (
      <>
        <a
          type="link"
          onClick={() => showModal(workTitle, workID, openAccessStatus)}
        >
          {workTitle}
        </a>
        {openAccessStatus ? <OpenAccessStatus status={openAccessStatus} /> : ""}
      </>
    );
  };

  return (
    <App>
      <TitleModal />
    </App>
  );
}
