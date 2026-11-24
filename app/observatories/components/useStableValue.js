"use client";

/* Hooks */
import { useRef } from "react";

/**
 * Returns the previous reference while the value has the same content, so a memoized chart only
 * redraws when its own data changed (the whole result is recomputed on every filter change).
 *
 * @param {*} value - JSON-serializable value.
 * @returns {*}
 */
export function useStableValue(value) {
  const ref = useRef({ key: null, value });
  const key = JSON.stringify(value);
  if (ref.current.key !== key) ref.current = { key, value };
  return ref.current.value;
}
