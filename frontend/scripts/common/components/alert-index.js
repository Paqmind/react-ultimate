// IMPORTS =========================================================================================
let React = require("react");
//let CSSTransitionGroup = require("rc-css-transition-group");

let {toArray} = require("frontend/common/helpers");
let Loading = require("frontend/common/components/loading");
let NotFound = require("frontend/common/components/not-found");
let AlertItem = require("frontend/common/components/alert-item");
let state = require("frontend/state");

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
