// IMPORTS =========================================================================================
let React = require("react");
let {CSSTransitionGroup} = require("react/addons").addons;
let {toArray} = require("frontend/common/helpers");
let Loading = require("frontend/common/components/loading");
let NotFound = require("frontend/common/components/notfound");
let State = require("frontend/state");
let AlertItem = require("frontend/alert/components/item");

// COMPONENTS ======================================================================================
export default React.createClass({
  mixins: [State.mixin],

  cursors: {
    alerts: ["alerts"],
  },

  render() {
    let {models, loading, loadError} = this.state.cursors.alerts;
    models = toArray(models);

    if (loadError) {
      return <NotFound/>;
    } else {
      return (
        <div className="notifications top-left">
          <CSSTransitionGroup transitionName="fade" component="div">
            {models.map(model => <AlertItem model={model} key={model.id}/>)}
          </CSSTransitionGroup>
          {loading ? <Loading/> : ""}
        </div>
      );
    }
  }
});
