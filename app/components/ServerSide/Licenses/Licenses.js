/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Space } from "antd";

/**
 * Licenses is a server-side functional component that displays a list of license badges with links for each license type provided.
 *
 * @component
 * @param {Array<{type: string, url: string}>} licenses - Array of license objects, each containing a type and a URL for the license.
 * @returns {JSX.Element} The rendered list of license badges with links.
 */
export default function Licenses({ licenses }) {
  const licenseImageMap = {
    "CC BY":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png",
    "CC BY-NC":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc.png",
    "CC BY-NC-ND":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-nd.png",
    "CC BY-NC-SA":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png",
    "CC BY-ND":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nd.png",
    "CC BY-SA":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png",
    CC0: "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/cc-zero.png",
    "Public domain":
      "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/publicdomain.png",
    "Publisher's own license": "/media/PublishersOwnLicense.png",
  };

  return (
    <div className={styles.licenses_container}>
      <Space size={[10, 10]} wrap>
        {licenses.map((license) => {
          return (
            <a
              key={license.type}
              href={license.url}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={styles.license_img}
                src={licenseImageMap[license.type]}
                alt={license.type}
                width={88}
                height={31}
              />
            </a>
          );
        })}
      </Space>
    </div>
  );
}
