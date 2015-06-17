import {filter} from "ramda";
import {shallowCompare, deepCompare} from "frontend/helpers/react";
import React from "react";

// COMPONENTS ======================================================================================
export class Component extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
}

export class ShallowComponent extends Component {
  shouldComponentUpdate = shallowCompare;
}

export class DeepComponent extends Component {
  shouldComponentUpdate = deepCompare;
}

// HELPERS =========================================================================================
function getAllMethods(obj) {
  return filter(key => typeof obj[key] == "function", Object.getOwnPropertyNames(obj));
}

function autoBind(obj) {
  getAllMethods(obj.constructor.prototype)
    .forEach(mtd => {
      obj[mtd] = obj[mtd].bind(obj);
    });
}

