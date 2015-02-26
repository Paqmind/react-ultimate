// IMPORTS =========================================================================================
let React = require("react");
let Reflux = require("reflux");
let ReactRouter = require("react-router");
let {RouteHandler} = ReactRouter;

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
