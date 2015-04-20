// IMPORTS =========================================================================================
let React = require("react");

// HELPERS =========================================================================================
function getAllMethods(obj) {
  return Object.getOwnPropertyNames(obj).filter(key => typeof obj[key] == "function");
}

function autoBind(obj) {
  getAllMethods(obj.constructor.prototype)
    .forEach(mtd => {
      obj[mtd] = obj[mtd].bind(obj);
    });
}

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
}