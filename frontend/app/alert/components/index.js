// IMPORTS =========================================================================================
let React = require("react");
let {CSSTransitionGroup} = require("react/addons").addons;
let Reflux = require("reflux");
let AlertActions = require("frontend/alert/actions");
let AlertStore = require("frontend/alert/stores");
let AlertItem = require("frontend/alert/components/item");

// EXPORTS =========================================================================================
let Index = React.createClass({
  mixins: [Reflux.connect(AlertStore, "models")],

  componentDidMount() {
    AlertActions.loadMany();
  },

  render() {
    return (
      <div className="notifications top-left">
        <CSSTransitionGroup transitionName="fade" component="div">
          {this.state.models.toArray().map(model => <AlertItem model={model} key={model.id}/>)}
        </CSSTransitionGroup>
      </div>
    );
  }
});

export default Index;
