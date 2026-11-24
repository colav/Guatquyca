/**
 * The twelve documents of policy analysed by the boards, in the order of Gabriel (F69, X-02). Single source of the
 * order of «Documento de política» in the three boards and of the tabs of the indicator 14 of Board 2.
 */
export const POLICY_DOCUMENTS = Object.freeze([
  "PDD mpal Medellín",
  "PDD dptal Antioquia",
  "CONPES 4069",
  "Misión de sabios 2019",
  "CONPES 4144",
  "Plan Decenal CTI Medellín 2024-2033",
  "Política Nacional de Ciencia Abierta 2022-2031",
  "Recomendación UNESCO sobre la Ciencia Abierta 2021",
  "Plan Nacional de Cultura 2024-2038",
  "OECD STI Outlook 2025",
  "Marco UNESCO de Educación Cultural y Artística 2025",
  "Global Sustainable Development Report 2023 (ONU)",
]);

/** Position of a document in the list (the unknown ones go last). */
export const policyRank = (name) => {
  const i = POLICY_DOCUMENTS.indexOf(name);
  return i < 0 ? POLICY_DOCUMENTS.length : i;
};
