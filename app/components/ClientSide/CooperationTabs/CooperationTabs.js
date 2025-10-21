"use client";

/* UI Library Components */
import { Tabs } from "antd";

/**
 * CooperationTabs is a client-side function component that displays a set of tabs for navigating between different cooperation-related pages.
 * When a tab is selected, the component navigates to a new path based on the selected tab's key.
 *
 * @param {string} props.activeTab - The key of the currently active tab.
 *
 * @returns {JSX.Element} A Tabs component from Ant Design library that contains a set of tabs for navigating between different research-related pages.
 */
export default function CooperationTabs({ activeTab, entity }) {
  const items = [
    {
      label: "Movilidad",
      key: "mobility",
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      items={items}
      type="card"
      destroyInactiveTabPane
    />
  );
}
