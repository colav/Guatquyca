"use client";

/* Utilities */
import { useState } from "react";
/* UI Library Icons */
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
/* Styles */
import styles from "./styles.module.css";

// Owns only the collapse state. Sidebar y contenido llegan ya renderizados
// desde el server component (page.js), así el fetching se queda en el server.
export default function NewsletterShell({ sidebar, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <div
        className={
          collapsed
            ? `${styles.sidebarWrapper} ${styles.sidebarCollapsed}`
            : styles.sidebarWrapper
        }
      >
        {sidebar}
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className={
          collapsed
            ? `${styles.toggleButton} ${styles.toggleCollapsed}`
            : styles.toggleButton
        }
        aria-label={
          collapsed
            ? "Mostrar listado de boletines"
            : "Ocultar listado de boletines"
        }
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
