"use client";

/* lib */
import MapLegendMaker from "@/lib/utils/MapLegendMaker";
import { MAP_PALETTE } from "@/lib/constants";
import { TOOLTIP_DOM_STYLES, fitTooltip, tooltipValue } from "@/lib/observatories/mapTooltip";
import { guardRelativeCoordinates, isMapLibraryError } from "./mapGuard";
import MapErrorBoundary from "./MapErrorBoundary";
import { useEffect, useRef, useState, useMemo } from "react";

/**
 * MapChart is a client-side function component that displays an area map.
 *
 * @param {Object[]} data - The data to display in the map.
 * @param {{ field: string, alias: string }[]} [tooltipItems] - Fields of the tooltip (F79; the default is the one this chart always had).
 * @returns {JSX.Element|null} An AreaMap component displaying the data.
 */
const DEFAULT_TOOLTIP_ITEMS = [
  { field: "NOMBRE_DPT", alias: "Departamento:" },
  { field: "name", alias: "País:" },
  { field: "count", alias: "Cantidad:" },
];

/* F126: no `key` by data on purpose: F80 requires that a filter redraws the map in place, not rebuilds it (tested in f80). */
/** F126: the map inside an error boundary («No se pudo dibujar el mapa» + «Reintentar»). */
export default function MapChart(props) {
  return (
    <MapErrorBoundary>
      <MapChartInner {...props} />
    </MapErrorBoundary>
  );
}

function MapChartInner({ data, tooltipItems = DEFAULT_TOOLTIP_ITEMS }) {
  const [AreaMap, setAreaMap] = useState(null);
  const [fatal, setFatal] = useState(null);
  const wrapper = useRef(null);

  useEffect(() => {
    let alive = true;
    // The guard goes on before the first map is built (F126).
    Promise.all([import("@antv/l7-layers"), import("@ant-design/maps")]).then(([l7, mod]) => {
      guardRelativeCoordinates(l7);
      if (alive) setAreaMap(() => mod.AreaMap);
    });
    return () => {
      alive = false;
    };
  }, []);

  /* F126: errors of the map libraries thrown outside React (events of the layers) go to the boundary of the map. */
  useEffect(() => {
    const onError = (event) => {
      if (!isMapLibraryError(event.error)) return;
      event.preventDefault();
      setFatal(event.error);
    };
    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, []);

  const config = useMemo(
    () => ({
      map: {
        type: "mapbox",
        style: "blank",
      },
      source: {
        data: data,
        parser: { type: "geojson" },
      },
      autoFit: true,
      color: {
        field: "log_count",
        value: MAP_PALETTE,
        scale: { type: "quantize" },
      },
      style: {
        opacity: 1,
        stroke: "#ccc",
        lineWidth: 0.6,
        lineOpacity: 1,
      },
      state: {
        active: {
          stroke: "white",
          lineWidth: 1.5,
          lineOpacity: 0.8,
        },
      },
      tooltip: {
        // F84: values wrap (a line feed is a line break) and the box has a width limit; the placement is in the effect below.
        items: tooltipItems.map((item) => ({ ...item, customValue: tooltipValue })),
        domStyles: TOOLTIP_DOM_STYLES,
      },
      zoom: {
        position: "bottomright",
      },
      legend: {
        position: "bottomleft",
        customContent: (title, items) => MapLegendMaker(items, data),
      },
    }),
    [data, tooltipItems],
  );

  const ready = !!AreaMap && !!data?.features?.length;

  /* F84: keeps the tooltip inside the box of the map (flips to the left / up near the edges). It watches the DOM, not the
     config, so the map is not built again when the cursor moves. */
  useEffect(() => {
    const el = wrapper.current;
    if (!ready || !el) return undefined;
    const observer = new MutationObserver(() => fitTooltip(el));
    observer.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [ready]);

  if (fatal) throw fatal;
  if (!ready) return null;

  return (
    <div ref={wrapper} style={{ position: "relative", width: "100%", height: "100%" }}>
      <AreaMap {...config} />
    </div>
  );
}
