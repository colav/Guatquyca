/**
 * Unit → subunit (F76 part 3, D-180): `deps_fac[i]` is the index in `facs` of the unit (faculty) of the subunit `deps[i]`
 * (the three bundles, 0 to 23, no exceptions). Without the key (an older bundle) everything works as before.
 */

/**
 * Options of the subunit filter: with a unit chosen, only its subunits; without one, all of them grouped by unit.
 *
 * @param {string[]} deps - Subunit names (`deps`).
 * @param {number[]|undefined} depsFac - Unit index of each subunit (`deps_fac`).
 * @param {string[]} facs - Unit names (`facs`).
 * @param {number} unitIndex - Unit chosen (-1 = none).
 * @param {(i: number) => boolean} [keep] - Subunits offered (default: all).
 * @returns {{value: number, label: string}[]|{label: string, options: {value: number, label: string}[]}[]}
 */
export function subunitOptions(deps, depsFac, facs, unitIndex, keep = () => true) {
  const all = deps.map((name, i) => ({ value: i, label: name })).filter((o) => keep(o.value));
  if (!Array.isArray(depsFac) || depsFac.length !== deps.length) return all;
  if (unitIndex >= 0) return all.filter((o) => depsFac[o.value] === unitIndex);
  const groups = new Map();
  for (const o of all) {
    const u = depsFac[o.value];
    if (!groups.has(u)) groups.set(u, []);
    groups.get(u).push(o);
  }
  return [...groups.entries()]
    .sort((a, b) => String(facs[a[0]]).localeCompare(String(facs[b[0]]), "es"))
    .map(([u, options]) => ({ label: facs[u], options }));
}

/**
 * Change of the unit: a chosen subunit that does not belong to the new unit is cleared (nothing else is touched).
 *
 * @returns {{facultyIndex: number, departmentIndex?: number}}
 */
export function unitChangePatch(depsFac, unitIndex, departmentIndex) {
  const patch = { facultyIndex: unitIndex };
  if (unitIndex >= 0 && departmentIndex >= 0 && Array.isArray(depsFac) && depsFac[departmentIndex] !== unitIndex) patch.departmentIndex = -1;
  return patch;
}

/** Unit of a subunit (-1 when the bundle has no relation). */
export function unitOfSubunit(depsFac, departmentIndex) {
  return Array.isArray(depsFac) && departmentIndex >= 0 && depsFac[departmentIndex] != null ? depsFac[departmentIndex] : -1;
}
