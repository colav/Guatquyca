"use client";

/* Components */
import { useTooltipInside } from "./useTooltipInside";

/**
 * Wraps a chart so that its tooltip stays inside the window (F42, F39b). The width and the wrapping of the
 * tooltip come from `tooltipInteraction` in the configuration of the chart.
 */
export default function TooltipBox({ children }) {
  const ref = useTooltipInside();
  return <div ref={ref}>{children}</div>;
}
