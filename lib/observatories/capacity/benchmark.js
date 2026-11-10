/* Constants & utils */
import { officialFwci } from "./fwci";

/**
 * A benchmark provider turns a unit into the capacity ratio (UdeA citations over the benchmark
 * citations) used by the categories. It is injected, so the real benchmark (most cited
 * institution, global and national, from the OpenAlex API, D-102) can replace the substitute
 * without touching the computation.
 *
 * @typedef {Object} BenchmarkProvider
 * @property {string} id
 * @property {boolean} isMock - True while the ratio is not the real one.
 * @property {(unit: { id: *, level: string, citations: number, count: number, worldMean: number }, basis: string) => number} ratio
 */

/**
 * [mock] Substitute of the artifact: the FWCI capped to 1. It cannot tell national from global,
 * so both bases return the same ratio.
 *
 * @type {BenchmarkProvider}
 */
export const substituteBenchmark = Object.freeze({
  id: "artifact-fwci-proxy",
  isMock: true,
  ratio(unit) {
    const fwci = officialFwci(unit);
    return Math.min(Number.isFinite(fwci) ? fwci : 0, 1);
  },
});
