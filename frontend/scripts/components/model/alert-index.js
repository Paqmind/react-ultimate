// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import {map} from "ramda";
import React from "react";
import min from "lodash.min";
import sortBy from "lodash.sortbyorder";
import ReactAddons from "react/addons";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import {DeepComponent} from "frontend/components/simple";
import {Loading, NotFound} from "frontend/components/page";
import alertActions from "frontend/actions/alert";
import AlertItem from "frontend/components/model/alert-item";

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
})
export default class AlertIndex extends DeepComponent {
  static loadData = alertActions.establishIndex;

  processAlertsQueue() {
    if (!alertsQueue.size || alertsQueueBlocked) return;
    alertsQueueBlocked = true;
    let oldestAlert = min([...alertsQueue], (item) => item.createdDate);
    setTimeout(() => {
      alertActions.removeModel(oldestAlert.id);
      alertsQueue.delete(oldestAlert);
      alertsQueueBlocked = false;
      this.processAlertsQueue();
    }, oldestAlert.expire);
  }

  updateAlertsQueue() {
    toArray(this.props.alerts.models)
      .filter((item) => { return item.expire ? item : null })
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
    let {models, loading, loadError} = this.props.alerts;
    models =  sortBy(toArray(models), v => v.createdDate);

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <div className="alerts top-right">
          <CSSTransitionGroup component="div" transitionName="fadeUp">
            {map(model => <AlertItem model={model} key={model.id} animated={true}/>, models)}
          </CSSTransitionGroup>
          { /*#loading ? <Loading/> : ""*/}
        </div>
      );
    }
  }
}
