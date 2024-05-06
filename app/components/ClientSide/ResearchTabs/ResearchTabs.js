"use client";

/* Next */
import { useRouter, useParams } from "next/navigation";

/* UI Library Components */
import { Tabs } from "antd";

/**
 * ResearchTabs is a client-side function component that displays a set of tabs for navigating between different research-related pages.
 * When a tab is selected, the component navigates to a new path based on the selected tab's key.
 *
 * @param {string} props.activeTab - The key of the currently active tab.
 *
 * @returns {JSX.Element} A Tabs component from Ant Design library that contains a set of tabs for navigating between different research-related pages.
 */
export default function ResearchTabs({ activeTab }) {
  const router = useRouter();
  const { ID } = useParams();

  const items = [
    {
      label: "Productos",
      key: "products",
    },
    {
      label: "Proyectos",
      key: "projects",
      disabled: true,
    },
    {
      label: "Noticias",
      key: "news",
      disabled: true,
    },
  ];

  /**
   * handleTabChange is a function that is called when a tab is selected.
   * It receives the selected tab's key.
   * It then navigates to a new path based on the selected tab's key.
   *
   * @param {string} activeKey - The selected tab's key.
   */
  const handleTabChange = (activeKey) => {
    router.push(`/person/${ID}/research/${activeKey}`);
  };

  return (
    <Tabs
      activeKey={activeTab}
      onChange={handleTabChange}
      items={items}
      type="card"
      destroyInactiveTabPane
    />
  );
}
