// IMPORTS =========================================================================================
let {Record} = require("immutable");

// EXPORTS =========================================================================================
let Alert = Record({
  id: undefined,
  message: undefined,
  category: undefined,
  closable: true,
  expire: 5000,
});

export default Alert;
