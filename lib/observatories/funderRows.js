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
    ...(f.cash !== undefined ? { details: fundingDetails(f) } : {}),
    segments: [{ series: seriesOf(f), value: f.proyectos }],
  }));
}

/** COP in millions of pesos with the thousands separator of es-CO: «$237.500 millones»; under half a million, «menos de $1 millón». */
export function millions(cop) {
  const m = Math.round(Number(cop) / 1e6);
  if (m === 0 && Number(cop) > 0) return "menos de $1 millón";
  return `$${m.toLocaleString("es-CO")} millones`;
}

/**
 * Lines of the tooltip of a funder (F93, Q-28 part B): cash, in kind and projects with a declared amount, in COP as the source has
 * them (nothing converted); the number of projects of the bar is the value of the bar itself. The UdeA is not in the ranking.
 */
export function fundingDetails(f) {
  return [
    { name: "Aportes en dinero", value: millions(f.cash) },
    { name: "Aportes en especie", value: millions(f.inKind) },
    { name: "Con monto declarado", value: `${Number(f.withAmount).toLocaleString("es-CO")} ${f.withAmount === 1 ? "proyecto" : "proyectos"}` },
  ];
}
