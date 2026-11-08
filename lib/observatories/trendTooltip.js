/**
 * Tooltip item of the trend lines of the Tablero 2 (F85, N-01): each series says its own name and its unit
 * (productos, proyectos, patentes) instead of «Productos» for all.
 *
 * @param {{ series: string, unit?: string, value: number }} d - Datum of the line.
 */
export function trendTooltipItem(d) {
  return { name: d.series, value: `${Number(d.value).toLocaleString("es-CO")}${d.unit ? ` ${d.unit}` : ""}` };
}
