// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {RouteHandler} = Router;
let Reflux = require("reflux");
let Store = require("../store");

// EXPORTS =========================================================================================
let Root = React.createClass({
  mixins: [Reflux.connect(Store)],

  initialize() {
    //console.log("RobotRoot.initialize");
  },

  componentDidMount() {
    //console.log("RobotRoot.componentDidMount");
  },

  render() {
    //console.log("RobotRoot.render");
    return (
      <RouteHandler models={this.state.models}/>
    );
  }
});

export default Root;
