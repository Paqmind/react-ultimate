import {addIndex, map} from "ramda"
import Class from "classnames"
import React from "react"
import {ShallowComponent} from "frontend/components/common"

let mapIndexed = addIndex(map)

export default class FilterBy extends ShallowComponent {
  static propTypes = {
    field: React.PropTypes.string.isRequired,
    makeHref: React.PropTypes.func,
    onClick: React.PropTypes.func.isRequired,
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    current: React.PropTypes.string,
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

  onClick(event, field, filter) {
    event.preventDefault()
    this.hideDropdown()
    this.props.onClick({[field]: filter})
  }

  render() {
    let {makeHref, options, current, field} = this.props

    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" onClick={this.toggle}>
          Filter by {field} = {current ? current : "Any"} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {mapIndexed((filter, i) => {
            return (
              <li key={i} role="presentation" className={Class({active: filter == current})}>
                <a href={makeHref ? makeHref({[field]: filter}) : "#"}
                  onClick={event => this.onClick(event, field, filter)}
                  title="" tabIndex="-1">
                  {filter || "Any"}
                </a>
              </li>
            )
          }, options)}
        </ul>
      </div>
    )
  }
}
