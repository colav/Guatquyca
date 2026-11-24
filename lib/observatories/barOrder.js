/**
 * Default order of the bars of the three boards (Q-02, D-202): from the largest to the smallest value.
 * The sort is stable (equal values keep the order they came in). A chart with its own natural order
 * (the years, the age ranges, the fixed categories such as local / departmental / national / international)
 * passes `keepOrder` and is drawn as given.
 *
 * @template T
 * @param {T[]} rows
 * @param {(row: T) => number} valueOf - The size of the bar (the total of a stacked row).
 * @param {boolean} [keepOrder] - Leave the rows as they come.
 * @returns {T[]}
 */
export function barsDescending(rows, valueOf, keepOrder = false) {
  if (keepOrder) return rows;
  return rows
    .map((row, index) => ({ row, index, value: Number(valueOf(row)) || 0 }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
    .map((x) => x.row);
}

/** Total of a stacked row of Board 3 (`values`). */
export const stackedTotal = (row) => row.values.reduce((a, v) => a + v, 0);

/** Total of a stacked row of Board 2 (`segments`). */
export const segmentsTotal = (row) => row.segments.reduce((a, s) => a + s.value, 0);
