import {filter} from "ramda"
import React from "react"
import ReactDOM from "react-dom"
import {Component, ShallowComponent} from "./component"

export default class TextHolder extends ShallowComponent {
  getListOfNodeParents(el) {
    let parents = []
    while (el) {
      parents.unshift(el)
      el = el.parentNode
    }
    return parents
  }

  updateMaxWidth() {
    let sectionNode = ReactDOM.findDOMNode(this)

    // http://www.pearsonified.com/2012/01/characters-per-line.php
    let lettersPerRow = this.props.lettersPerRow || 80
    let relation = this.props.relation || 2.1
    let ps = sectionNode.querySelectorAll("p")
    let dropDisabledItems = filter(item => item.classList && !item.classList.contains("disable-holder"))
    for (let p of ps)  {
      let parents = this.getListOfNodeParents(p)
      let enabledParents = dropDisabledItems(parents)
      if (enabledParents.length) {
        let fontSize = parseInt(window.getComputedStyle(p)["font-size"]) // result is always px
        let maxWidth = parseInt(lettersPerRow * (fontSize / relation))
        p.style.maxWidth = maxWidth + "px"
      }
    }
  }

  componentDidMount() {
    this.updateMaxWidth()
  }

  componentDidUpdate() {
    this.updateMaxWidth()
  }

  render() {
    if (this.props.children) {
      return React.Children.only(this.props.children)
    } else {
      return null
    }
  }
}
