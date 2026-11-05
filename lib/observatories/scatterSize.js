/** FWCI above this value is drawn with the size of this value (the scatter and its size legend). */
export const FWCI_CAP = 8;

/** Radius range of the points (px): the minimum leaves every shape recognisable (F39). */
export const SIZE_RANGE = Object.freeze([5, 13]);

/** Radius (px) of a point of a given FWCI, the same sqrt scale as the chart. */
export const sizeFor = (fwci) => SIZE_RANGE[0] + (SIZE_RANGE[1] - SIZE_RANGE[0]) * Math.sqrt(Math.min(Math.max(fwci, 0), FWCI_CAP) / FWCI_CAP);
