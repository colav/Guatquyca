"use client";

/* Hooks */
import { useEffect, useRef, useState } from "react";

/* lib */
import { CARD_SHADOW } from "@/lib/observatories/layout";

/* UI Library Components */
import { theme } from "antd";

/**
 * Container of the filters of a board, fixed at the top when the page scrolls (F48b, D-143): opaque, with the
 * same shadow (CARD_SHADOW) and the same radius (token of the card of Ant Design) as the cards. The site
 * header is also sticky (z-index 198), so the container sticks right under it; it stays below the dropdowns
 * and the tooltips (z-index of Ant Design, 1050 and above). It publishes in `--obs-sticky-offset` the height
 * that header and filters take, so that the cards keep their title visible when the page scrolls to them.
 *
 * @param {React.ReactNode} children
 */
export default function StickyFilters({ children }) {
  const ref = useRef(null);
  const { token } = theme.useToken();
  const [top, setTop] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const update = () => {
      /* The element that is fixed at the top, other than this one (the site header), tells how much to leave. */
      const stack = document.elementsFromPoint(Math.max(1, Math.floor(window.innerWidth / 2)), 2);
      let offset = 0;
      for (const el of stack) {
        if (node.contains(el)) continue;
        const position = getComputedStyle(el).position;
        if (position === "sticky" || position === "fixed") offset = Math.max(offset, Math.round(el.getBoundingClientRect().bottom));
      }
      setTop(offset);
      document.documentElement.style.setProperty("--obs-sticky-offset", `${offset + Math.round(node.getBoundingClientRect().height)}px`);
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (observer) observer.observe(node);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (observer) observer.disconnect();
      document.documentElement.style.removeProperty("--obs-sticky-offset");
    };
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Filtros"
      data-testid="filters"
      style={{
        position: "sticky",
        top,
        zIndex: 100,
        background: token.colorBgContainer,
        boxShadow: CARD_SHADOW,
        borderRadius: token.borderRadiusLG,
        padding: 12,
        marginBottom: 16,
      }}
    >
      {children}
    </section>
  );
}
