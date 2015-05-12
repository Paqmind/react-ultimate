// IMPORTS =========================================================================================
import {map} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import router from "frontend/router";
import robotActions from "frontend/actions/robot";
import {ShallowComponent, DeepComponent, Link, Pagination} from "frontend/components/simple";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import {Error, Loading, NotFound} from "frontend/components/page";
import RobotItem from "./robot-item";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    robots: "robots",
  },

  facets: {
    currentRobots: "currentRobots",
  }
})
export default class RobotIndex extends DeepComponent {
  static loadData = robotActions.establishIndex;

  render() {
    let {total, loading, loadError, filters, sorts, offset, limit} = this.props.robots;
    let models = this.props.currentRobots;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title="Robots">
          <div>
            <RobotIndexActions {...this.props}/>
            <section className="container">
              <h1>Robots</h1>
              <Pagination route="robot-index" total={total} offset={offset} limit={limit}/>
              <div className="row">
                {map(model => <RobotItem model={model} key={model.id}/>, models)}
              </div>
              <Pagination route="robot-index" total={total} offset={offset} limit={limit}/>
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }
}

class RobotIndexActions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props.robots;

    return (
      <div id="actions">
        <div className="container">
          <div className="pull-left">
            <PerPage route="robot-index" options={[3, 5, 10]} current={limit}/>
          </div>
          <div className="pull-left">
            <SortBy route="robot-index" options={["+name", "-name"]} current={sorts[0]}/>
          </div>
          <div className="pull-left">
            <FilterBy field="manufacturer" route="robot-index" options={[undefined, "Russia", "USA"]} current={filters.manufacturer}/>
          </div>
          <div className="pull-right">
            <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}