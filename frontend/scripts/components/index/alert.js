// IMPORTS =========================================================================================
import {map, minBy, sortBy} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import ReactAddons from "react/addons";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";
import {DeepComponent} from "frontend/components/component";
import Error from "frontend/components/page/error";
import Loading from "frontend/components/page/loading";
import NotFound from "frontend/components/page/notfound";
import AlertItem from "frontend/components/item/alert";

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
// <=======

let alertsQueue = new Set();
let alertsQueueBlocked = false;

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
    if (!alertsQueue.size || alertsQueueBlocked) {
      return;
    }
    alertsQueueBlocked = true;
    let oldestAlert = minBy(m => m.createdDate, Array.from(alertsQueue));
    setTimeout(() => {
      alertActions.removeModel(oldestAlert.id);
      alertsQueue.delete(oldestAlert);
      alertsQueueBlocked = false;
      this.processAlertsQueue();
    }, oldestAlert.expire);
  }

  updateAlertsQueue() {
    toArray(this.props.alerts.models)
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
        <div className="alerts top-right">
          <CSSTransitionGroup component="div" transitionName="fadeUp">
            {map(model => <AlertItem model={model} key={model.id} animated={true}/>, models)}
          </CSSTransitionGroup>
          {loading ? <Loading/> : ""}
        </div>
      );
    }
  }
}
