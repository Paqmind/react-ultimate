// IMPORTS =========================================================================================
import {root} from "baobab-react/decorators";
import React from "react";
import {Link, RouteHandler} from "react-router";
import state from "frontend/state";
import Component from "frontend/component";
import commonActions from "frontend/actions";
import Headroom from "frontend/components/headroom";
import AlertIndex from "frontend/components/alert-index";


class Menu extends Component {
  render() {
    return (
      <nav className={"navbar-collapse navbar-page-header navbar-right effect brackets collapse" + (this.props.menuCollapse ? "in" : "")}>
        <ul className="nav navbar-nav">
          <li><Link to="home">Home</Link></li>
          <li><Link to="robot-index" params={{page: 1}}>Robots</Link></li>
          <li><Link to="monster-index">Monsters</Link></li>
          <li><Link to="about">About</Link></li>
        </ul>
      </nav>
    );
  }
}
// EXPORTS =========================================================================================
@root(state)
export default class Body extends Component {
  constructor() {
    super();
    this.state = {
      menuCollapse: false
    };
  }

  //static loadPage(params, query) {
    // Ignore params and query
    // establishPage(params, query);
    //return commonActions.alert.loadPage();
  //}

  hideMenu() {
    this.setState({menuCollapse: false});
  }

  onClickOnNavbarToggle(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({menuCollapse: !this.state.menuCollapse});
  }

  documentClickHandler() {
    if (!this.state.menuCollapse) return;

    // Menu should collapsed on any click (on link, on toogler or outside the block)
    this.hideMenu();
  }

  componentDidMount() {
    document.addEventListener("click", this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentClickHandler);
  }

  render() {
    let headroomClassNames = {visible: "navbar-down", hidden: "navbar-up"};
    return (
      <div>
         <Headroom component="header" id="header" className="navbar navbar-default" headroomClassNames={headroomClassNames}>
          <div className="container">
            <div className="navbar-header">
              <button className="navbar-toggle collapsed" type="button" data-target=".navbar-page-header" onClick={this.onClickOnNavbarToggle}>
                <span className="sr-only">Toggle navigation</span>
                <span className="fa fa-bars fa-lg"></span>
              </button>
              <Link className="navbar-brand" to="home"><span className="light">React</span>Starter</Link>
            </div>
            <Menu menuCollapse={this.state.menuCollapse}/>
          </div>
        </Headroom>

        <main id="main">
          <RouteHandler/>
        </main>

        {/*<AlertIndex/>*/}
      </div>
    );
  }
}
