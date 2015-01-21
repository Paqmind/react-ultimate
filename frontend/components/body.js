// IMPORTS =========================================================================================
let React = require("react");
let Reflux = require("reflux");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let robotStore = require("../stores").robotStore;

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Reflux.connect(robotStore)],

  componentDidMount() {
    console.debug("Body.componentDidMount");
    console.log("body state:", this.state);
  },

  componentWillUnmount() {
    console.debug("Body.componentWillUnmount");
  },

  render() {
    console.debug("Body.render");
    return (
      <div>
        <header>
          <nav className="navbar navbar-default">
            <div className="container">
              <div className="navbar-header">
                <a className="navbar-brand" href="#">Dashboard</a>
              </div>
              <ul className="nav navbar-nav">
                <li><Link to="home">Home</Link></li>
                <li><Link to="robots-index">Robots</Link></li>
                <li><Link to="about">About</Link></li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="container">
          <RouteHandler models={this.state.models}/>
        </main>
      </div>
    );
  }
});
