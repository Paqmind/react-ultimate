import {map, minBy, sortBy} from "ramda";
import React from "react";
import ReactAddons from "react/addons";
import {branch} from "baobab-react/decorators";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";
import {DeepComponent} from "frontend/components/component";
import {Error, Loading, NotFound} from "frontend/components/special";
import AlertItem from "frontend/components/item/alert";

import "frontend/components/index/alert.less";

// GLOBALS =========================================================================================
let CSSTransitionGroup = ReactAddons.addons.CSSTransitionGroup;

// tests  ======>
//
//alertActions.addModel({message: "1. Message success", category: "success"});
//alertActions.addModel({message: "2. Message loooong success", category: "success"});
//alertActions.addModel({message: "3. Message success", category: "success"});
//
//setTimeout(function(){
//  alertActions.addModel({message: "4. Message error", category: "error"});
//}, 3000);
//
//setTimeout(function(){
//  alertActions.addModel({message: "5. Message warning", category: "warning"});
//}, 11000);
//
//setTimeout(function(){
//  alertActions.addModel({message: "6. Message info", category: "info"});
//}, 18000);
//
//alertActions.addModel({message: "7. Message success", category: "success"});
//alertActions.addModel({message: "8. Message loooong success", category: "success"});
//alertActions.addModel({message: "9. Message success", category: "success", closable: false});
//
// <=======

let alertsQueue = new Set();
let alertToHide = undefined;

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    alerts: "alerts",
  },

  facets: {
    currentAlerts: "currentAlerts",
  }
})
export default class AlertIndex extends DeepComponent {
  processAlertsQueue() {
    if (!alertsQueue.size || alertToHide) {
      return;
    }
    alertToHide = minBy(m => m.createdDate, Array.from(alertsQueue));
    setTimeout(() => {
      if (alertToHide.id in this.props.alerts.models) {
        alertActions.removeModel(alertToHide.id);
        alertsQueue.delete(alertToHide);
      }
      alertToHide = undefined;
      this.processAlertsQueue();
    }, alertToHide.expire);
  }

  updateAlertsQueue() {
    alertsQueue = new Set();
    toArray(this.props.currentAlerts)
      .filter((item) => { return item.expire ? item : null; })
      .forEach((item) => alertsQueue.add(item));
  }

  componentDidMount() {
    this.updateAlertsQueue();
    this.processAlertsQueue();
  }

  componentDidUpdate() {
    this.updateAlertsQueue();
    this.processAlertsQueue();
  }

  render() {
    let {loading, loadError} = this.props.alerts;
    let models = this.props.currentAlerts;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <div className="index-alert top-right">
          <CSSTransitionGroup component="div" transitionName="fadeUp">
            {map(model => <AlertItem model={model} key={model.id} animated={true}/>, models)}
          </CSSTransitionGroup>
          {loading ? <Loading/> : ""}
        </div>
      );
    }
  }
}
