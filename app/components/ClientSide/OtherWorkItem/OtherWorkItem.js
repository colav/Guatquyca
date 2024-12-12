/* Components */
import AuthorsList from "../AuthorsHorizontalList/AuthorsList";
import InvisibleContainer from "./InvisibleContainer";

/* Constants */
import { PRODUCT_TYPES } from "@/lib/constants";

/* Icons */
import { TeamOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import Ribbon from "antd/lib/badge/Ribbon";

export default function OtherWorkItem({ item }) {
  const ribbonStyles = {
    boxShadow:
      "8px -8px 6px rgba(255, 240, 240, 0.3)," +
      "2px 2px 8px rgba(255, 116, 69, 0.3)," +
      "5px 8px 16px rgba(255, 106, 69, 0.1)," +
      "4px 4px 3px rgba(255, 56, 69, 0.15)",
    width: "110px",
    textWrap: "wrap",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.1",
    display: item.product_types?.length > 0 ? "block" : "none",
  };

  return (
    <>
      <InvisibleContainer
        source={item.product_types?.length > 0 && item.product_types[0].source}
      />
      <Ribbon
        text={
          item.product_types?.length > 0
            ? PRODUCT_TYPES[item.product_types[0]?.name] ||
              item.product_types[0]?.name
            : ""
        }
        color="#ff6a45"
        placement="start"
        style={ribbonStyles}
        className={styles.ribbon}
      >
        <li key={item.id} className={styles.otherWork_item}>
          <div className={styles.otherWork_container}>
            <div className={styles.otherWork_title}>
              <b>{item.title}</b>
            </div>
            <TeamOutlined className={styles.gray} /> Autores:{" "}
            <AuthorsList
              authors={item.authors}
              authors_count={item.authors_count}
              workID={item.id}
            />
          </div>
        </li>
      </Ribbon>
    </>
  );
}
