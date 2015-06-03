// IMPORTS =========================================================================================
import {map} from "ramda";

// HELPERS =========================================================================================
export function toSingleMessage(joiResult) {
  return map(error => error.message, joiResult.error.details);
}