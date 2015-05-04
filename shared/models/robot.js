// IMPORTS =========================================================================================
import UUID from "node-uuid";

// MODELS ==========================================================================================
export default function Robot(data) {
  // TODO validate, based on shared/validators/xxx
  if (!data.name) {
    throw Error("data.name is required");
  }
  if (!data.assemblyDate) {
    throw Error("data.assemblyDate is required");
  }
  if (!data.manufacturer) {
    throw Error("data.manufacturer is required");
  }

  return Object.assign({
    id: UUID.v4()
  }, data);
}