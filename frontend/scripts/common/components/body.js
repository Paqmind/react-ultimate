// IMPORTS =========================================================================================
let {root} = require("baobab-react/decorators");
let React = require("react");
let {Link, RouteHandler} = require("react-router");

let Component = require("frontend/common/component");
let commonActions = require("frontend/common/actions");
let Headroom = require("frontend/common/components/headroom");
let AlertIndex = require("frontend/common/components/alert-index");
let state = require("frontend/state");

// EXPORTS =========================================================================================
@root(state)
export default class Body extends Component {
  static loadData(params, query) {
    // Ignore params and query
    return commonActions.alert.loadPage();
  }

  render() {
    let headroomClassNames = {visible: "navbar-down", hidden: "navbar-up"};
    return (
      <div>
         <Headroom component="header" id="page-header" className="navbar navbar-default" headroomClassNames={headroomClassNames}>
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
                <li><Link to="robot-index" params={{page: 1}}>Robots</Link></li>
                <li><Link to="about">About</Link></li>
              </ul>
            </nav>
          </div>
        </Headroom>

        <main id="page-main">
          <RouteHandler/>
        </main>

        {/*<AlertIndex/>*/}
      </div>
    );
  }
}
