"use client";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Breadcrumb } from "antd";

/* Constants */
/** Full available width up to this maximum (D-102 complement, F23); centered on larger screens. */
export const PAGE_MAX_WIDTH = 1920;

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
    <main style={{ width: "100%", maxWidth: PAGE_MAX_WIDTH, margin: "0 auto", padding: "16px max(16px, env(safe-area-inset-left))", boxSizing: "border-box" }}>
      <Breadcrumb items={items} style={{ marginBottom: 16 }} />
      {children}
    </main>
  );
}
