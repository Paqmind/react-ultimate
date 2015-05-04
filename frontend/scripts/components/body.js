// IMPORTS =========================================================================================
import {root} from "baobab-react/decorators";
import React from "react";
import {Link, RouteHandler} from "react-router";
import state from "frontend/state";
import Component from "frontend/component";
import commonActions from "frontend/actions";
import Headroom from "frontend/components/headroom";
import AlertIndex from "frontend/components/alert-index";

// EXPORTS =========================================================================================
@root(state)
export default class Body extends Component {
  //static loadPage(params, query) {
    // Ignore params and query
    // establishPage(params, query);
    //return commonActions.alert.loadPage();
  //}

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
                <li><Link to="robot-index">Robots</Link></li>
                <li><Link to="monster-index">Monsters</Link></li>
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
