// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {RouteHandler} = ReactRouter;
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
