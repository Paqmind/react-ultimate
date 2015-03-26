// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link, RouteHandler} = ReactRouter;
let AlertIndex = require("frontend/alert/components/index");
let Headroom = require("../../common/components/headroom");

// EXPORTS =========================================================================================
export default React.createClass({
  render() {
    let headroomClassNames = {visible: 'navbar-down', hidden: 'navbar-up'};
    return (
      <div>
        <Headroom component="header" id="page-header" className="navbar navbar-default" classNames={headroomClassNames}>
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
        </Headroom>

        <main id="page-main">
          <RouteHandler/>
        </main>

        <AlertIndex/>
      </div>
    );
  }
});
