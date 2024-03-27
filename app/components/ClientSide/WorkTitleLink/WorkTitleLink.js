"use client";

/* Components */
import DocumentModal from "../DocumentModal/DocumentModal";
import OpenAccessStatus from "../../ServerSide/OpenAccessStatus/OpenAccessStatus";

/* UI Library Components */
import { Modal } from "antd";

/**
 * WorkTitleLink is a component that displays a link with the work title.
 * When the link is clicked, it opens a modal with the document information.
 *
 * @param {string} workTitle - The title of the work.
 * @param {string} workID - The ID of the work.
 * @param {string} openAccessStatus - The open access status of the work.
 * @returns {JSX.Element} - The Title of a work as a Link that triggers a Modal component.
 */
export default function WorkTitleLink({ workTitle, workID, openAccessStatus }) {
  /**
   * docInfo is a function that opens a modal with the document information.
   *
   * @param {string} title - The title of the work.
   * @param {string} id - The ID of the work.
   * @param {string} status - The open access status of the work.
   */
  const docInfo = (title, id, status) => {
    Modal.warning({
      width: "1200px",
      title: [
        title,
        " ",
        status && <OpenAccessStatus status={status} key="0" />,
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
        onClick={() => docInfo(workTitle, workID, openAccessStatus)}
      >
        {workTitle}
      </a>
      {openAccessStatus ? <OpenAccessStatus status={openAccessStatus} /> : ""}
    </>
  );
}
