// IMPORTS =========================================================================================
import UUID from "node-uuid";
import {merge} from "ramda";

// MODELS ==========================================================================================
export function Alert(data) {
  // TODO validate, based on shared/validators/xxx
  if (!data.message) {
    throw Error("data.message is required");
  }
  if (!data.category) {
    throw Error("data.category is required");
  }
  return merge({
    id: UUID.v4(),
    closable: true,
    expire: data.category == "error" ? 0 : 5000,
    createdDate: data.createdDate ? data.createdDate : new Date()
  }, data);
}
