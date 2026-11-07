/** Text of the rings (F77, D-182): total at the centre and percentage of each part in the legend. */

/** Percentage without decimals; a part that would give «0 %» is shown as «< 1 %». */
export function ringPercent(value, total) {
  if (!(value > 0) || !(total > 0)) return "0 %";
  const pct = Math.round((value / total) * 100);
  return pct < 1 ? "< 1 %" : `${pct} %`;
}

/** Parts with value, in order, with the percentage text and the total of the ones drawn. */
export function ringParts(labels, values, colors) {
  const parts = labels.map((name, i) => ({ name, color: colors[i], value: values[i] })).filter((p) => p.value > 0);
  const total = parts.reduce((a, p) => a + p.value, 0);
  return { total, totalText: total.toLocaleString("es-CO"), parts: parts.map((p) => ({ ...p, percent: ringPercent(p.value, total) })) };
}
