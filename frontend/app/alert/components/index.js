// IMPORTS =========================================================================================
let React = require("react");
let {CSSTransitionGroup} = require("react/addons").addons;
let AlertActions = require("frontend/alert/actions");
let AlertItem = require("frontend/alert/components/item");
let State = require("frontend/state");

// EXPORTS =========================================================================================
let Index = React.createClass({
  mixins: [State.mixin],

  cursors: {
    models: ["alerts"],
  },

  //componentDidMount() {
  //  AlertActions.loadMany();
  //},

  render() {
    //console.log("AlertIndex.state.cursors:", this.state.cursors);
    return <div>==alerts==</div>;
    return (
      <div className="notifications top-left">
        <CSSTransitionGroup transitionName="fade" component="div">
          {models.map(model => <AlertItem model={model} key={model.id}/>)}
        </CSSTransitionGroup>
      </div>
    );
  }
});

export default Index;
