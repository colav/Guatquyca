/** FWCI above this value is drawn with the size of this value (the scatter and its size legend). */
export const FWCI_CAP = 8;

/** Radius range of the points (px): the minimum leaves every shape recognisable (F39). */
export const SIZE_RANGE = Object.freeze([5, 13]);

/**
 * Punctual presence is drawn 70 % smaller than its FWCI would give (D-139, F46b): it has many points and
 * their FWCI, from few products, makes them big and noisy. The factor is applied to the size (diameter);
 * the minimum diameter (px) keeps the X readable for a low FWCI.
 */
export const PUNTUAL_SIZE_FACTOR = 0.3;
export const PUNTUAL_MIN_SIZE = 5;

/** Radius (px) of a point of a given FWCI, the same sqrt scale as the chart. */
export const sizeFor = (fwci) => SIZE_RANGE[0] + (SIZE_RANGE[1] - SIZE_RANGE[0]) * Math.sqrt(Math.min(Math.max(fwci, 0), FWCI_CAP) / FWCI_CAP);

/** Radius (px) of the point of a unit: the one of its FWCI, smaller for punctual presence. */
export const pointRadius = (fwci, punctual = false) => (punctual ? Math.max(PUNTUAL_MIN_SIZE / 2, sizeFor(fwci) * PUNTUAL_SIZE_FACTOR) : sizeFor(fwci));
