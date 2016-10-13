import classNames from "classnames"
import React from "react"
import {Link} from "react-router"
import * as alertActions from "frontend/actions/alert"
import {ShallowComponent} from "frontend/components/common"

class CloseLink extends ShallowComponent {
  handleClick(event) {
    event.preventDefault()
    this.props.onClick()
  }

  render() {
    return (
      <button className="close" onClick={this.handleClick}>&times;</button>
    )
  }
}

export default class Item extends ShallowComponent {
  static propTypes = {
    item: React.PropTypes.object,
  }

  render() {
    let item = this.props.item

    let classes = classNames({
      "alert": true,
      ["alert-" + item.category]: true,
      "animated": this.props.animated,
      "alert-dismissible": item.closable === false
    })

    return (
      <div className={classes} {...this.props}>
        {item.closable === false ? <CloseLink onClick={() => alertActions.removeItem(item.id)}/> : ""}
        {item.message}
      </div>
    )
  }
}
