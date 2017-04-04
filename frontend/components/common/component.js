import {filter} from "ramda"
import {shallowCompare, deepCompare} from "frontend/helpers/react"
import React from "react"

class Component extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
  }
}

class ShallowComponent extends Component {
  shouldComponentUpdate = shallowCompare
}

class DeepComponent extends Component {
  shouldComponentUpdate = deepCompare
}

export {
  Component, ShallowComponent, DeepComponent,
}

function getAllMethods(obj) {
  return filter(key => typeof obj[key] == "function", Object.getOwnPropertyNames(obj))
}

function autoBind(obj) {
  getAllMethods(obj.constructor.prototype)
    .forEach(mtd => {
      obj[mtd] = obj[mtd].bind(obj)
    })
}

