// IMPORTS =========================================================================================
import React from "react";
//let CSSTransitionGroup from "rc-css-transition-group";

import {toArray} from "frontend/common/helpers";
import state from "frontend/common/state";
import Loading from "frontend/common/components/loading";
import NotFound from "frontend/common/components/not-found";
import AlertItem from "frontend/common/components/alert-item";

// COMPONENTS ======================================================================================
export default React.createClass({
  mixins: [state.mixin],

  cursors: {
    alerts: ["alerts"],
  },

  render() {
    let {models, loading, loadError} = this.state.cursors.alerts;
    models = toArray(models);

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <div className="notifications top-left">
          {models.map(model => <AlertItem model={model} key={model.id}/>)}
          {loading ? <Loading/> : ""}
        </div>
      );
    }
  }
});

// Can't run this crap for now TODO recheck after transition to Webpack
// 1) react/addons pulls whole new react clone in browserify
// 2) rc-css-transition-group contains uncompiled JSX syntax
// OMG what an idiots &_&

//<CSSTransitionGroup transitionName="fade" component="div">
//  {models.map(model => <AlertItem model={model} key={model.id}/>)}
//</CSSTransitionGroup>
