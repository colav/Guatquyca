"use client";

/* Components */
import { useTooltipInside } from "./useTooltipInside";

/**
 * Wraps a chart so that its tooltip stays inside the window (F42, F39b). The width and the wrapping of the
 * tooltip come from `tooltipInteraction` in the configuration of the chart.
 */
export default function TooltipBox({ children, fill = false }) {
  const ref = useTooltipInside();
  /* fill (Q-04): the box takes the height that the panel has left, for a chart that stretches (FillHeight). */
  return <div ref={ref} style={fill ? { flex: "1 1 auto", display: "flex", flexDirection: "column" } : undefined}>{children}</div>;
}
