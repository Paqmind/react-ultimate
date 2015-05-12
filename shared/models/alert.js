// IMPORTS =========================================================================================
import UUID from "node-uuid";

// MODELS ==========================================================================================
export function Alert(data) {
  // TODO validate, based on shared/validators/xxx
  if (!data.message) {
    throw Error("data.message is required");
  }
  if (!data.category) {
    throw Error("data.category is required");
  }
  return Object.assign({
    id: UUID.v4(),
    closable: true,
    expire: data.category == "error" ? 0 : 5000,
    createdDate: data.createdDate ? data.createdDate : new Date()
  }, data);
}
