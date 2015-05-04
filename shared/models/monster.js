// IMPORTS =========================================================================================
import UUID from "node-uuid";

// MODELS ==========================================================================================
export default function Monster(data) {
  // TODO validate, based on shared/validators/xxx
  if (!data.name) {
    throw Error("data.name is required");
  }
  if (!data.birthDate) {
    throw Error("data.birthDate is required");
  }
  if (!data.citizenship) {
    throw Error("data.citizenship is required");
  }

  return Object.assign({
    id: UUID.v4()
  }, data);
}