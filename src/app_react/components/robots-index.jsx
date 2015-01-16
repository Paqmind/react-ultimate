// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State],

  componentDidMount() {
    console.debug("RobotsIndex.componentDidMount");
  },

  render() {
    console.debug("RobotsIndex.render", this.getParams());
    return (
      <DocumentTitle title="Robots">
        <div>
          <p>Robots</p>
          <ul>
            <li><Link to="robots-detail" params={{id: 1}}>Robot-1</Link></li>
            <li><Link to="robots-detail" params={{id: 2}}>Robot-2</Link></li>
            <li><Link to="robots-detail" params={{id: 3}}>Robot-3</Link></li>
          </ul>
          <Router.RouteHandler/>
        </div>
      </DocumentTitle>
    );
  }
});
