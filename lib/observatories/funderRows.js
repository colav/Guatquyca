/**
 * Rows of the ranking of funders of the Board 2: the name shown is the normalised one of the bundle (`nm`, Q-15 of F90). Q-28 part A
 * (F91): the tooltip no longer carries the «Nombre original»; the key `ext.nombres_originales` of the bundle stays in the contract
 * and is simply not read here.
 *
 * @param {{ nm: string, fsector: * , proyectos: number }[]} funders
 * @param {(f: Object) => string} seriesOf - Name of the sector series of a funder.
 */
export function funderRows(funders, seriesOf) {
  return funders.map((f) => ({
    label: f.nm.trim(),
    segments: [{ series: seriesOf(f), value: f.proyectos }],
  }));
}
