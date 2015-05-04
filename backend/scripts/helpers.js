// HELPERS =========================================================================================
export function toSingleMessage(joiResult) {
  return joiResult.error.details.map(error => error.message);
}