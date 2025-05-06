"use client";

/* Components */
import DocumentModal from "../DocumentModal/DocumentModal";
import OpenAccessStatus from "../../ServerSide/OpenAccessStatus/OpenAccessStatus";

/* Icons */
import { FileOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { App, Row } from "antd";

/* Utils */
import he from "he";
import MathJax from "@/lib/Utils/mathjax";
import RankingTag from "../../ServerSide/RankingTag/RankingTag";

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
  ranking,
}) {
  const decodedWorkTitle = he.decode(workTitle);

  const TitleModal = () => {
    const { modal } = App.useApp();
    const showModal = (title, id, status) => {
      modal.warning({
        width: "1500px",
        title: (
          <Row>
            <MathJax />
            <span className={styles.margin_right}>
              <FileOutlined />
            </span>{" "}
            <span className={styles.margin_right}>{decodedWorkTitle}</span>
            {status && <OpenAccessStatus status={status} />}
            <RankingTag ranking={ranking} />
          </Row>
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
      <Row className={styles.title_container}>
        <a
          id={styles.title_link}
          type="link"
          onClick={() => showModal(decodedWorkTitle, workID, openAccessStatus)}
        >
          {decodedWorkTitle}
        </a>
        {openAccessStatus && <OpenAccessStatus status={openAccessStatus} />}
        <RankingTag ranking={ranking} />
      </Row>
    );
  };

  return (
    <App>
      <TitleModal />
    </App>
  );
}
