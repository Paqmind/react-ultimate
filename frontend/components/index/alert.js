import {map} from "ramda";
import React from "react";
import ReactAddons from "react/addons";
import {branch} from "baobab-react/decorators";
import {DeepComponent} from "frontend/components/common";
import AlertItem from "frontend/components/item/alert";

// COMPONENTS ======================================================================================
let CSSTransitionGroup = ReactAddons.addons.CSSTransitionGroup;

@branch({
  models: ["alertQueue"],
})
export default class AlertIndex extends DeepComponent {
  render() {
    let {models} = this.props;

    return (
      <div className="special-layer top-right">
        <CSSTransitionGroup component="div" transitionName="fadeUp">
          {map(model => <AlertItem model={model} key={model.id} animated={true}/>, models)}
        </CSSTransitionGroup>
      </div>
    );
  }
}
