"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

/* Charts */
import { MindMap } from "@ant-design/graphs";

/* Data */
import ourData from "@/lib/Data/ourData.json";

/* Styles */
import Loading from "@/app/loading";
import styles from "./styles.module.css";

/**
 * MindMapChart renders the ImpactU knowledge-graph mind map lazily.
 *
 * The layout work performed by @ant-design/graphs can be expensive, so the
 * component avoids mounting the chart until the container is close to the
 * viewport and then defers the heavy render to an idle/timeout window.
 * This keeps the surrounding page responsive while the chart is not yet in
 * view.
 */
function MindMapChart() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let idleId;
    let timeoutId;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => setShouldRender(true), {
        timeout: 500,
      });
    } else {
      // Fallback for browsers without requestIdleCallback (e.g. Safari)
      timeoutId = setTimeout(() => setShouldRender(true), 0);
    }

    return () => {
      if (idleId && window.cancelIdleCallback)
        window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible]);

  const options = useMemo(
    () => ({
      type: "boxed",
      autoFit: "view",
      data: ourData,
      transforms: (prev) => [
        ...prev.filter(
          (transform) => transform.type !== "collapse-expand-react-node",
        ),
        {
          ...prev.find(
            (transform) => transform.type === "collapse-expand-react-node",
          ),
          enable: true,
        },
      ],
    }),
    [],
  );

  return (
    <div className={styles.outer_container} ref={containerRef}>
      <div className={styles.chart}>
        {shouldRender ? (
          <MindMap {...options} />
        ) : (
          <Loading height="100%" text="Cargando grafo..." />
        )}
      </div>
    </div>
  );
}

export default memo(MindMapChart);
