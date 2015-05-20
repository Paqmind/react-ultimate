// IMPORTS =========================================================================================
import {root} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import {RouteHandler} from "react-router";
import state from "frontend/state";
import {Component, Menu, Headroom, Footer} from "frontend/components/simple";
import alertActions from "frontend/actions/alert";
import AlertIndex from "frontend/components/model/alert-index";

// BODY ============================================================================================
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
    //return alertActions.loadPage();
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
    if (!this.state.menuCollapse) { return; }

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
              <Link className="navbar-brand" to="about"><span className="light">React</span>Ultimate</Link>
            </div>
            <Menu menuCollapse={this.state.menuCollapse}/>
          </div>
        </Headroom>

        <main id="main">
          <RouteHandler/>
        </main>

        <Footer/>

        <AlertIndex/>
      </div>
    );
  }
}
