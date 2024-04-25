/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * ExternalURL is a function component that displays a list of external URLs.
 *
 * @param {Object[]} URLList - The list of URLs to display.
 * @returns {JSX.Element} A fragment that contains a heading and a list of external URLs.
 */
export default function ExternalURL({ URLList }) {
  /**
   * renderedName is a function that takes a name and returns a formatted name.
   *
   * @param {string} name - The name to format.
   * @returns {string} The formatted name.
   */
  const renderedName = (name) => {
    if (name === "site") return "Sitio Web";
    if (name === "wikipedia") return "Wikipedia";
    return name;
  };

  return (
    <>
      <h2 className={styles.bold}>
        <LinkOutlined /> Páginas externas:
      </h2>
      {URLList?.length ? (
        URLList.map(
          (item) =>
            item.source !== "mag" && (
              <div key={item.url || item.id}>
                <a href={item.url || item.id} target="_blank" rel="noreferrer">
                  {renderedName(item.source)}
                </a>
              </div>
            )
        )
      ) : (
        <p className={styles.noData}>No disponible</p>
      )}
    </>
  );
}
