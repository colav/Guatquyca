/* APIs */
import { getBoardBundle } from "@/lib/apis/observatory.api";

/* Constants & utils */
import { createCollaborationDataset } from "../collaboration/compute";
import { MOCK_SOURCE } from "./artifactAdapter";

/** Route that serves the JSON embedded in the published Board 2 artifact, plus `funders` ([mock], only with ?source=mock). */
export const BOARD_2_DATA_URL = "/observatories/vri-udea/board-2/data";

/**
 * Data adapter of Board 2. By default it reads the bundle from quyca (02 §3.11, phase B); with
 * `source: "mock"` it reads the artifact JSON (window.T2) that the local route serves. Both give
 * the same dataset. The bundle carries the funders list under `ext.funders` and the artifact
 * under `funders`; here they are put in one place.
 *
 * @param {{ signal?: AbortSignal, source?: string }} [options]
 * @returns {Promise<{ dataset: Object, source: string }>} dataset and the source that was used
 * @throws {Error} With `status` (and `code`, or `isNetwork`) when the source fails.
 */
export async function loadBoard2Dataset({ signal, source } = {}) {
  if (source === MOCK_SOURCE) {
    const response = await fetch(BOARD_2_DATA_URL, { signal });
    if (!response.ok) {
      const error = new Error(`Board 2 data request failed with ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return { dataset: createCollaborationDataset(await response.json()), source: MOCK_SOURCE };
  }
  const bundle = await getBoardBundle("vri-udea", 2, { signal });
  if (!bundle.funders) bundle.funders = (bundle.ext && bundle.ext.funders) || [];
  return { dataset: createCollaborationDataset(bundle), source: "api" };
}
