import Class from "classnames";
import React from "react";
import {Link} from "react-router";
import {RouteHandler} from "react-router";
import {root} from "baobab-react/decorators";
import state from "frontend/state";
import {Component} from "frontend/components/component";
import Menu from "frontend/components/menu";
import Header from "frontend/components/header/header";
import Footer from "frontend/components/footer/footer";
import AlertIndex from "frontend/components/index/alert";

// BODY ============================================================================================
@root(state)
export default class Body extends Component {
  constructor() {
    super();
    this.state = {
      menuCollapse: false
    };
  }

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
    let headerToggleClasses = {visible: "navbar-down", hidden: "navbar-up"};
    return (
      <div>
         <Header component="header" className="navbar navbar-default headroom" toggleClasses={headerToggleClasses}>
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
        </Header>

        <div className="content">
          <RouteHandler/>
        </div>

        <Footer/>

        <AlertIndex/>
      </div>
    );
  }
}
