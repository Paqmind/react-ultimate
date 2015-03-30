// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link, RouteHandler} = ReactRouter;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
export default React.createClass({
  propTypes() {
    return {
      title: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
    };
  },

  render() {
    return (
      <section className="container">
        <h1>{this.props.title}</h1>
        <p className="error">{this.props.description}</p>
      </section>
    );
  }
});
