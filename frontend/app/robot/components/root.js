// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {RouteHandler} = Router;
let Reflux = require("reflux");
let Store = require("../store");

// EXPORTS =========================================================================================
let Root = React.createClass({
  componentDidMount() {
  },

  render() {
    return (
      <RouteHandler/>
    );
  }
});

export default Root;
