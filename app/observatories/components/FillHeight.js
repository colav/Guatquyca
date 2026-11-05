"use client";

/* Hooks */
import { useEffect, useRef, useState } from "react";

/**
 * Area that takes the height left in a panel that is stretched to the height of its row (never
 * less than `min`). The chart is drawn out of the flow, so it does not push the panel: the area
 * measures what the row gives and hands that height to `children`.
 *
 * @param {number} min - Minimum height (px).
 * @param {(height: number) => React.ReactNode} children
 */
export default function FillHeight({ min, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(min);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => setHeight(Math.max(min, Math.round(node.clientHeight))));
    observer.observe(node);
    return () => observer.disconnect();
  }, [min]);
  return (
    <div ref={ref} data-testid="fill-height" style={{ flex: "1 1 auto", position: "relative", minHeight: min }}>
      <div style={{ position: "absolute", inset: 0 }}>{children(height)}</div>
    </div>
  );
}
