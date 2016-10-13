import React from "react"
import {Link} from "react-router"
import {Component} from "./component"

export default class Menu extends Component {
  render() {
    return (
      <nav className={"navbar-collapse navbar-page-header navbar-right effect brackets collapse" + (this.props.menuCollapse ? "in" : "")}>
        <ul className="nav navbar-nav">
          <li><Link to="about">About</Link></li>
          <li><Link to="robot-index">Robots</Link></li>
          <li><Link to="monster-index">Monsters</Link></li>
          <li><Link to="tech">Tech</Link></li>
          <li><Link to="credits">Credits</Link></li>
        </ul>
      </nav>
    )
  }
}
