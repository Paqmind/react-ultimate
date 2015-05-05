// IMPORTS =========================================================================================
import Class from "classnames";
import React from "react";
import Component from "frontend/component";
import Link from "./link";

// COMPONENTS ======================================================================================
export default class SortBy extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  hideDropdown() {
    this.setState({expanded: false});
  }

  toggle(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({expanded: !this.state.expanded});
  }

  componentDidMount() {
    document.addEventListener("click", this.hideDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.hideDropdown);
  }

  render() {
    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" onClick={this.toggle}>
          SortBy {this.props.current} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {this.props.options.map((item, i) => {
            return <li key={i} role="presentation" className={Class({active: item == this.props.current})}>
              <Link role="menuitem" tabIndex="-1" to="robot-index" withQuery={{sort: item}} onClick={this.hideDropdown}>{item}</Link>
            </li>;
          })}
        </ul>
      </div>
    );
  }
}
