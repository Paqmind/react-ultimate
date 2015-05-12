// IMPORTS =========================================================================================
import {mapIndexed} from "ramda";
import Class from "classnames";
import React from "react";
import {ShallowComponent, Link} from "frontend/components/simple";

// COMPONENTS ======================================================================================
export default class PerPage extends ShallowComponent {
  static propTypes = {
    route: React.PropTypes.string,
    onClick: React.PropTypes.func,
    options: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    current: React.PropTypes.number,
  }

  constructor(props) {
    if (!props.route && !props.onClick) {
      throw new Error("either route or onClick must be set");
    }
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
    let {route, onClick, options, current} = this.props;

    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" onClick={this.toggle}>
          Per page {current || "Default"} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {mapIndexed((item, i) => {
            if (route) {
              // URL-bound
              return (
                <li key={i} role="presentation" className={Class({active: item == current})}>
                  <Link tabIndex="-1" to={route} withQuery={{page: {limit: item}}} onClick={this.hideDropdown}>
                    {item || "Any"}
                  </Link>
                </li>
              );
            } else {
              // URL-unbound
              return (
                <li key={i} role="presentation" className={Class({active: item == current})}>
                  <a href="#" tabIndex="-1" onClick={() => { onClick(item); this.hideDropdown(); }}>
                    {item || "Any"}
                  </a>
                </li>
              );
            }
          }, options)}
        </ul>
      </div>
    );
  }
}
