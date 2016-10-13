import {addIndex, map} from "ramda"
import Class from "classnames"
import React from "react"
import {ShallowComponent} from "frontend/components/common"

let mapIndexed = addIndex(map)

export default class PerPage extends ShallowComponent {
  static propTypes = {
    makeHref: React.PropTypes.func,
    onClick: React.PropTypes.func.isRequired,
    options: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    current: React.PropTypes.number,
  }

  constructor(props) {
    if (!props.route && !props.onClick) {
      throw Error("either route or onClick must be set")
    }
    super()
    this.state = {
      expanded: false
    }
  }

  hideDropdown() {
    this.setState({expanded: false})
  }

  toggle(event) {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    this.setState({expanded: !this.state.expanded})
  }

  componentDidMount() {
    document.addEventListener("click", this.hideDropdown)
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.hideDropdown)
  }

  onClick(event, limit) {
    event.preventDefault()
    this.hideDropdown()
    this.props.onClick(limit)
  }

  render() {
    let {makeHref, options, current} = this.props

    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" onClick={this.toggle}>
          Per page {current || "Default"} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {mapIndexed((limit, i) => {
            return (
              <li key={i} role="presentation" className={Class({active: limit == current})}>
                <a href={makeHref ? makeHref(limit) : "#"}
                  onClick={event => this.onClick(event, limit)}
                  title="" tabIndex="-1">
                  {limit || "Any"}
                </a>
              </li>
            )
          }, options)}
        </ul>
      </div>
    )
  }
}
