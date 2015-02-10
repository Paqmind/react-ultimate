// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let Reflux = require("reflux");

// EXPORTS =========================================================================================
let Body = React.createClass({
  render() {
    return (
      <div>
        <header id="page-header" className="navbar navbar-default navbar-fixed-top navbar-down">
          <div className="container">
            <div className="navbar-header">
              <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".navbar-page-header">
                <span className="sr-only">Toggle navigation</span>
                <span className="fa fa-bars fa-lg"></span>
              </button>
              <Link className="navbar-brand" to="home">Dashboard</Link>
            </div>
            <nav className="collapse navbar-collapse navbar-page-header">
              <ul className="nav navbar-nav">
                <li><Link to="home">Home</Link></li>
                <li><Link to="robots-index">Robots</Link></li>
                <li><Link to="about">About</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="page-main">
          <RouteHandler/>
        </main>
      </div>
    );
  }
});

export default Body;
