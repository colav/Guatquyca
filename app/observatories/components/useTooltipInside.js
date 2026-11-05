"use client";

/* Hooks */
import { useEffect, useRef } from "react";

const MARGIN = 8;

/**
 * Keeps the tooltip of a chart inside the window (F39b). G2 flips the tooltip only against the
 * chart, and a wide tooltip (up to 560 px) can still go out of a narrow window (768 px). The tooltip
 * is a child of the chart container, so a change of its position is watched there and, when its
 * target position leaves the window, it is moved back; it may then cover the point, which is
 * harmless because the tooltip does not take the pointer.
 *
 * @returns {React.RefObject<HTMLElement>} Ref for the element that wraps the chart.
 */
export function useTooltipInside() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof MutationObserver === "undefined") return undefined;
    const keepInside = (tooltip) => {
      const parent = tooltip.offsetParent;
      if (!parent) return;
      const left = Number.parseFloat(tooltip.style.left);
      if (!Number.isFinite(left)) return;
      const windowWidth = document.documentElement.clientWidth;
      const parentLeft = parent.getBoundingClientRect().left;
      const right = parentLeft + left + tooltip.offsetWidth;
      let shift = 0;
      if (right > windowWidth - MARGIN) shift = windowWidth - MARGIN - right;
      if (parentLeft + left + shift < MARGIN) shift = MARGIN - (parentLeft + left);
      if (Math.abs(shift) >= 1) tooltip.style.left = `${left + shift}px`;
    };
    const observer = new MutationObserver(() => root.querySelectorAll(".g2-tooltip").forEach(keepInside));
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);
  return ref;
}
