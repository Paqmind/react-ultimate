// IMPORTS =========================================================================================
import React from "react";
import {Component} from "frontend/components/simple";

// EXPORTS =========================================================================================
export class TextHolder extends Component {
  getListOfNodeParents(el) {
    let parents = [];
    while (el) {
      parents.unshift(el);
      el = el.parentNode;
    }
    return parents;
  }

  updateMaxWidth() {
    let sectionNode = React.findDOMNode(this);

    // http://www.pearsonified.com/2012/01/characters-per-line.php
    let lettersPerRow = this.props.lettersPerRow || 80;
    let relation = this.props.relation || 2.1;
    let ps = sectionNode.querySelectorAll("p");
    for (let p of ps)  {
      let parents = this.getListOfNodeParents(p);
      if (parents.filter(item => item.classList ? item.classList.contains("notext-holder") : false).length) {
        continue;
      }

      let fontSize = parseInt(window.getComputedStyle(p)["font-size"]); // result will always in pixels
      let maxWidth = parseInt(lettersPerRow * (fontSize / relation));
      p.style.maxWidth = maxWidth + "px";
    }
  }

  componentDidMount() {
    this.updateMaxWidth();
  }

  componentDidUpdate() {
    this.updateMaxWidth();
  }

  render() {
      if (this.props.children) {
        return React.Children.only(this.props.children);
      } else {
        return null;
      }
    }
}
