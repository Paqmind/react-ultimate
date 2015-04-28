// IMPORTS =========================================================================================
import UUID from "node-uuid";

// MODELS ==========================================================================================
export default function Alert(data) {
  return Object.assign({
    id: UUID.v4(),
    message: undefined,
    category: undefined,
    closable: true,
    expire: 5000,
  }, data);
}