// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link, RouteHandler} = ReactRouter;
let AlertIndex = require("frontend/alert/components/index");

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
              <Link className="navbar-brand" to="home"><span className="light">React</span>Starter</Link>
            </div>
            <nav className="collapse navbar-collapse navbar-page-header navbar-right brackets-effect">
              <ul className="nav navbar-nav">
                <li><Link to="home">Home</Link></li>
                <li><Link to="robot-index">Robots</Link></li>
                <li><Link to="about">About</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="page-main">
          <RouteHandler/>
        </main>

        <AlertIndex/>
      </div>
    );
  }
});

export default Body;
