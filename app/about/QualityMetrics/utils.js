import { lime, volcano } from "@ant-design/colors";

export const CELL_W = 140;
export const LABEL_W = 220;

export const INTERSECTION_COLOR = lime[6];
export const EXCLUSIVE_COLOR = volcano[5];

export const fmt = (n) =>
  n != null ? Number(n).toLocaleString("es-CO") : "—";

export const pct = (v, t) =>
  t > 0 ? Number(((v / t) * 100).toFixed(1)) : 0;

export const shortDate = (ts) => {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

export const dig = (obj, path) =>
  path.split(".").reduce((a, k) => (a != null ? a[k] : null), obj);
