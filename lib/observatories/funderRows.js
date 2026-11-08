/**
 * Rows of the ranking of funders of the Board 2 (Q-15, F90): the name shown is the normalised one of the bundle (`nm`); when the
 * backend changed it (`ext.nombres_originales`, B144) the name that came with the data goes in the tooltip, in its own line.
 *
 * @param {{ nm: string, fsector: * , proyectos: number }[]} funders
 * @param {Object<string, string>} [originals] - `ext.nombres_originales`: displayed name -> original name.
 * @param {(f: Object) => string} seriesOf - Name of the sector series of a funder.
 */
export function funderRows(funders, originals, seriesOf) {
  const known = originals || {};
  return funders.map((f) => {
    const label = f.nm.trim();
    const original = known[label];
    return {
      label,
      ...(original && original !== label ? { detail: original, detailName: "Nombre original" } : {}),
      segments: [{ series: seriesOf(f), value: f.proyectos }],
    };
  });
}
