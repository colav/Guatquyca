"use client";

/* Next */
import { useRouter, useParams } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Menu } from "antd";

/**
 * TopMenu is a client-side function component that displays a horizontal menu with selectable items.
 * If `person` is true, the menu will display items related to a person's activities (Investigación, Extensión, Cooperación).
 * If `person` is false, the menu will display (Afiliaciones, Investigación, Extensión, Cooperación).
 * When a menu item is selected, the component navigates to a new path based on the selected item's key.
 *
 * @param {boolean} person - A boolean indicating whether the menu items should be related to a person's activities or an affiliation's activities.
 * @param {string} currentTab - The key of the currently selected menu item.
 *
 * @returns {JSX.Element} A Menu component from Ant Design library that contains selectable items.
 */
export default function TopMenu({ person = false, currentTab }) {
  const router = useRouter();
  const { ID, entity } = useParams();

  const items = person
    ? [
        { label: "Investigación", key: "research" },
        { label: "Extensión", key: "extension", disabled: true },
        { label: "Cooperación", key: "cooperation", disabled: true },
      ]
    : [
        { label: "Afiliaciones", key: "affiliations" },
        { label: "Investigación", key: "research" },
        { label: "Extensión", key: "extension", disabled: true },
        { label: "Cooperación", key: "cooperation", disabled: true },
      ];

  const defaultTab = {
    cooperation: "agreements",
    extension: "entrepreneurship",
    research: "products",
  };

  /**
   * onSelect is a function that is called when a menu item is selected.
   * It receives an object with the selected item's key.
   * It then navigates to a new path based on the selected item's key.
   *
   * @param {Object} key - An object that contains the selected item's key.
   */
  const onSelect = ({ key }) => {
    const path = person
      ? `/person/${ID}/${key}/${defaultTab[key]}`
      : `/affiliation/${entity}/${ID}/${key}${
          defaultTab[key] ? "/" + defaultTab[key] : ""
        }`;
    router.push(path);
  };

  return (
    <div className={styles.topMenu_container}>
      <Menu
        mode="horizontal"
        className={styles.topMenu_tabs}
        selectedKeys={[currentTab]}
        items={items}
        onSelect={onSelect}
      />
    </div>
  );
}
