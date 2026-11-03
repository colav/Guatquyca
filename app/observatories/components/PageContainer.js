"use client";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Breadcrumb } from "antd";

/**
 * Centered container of the observatories pages with its breadcrumb.
 *
 * @param {{ title: string, href?: string }[]} trail - Breadcrumb items; the last one is the current page.
 */
export default function PageContainer({ trail, children }) {
  const items = trail.map((item, i) => ({
    title: item.href && i < trail.length - 1 ? <Link href={item.href}>{item.title}</Link> : item.title,
  }));
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "16px max(16px, env(safe-area-inset-left))" }}>
      <Breadcrumb items={items} style={{ marginBottom: 16 }} />
      {children}
    </main>
  );
}
