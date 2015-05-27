// IMPORTS =========================================================================================
import classNames from "classnames";
import React from "react";
import {Link} from "react-router";
import alertActions from "frontend/scripts/actions/alert";
import {ShallowComponent} from "frontend/scripts/components/simple";

// EXPORTS =========================================================================================
class CloseLink extends ShallowComponent {
  handleClick(event) {
    event.preventDefault();
    this.props.onClick();
  }

  render() {
    return (
      <a className="close pull-right" href="#" onClick={this.handleClick}>&times;</a>
    );
  }
}

export default class Item extends ShallowComponent {
  static propTypes = {
    model: React.PropTypes.object,
  }

  render() {
    let model = this.props.model;

    let classes = classNames({
      "alert": true,
      ["alert-" + model.category]: true,
      "animated": this.props.animated ? true : false
    });

    return (
      <div className={classes} {...this.props}>
        {model.closable ? <CloseLink onClick={() => alertActions.removeModel(model.id)}/> : ""}
        {model.message}
      </div>
    );
  }
}
