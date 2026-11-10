"use client";

/* Hooks */
import { useEffect, useRef, useState } from "react";

/* lib */
import FilterHelp from "@/app/observatories/components/FilterHelp";
import { CARD_SHADOW } from "@/lib/observatories/layout";

/* UI Library Components */
import { Button, Tag, theme } from "antd";

/* Whether the container was folded: it lasts as long as the page session (module memory, no localStorage, F50). */
let foldedMemory = false;

/**
 * Container of the filters of a board, fixed at the top when the page scrolls (F48b, D-143): opaque, with the
 * same shadow (CARD_SHADOW) and the same radius (token of the card of Ant Design) as the cards. The site
 * header is also sticky (z-index 198), so the container sticks right under it; it stays below the dropdowns
 * and the tooltips (z-index of Ant Design, 1050 and above). It publishes in `--obs-sticky-offset` the height
 * that header and filters take, so that the cards keep their title visible when the page scrolls to them.
 *
 * Foldable (F50, D-147): the button «Filtros (n)» folds the container into a bar of one line with the active
 * filters as tags (at most 56 px); open by default.
 *
 * @param {React.ReactNode} children
 * @param {string[]} active - Active filters as short texts (e.g. «Unidad: Facultad de Medicina»).
 * @param {Function} onReset - Restores the defaults; its button (dashed, right) is in the row of the button «Filtros (n)», open or folded (F53).
 * @param {string} resetLabel - Text of that button.
 * @param {React.ReactNode} [help] - General phrases of the panel (F77b): they go in a «?» next to the button, not under the filters.
 */
export default function StickyFilters({ children, active = [], onReset, resetLabel = "Restablecer filtros", help = null }) {
  const [folded, setFolded] = useState(foldedMemory);
  const toggle = () => {
    foldedMemory = !folded;
    setFolded(!folded);
  };
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
  }, [folded]);

  return (
    <section
      ref={ref}
      aria-label="Filtros"
      data-testid="filters"
      style={{
        position: "sticky",
        top,
        zIndex: 1040,
        background: token.colorBgContainer,
        boxShadow: CARD_SHADOW,
        /* Square top corners (F51); the bottom ones keep the radius of the cards. */
        borderRadius: `0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px`,
        padding: folded ? 8 : 12,
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: folded ? 0 : 8, minHeight: 32 }}>
        <Button size="small" aria-expanded={!folded} data-testid="filters-toggle" onClick={toggle}>
          {folded ? "▸" : "▾"} Filtros ({active.length})
        </Button>
        {help ? <FilterHelp label="del panel">{help}</FilterHelp> : null}
        {folded ? (
          <div data-testid="filters-folded-tags" style={{ display: "flex", gap: 4, overflow: "hidden", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>
            {active.length ? active.map((text) => <Tag key={text} style={{ margin: 0, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis" }} title={text}>{text}</Tag>) : <span style={{ fontSize: 12, color: "rgba(0,0,0,.45)" }}>Sin filtros activos</span>}
          </div>
        ) : <div style={{ flex: 1 }} />}
        {onReset ? <Button size="small" type="dashed" onClick={onReset} data-testid="filters-reset" style={{ flexShrink: 0 }}>{resetLabel}</Button> : null}
      </div>
      <div hidden={folded} data-testid="filters-body">
        {children}
      </div>
    </section>
  );
}
