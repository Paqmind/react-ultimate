// IMPORTS =========================================================================================
import {map} from "ramda";
import React from "react";
//let CSSTransitionGroup from "rc-css-transition-group";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import {DeepComponent} from "frontend/components/simple";
import {Loading, NotFound} from "frontend/components/page";
import AlertItem from "frontend/components/model/alert-item";

// COMPONENTS ======================================================================================
export default class AlertIndex extends DeepComponent {
  //mixins: [state.mixin],
  //
  //cursors: {
  //  alerts: ["alerts"],
  //},

  render() {
    let {models, loading, loadError} = this.state.cursors.alerts;
    models = toArray(models);

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <div className="notifications top-left">
          {map(model => <AlertItem model={model} key={model.id}/>, models)}
          {loading ? <Loading/> : ""}
        </div>
      );
    }
  }
}

// Can't run this crap for now TODO recheck after transition to Webpack
// 1) react/addons pulls whole new react clone in browserify
// 2) rc-css-transition-group contains uncompiled JSX syntax
// OMG what an idiots &_&

//<CSSTransitionGroup transitionName="fade" component="div">
//  {map(model => <AlertItem model={model} key={model.id}/>, models)}
//</CSSTransitionGroup>
