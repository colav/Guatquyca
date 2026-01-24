export const VALIDATION_STATE = {
  REJECTED: "REJECTED",
  ACCEPTED_WITH_OBSERVATIONS: "ACCEPTED_WITH_OBSERVATIONS",
  ACCEPTED_CLEAN: "ACCEPTED_CLEAN",
};

/**
 * Determines the validation state of a file submission based on backend response parameters.
 *
 * Returns:
 * - VALIDATION_STATE.REJECTED if the submission was not successful (success is false).
 * - VALIDATION_STATE.ACCEPTED_WITH_OBSERVATIONS if there are any warnings or duplicate records.
 * - VALIDATION_STATE.ACCEPTED_CLEAN if the submission is successful and has no warnings or duplicates.
 *
 * @param {boolean} success - Whether the backend accepted the submission.
 * @param {number} [errors=0] - Number of errors found in the submission.
 * @param {number} [warnings=0] - Number of warnings found in the submission.
 * @param {number} [duplicates=0] - Number of duplicate records found in the submission.
 * @returns {string} One of the VALIDATION_STATE values: 'REJECTED', 'ACCEPTED_WITH_OBSERVATIONS', or 'ACCEPTED_CLEAN'.
 */
export function resolveValidationState({
  success,
  warnings = 0,
  duplicates = 0,
}) {
  if (!success) {
    return VALIDATION_STATE.REJECTED;
  }

  if (warnings > 0 || duplicates > 0) {
    return VALIDATION_STATE.ACCEPTED_WITH_OBSERVATIONS;
  }

  return VALIDATION_STATE.ACCEPTED_CLEAN;
}
