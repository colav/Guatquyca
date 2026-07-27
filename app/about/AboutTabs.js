"use client";

import { Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { tabs } from "./tabs";

/**
 * Component for displaying tabs on the About page.
 * @returns
 * The rendered component.
 */
export default function AboutTabs({ activeKey }) {
  const router = useRouter();

  useEffect(() => {
    tabs.forEach((tab) => router.prefetch(`/about/${tab.key}`));
  }, [router]);

  const handleChange = (nextKey) => {
    if (nextKey === activeKey) return;
    router.push(`/about/${nextKey}`);
  };

  const items = tabs.map((tab) => {
    const TabComponent = tab.component;
    return {
      key: tab.key,
      label: tab.label,
      children: <TabComponent />,
    };
  });

  return (
    <Tabs
      activeKey={activeKey}
      items={items}
      centered
      onChange={handleChange}
    />
  );
}
