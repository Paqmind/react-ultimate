import {addIndex, map} from "ramda"
import Class from "classnames"
import React from "react"
import {ShallowComponent} from "frontend/components/common"

let mapIndexed = addIndex(map)

export default class SortBy extends ShallowComponent {
  static propTypes = {
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

  onClick(event, sort) {
    event.preventDefault()
    this.hideDropdown()
    this.props.onClick([sort])
  }

  render() {
    let {makeHref, options, current} = this.props

    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" onClick={this.toggle}>
          Sort by {current || "Default"} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {mapIndexed((sort, i) => {
            return (
              <li key={i} role="presentation" className={Class({active: sort == current})}>
                <a href={makeHref ? makeHref([sort]) : "#"}
                  onClick={event => this.onClick(event, sort)}
                  title="" tabIndex="-1">
                  {sort || "Any"}
                </a>
              </li>
            )
          }, options)}
        </ul>
      </div>
    )
  }
}
