import {map} from "ramda"
import React from "react"
import ReactAddons from "react/addons"
import {branch} from "baobab-react/decorators"
import {DeepComponent} from "frontend/components/common"
import AlertItem from "frontend/components/item/alert"

let CSSTransitionGroup = ReactAddons.addons.CSSTransitionGroup

@branch({
  cursors: {
    items: ["alertQueue"],
  }
})
export default class AlertIndex extends DeepComponent {
  render() {
    let {items} = this.props

    return (
      <div className="special-layer top-right">
        <CSSTransitionGroup component="div" transitionName="fadeUp">
          {map(item => <AlertItem item={item} key={item.id} animated={true}/>, items)}
        </CSSTransitionGroup>
      </div>
    )
  }
}
