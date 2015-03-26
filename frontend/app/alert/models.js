// IMPORTS =========================================================================================
let UUID = require("node-uuid");

// MODELS ==========================================================================================
export default function Alert(data) {
  if (!data.message) {
    throw Error("`data.message` is required");
  }
  if (!data.category) {
    throw Error("`data.category` is required");
  }
  return Object.assign({
    id: UUID.v4(),
    closable: true,
    expire: 5000,
  }, data);
}